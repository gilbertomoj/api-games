const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const connection = require('./database/database');
const Games = require("./games/Games");
const jwt = require("jsonwebtoken");

const JWTSecret = "dsakfdsfkqe0aksdkasdqwenerk"

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function auth(req, res, next){
    const authToken = req.headers['authorization'];
    if (authToken != undefined) {
        
        const bearer = authToken.split(" ");
        console.log(bearer);
        var token = bearer[1];
        jwt.verify(token, JWTSecret,(err , data)=>{
            if (err) {
                res.status(401);
                res.json({err : "Token invalido"})
            } else {
                req.token = token;
                req.loggedUser = { id : data.id, email: data.email}
                //Todas as variaveis que são criadas dentro do middleware podem ser utilizadas nas rotas que a usem
                console.log(data)
                next();

            }
        })

    } else {
        res.status(401);
        res.json({err : "Token invalido"})
    }
}


connection.authenticate().then(()=>{
    console.log('Conexão realizada com sucesso')
}).catch((err)=>{
    console.log('Um erro ocorreu '+err)
})
var DB = {

    users : [
        {
            id: 1,
            name: "Gilberto",
            email: "gibam@gmail.com",
            password: "1234"
        },
        {
            id: 2,
            name: "Mateus",
            email: "mat@gmail.com",
            password: "1234"
        },

    ]
}


app.get("/games", auth ,async (req, res)=>{
    var games = await Games.findAll();
    res.json(games)
})

app.post("/game", ( req, res)=>{
    
    var { title , price , year} = req.body;
    if (isNaN(price) || isNaN(year)) {
        res.sendStatus(400)
    } else {
        console.log(title, year , price)
        Games.create({
            title,
            price,
            year
        }).then(()=>{
            console.log("Cadastro de jogos feito com sucesso")
        })
        
        res.sendStatus(200)
    }
})


app.get("/game/:id",auth ,async (req, res)=>{
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    }else{
        var id = req.params.id;
        var game = await Games.findOne({
            where : {id},
        });
        console.log(game)
        if (game != undefined) {
            res.statusCode = 200;
            res.json(game)
        } else {
            res.sendStatus(404)
        }
        
    }

})

app.delete("/game/:id",auth ,async (req, res)=>{
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    }else{
        var id = req.params.id;
        var game = await Games.findOne({
            where : {id},
        });
        if (game == null) {
            res.json({message : "O jogo informado não existe em nossa base de dados"})
        } else {
            Games.destroy({where : {id}}).then(()=>{
                res.send("Delete concluido")
            });
        }
        // Games.destroy({where : {id}}).then(()=>{
        //     res.send("Delete concluido")
        // });
    
        
        
    }
})

app.put("/game/:id",auth ,async (req, res)=>{
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    }else{
        var id = req.params.id;
        var game = await Games.findByPk(id)
        console.log(game)
        if (game != undefined) {
            var { title , price , year} = req.body;
            if (title != undefined || price != undefined || year != undefined ) {
                game.title = title;
                game.price = price;
                game.year = year;

                var result = await game.save();
                console.log(result)
            } else {
                res.send("Está faltando algum dado")
            }

            


            res.sendStatus(200);

        } else {
            res.sendStatus(404)
        }
    }
})

//Usuarios

app.post("/auth",(req, res)=>{
    var { email , password} = req.body;

    if (email != undefined) {
        
        var user = DB.users.find(u => u.email == email);
        if (user != undefined) {
            
            if (user.password == password) {
                jwt.sign({id : user.id , email: user.email}, JWTSecret, {expiresIn: '48h'}, (err, token )=>{
                    if (err) {
                        res.status(400);
                        res.json({err: "Falha interna"})
                    }else{
                        res.status(200);
                        res.json({token : token})
                    }
                })
             }else{
                res.status(401);
                res.json({err: "Credenciais invalidas"})
            }

        }else{
            res.status(404);
            res.json({err : "O email enviado não foi encontrado"})
        }


    }else{  
        res.status(400);
        res.json({err : "Email enviado é invalido"})
    }
})

app.listen(8080,()=>{
    console.log("API funcionando normalmente")
})