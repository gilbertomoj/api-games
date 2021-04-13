# API de jogos 
API utilizada para listagem e cadastro de jogos 
## Endpoints  
### GET /games
O endpoint é responsavel por retornar a listagem de todos os jogos cadastrados no banco

#### Parametros
Nenhum
#### Respostas
##### OK! 200
Caso esta resposta seja enviada serão listados todos os jogos.
Exemplo de resposta : 
```
[
    
    {
        "id": 6,
        "title": "Ragnarok",
        "year": 2001,
        "price": "0",
        "createdAt": "2021-04-10T23:37:19.000Z",
        "updatedAt": "2021-04-10T23:37:19.000Z"
    },
    {
        "id": 8,
        "title": "Crash",
        "year": 2001,
        "price": "20",
        "createdAt": "2021-04-11T02:33:30.000Z",
        "updatedAt": "2021-04-11T02:33:30.000Z"
    },
    {
        "id": 9,
        "title": "Batman",
        "year": 2010,
        "price": "100",
        "createdAt": "2021-04-11T02:35:25.000Z",
        "updatedAt": "2021-04-13T03:38:13.000Z"
    },
    {
        "id": 10,
        "title": "Avengers",
        "year": 2010,
        "price": "30",
        "createdAt": "2021-04-11T02:35:55.000Z",
        "updatedAt": "2021-04-11T02:35:55.000Z"
    }
]
```
##### Falha na autenticação ! 401
Caso esta resposta seja enviada, significa que ocorreu alguma falha na autenticação. Motivos: Token inválido, Token expirado.
Exemplo de resposta : 
```
{
    "err": "Token invalido"
}
```
### POST /auth
O endpoint é responsavel por realizar o login.
#### Parametros
email: E-mail do usuário cadastrado no sistema.

password: Senha do usuário cadastrado no sistema, com determinado e-mail.
Exemplo: 
```
{
    "email":"gibam@gmail.com",
    "password":"1234"
}
```
#### Respostas
##### OK! 200
Caso esta resposta seja enviada será enviado o token JWT para conseguir acessar endpoints protegidos na API.
Exemplo de resposta : 
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnaWJhbUBnbWFpbC5jb20iLCJpYXQiOjE2MTgzMzcyOTksImV4cCI6MTYxODUxMDA5OX0.IbVx9kmNzW6AGG0uh_ImDwPGcccDEc8c2qTbrA0rqiA"
}
```
##### Falha na autenticação ! 401
Caso esta resposta seja enviada, significa que ocorreu alguma falha na autenticação. Motivos: Senha ou email incorretos.
Exemplo de resposta : 
```
{
    err: "Credenciais invalidas"
}
```
