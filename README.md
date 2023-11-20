# one_page_form  
## Инструкция по использованию формы авторизации для ребрендинга  
  1) git clone <link>  
  2) cd /one_page_form  
  3) docker-compose up --build
По адресу http://127.0.0.1:4000 поднимается приложение  
## По желнию, порт можно сменить следующим образом:
  1) В Dockerfile: EXPOSE 4000 меняем на нужный PORT
  2) в compose.yaml: ports: 4000:4000 меняем на нужный порт
  3) в том же compose.yaml PORT=4000 меняем на нужный порт
