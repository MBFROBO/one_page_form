import uvicorn, yaml, os, aiofiles

from fastapi import FastAPI, File, UploadFile, Cookie, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, Response, HTMLResponse
from fastapi.requests import Request

from typing import Annotated
from pathlib import Path

app = FastAPI()

app.mount('/static', StaticFiles(directory= Path(__file__).parent.absolute() / 'static', html=True),
          name='static')

templates = Jinja2Templates(directory=Path(__file__).parent.absolute() / "temp")

@app.get('/')
async def redirect():
    return RedirectResponse(url='/auth')

@app.get("/auth")
async def root(request:Request):
    try:
        client = request.headers['client']
    except:
        return {'message':"Неверные заголовки запроса. Установите заголовк 'client'"}
    
    with open('/app/db/db.yaml', 'r') as db:
        clients = yaml.safe_load(db)
    try: 
        template = clients['clients'][client]['template_url']
        return templates.TemplateResponse(template, {'request':request})
    except KeyError:
        return {'message':'Вы не зарегистрированы в системе брендирования'}
    
@app.get("/admin")
async def admin(request:Request):
    return templates.TemplateResponse('admin.html', {'request':request})

@app.get('/admin/add_client')
async def add_client(request:Request, auth_farvater_admin_brend:str = Cookie(None)):
    if auth_farvater_admin_brend is not None:
        return templates.TemplateResponse('admin_upload.html', {'request':request})
    else:
        return {'message':'Пользователь не авторизован на системе мониторинга'}
    
    
@app.get('/getCLient')
async def getCLient(request:Request):
    with open('/app/db/db.yaml', 'r') as db:
        clients = yaml.safe_load(db)
    return clients

@app.delete('/deleteClient')
async def deleteClient(request:Request):
    """
        Удаляем клиента
    """
    with open('/app/db/db.yaml', 'r') as db:
        clients = yaml.safe_load(db)
    try:
        
        client = request.headers['client']
        file_path = clients['clients'][client]['template_url']
        
        del clients['clients'][client]
        
    except KeyError:
        return {'error': 'Invalid client'}
    
    with open('/app/db/db.yaml', 'w') as db:
        yaml.dump(clients, db)

    os.remove(Path(__file__).parent.absolute() / f"temp/{file_path}")



@app.post("/admin/add_client")
async def create_upload_files(files: list[UploadFile], request: Request, client: Annotated[str, Form()]):
    """
        Загружаем файлики, хехех
    """
    try:
        with open('/app/db/db.yaml', 'r') as db:
            clients = yaml.safe_load(db)
            
        for file in files:
            template_file_path = Path(__file__).parent.absolute() / f"temp/{file.filename}"
            async with aiofiles.open(template_file_path, 'wb') as out_file:
                content = await file.read()
                await out_file.write(content)
            clients['clients'][client] = {'template_url': file.filename}

            with open('/app/db/db.yaml', 'w') as db:
                yaml.dump(clients, db)
                
        return templates.TemplateResponse('admin_upload.html', {'request':request, 
                                                            'result':f'Загрузка успешно выполнена {[file.filename for file in files]}'})
    except IsADirectoryError:
        return templates.TemplateResponse('admin_upload.html', {'request':request, 
                                                            'result':f'Нужно выбрать файл!'})

if __name__ == "__main__":
    uvicorn.run(app=app, host=os.getenv('HOST'), port=int(os.getenv('PORT')))