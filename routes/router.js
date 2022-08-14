const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const url = require('url')
const User = require("../model/user");
const auth = require('../middleware/auth')

const routes = express.Router();

routes.get("/", (req, res) => {
    res.json({ola: "OLA"})
})

routes.post("/register", async (req, res)=>{
    try{
        const { first_name, last_name, email, password } = req.body;
        if(!(first_name && last_name && email && password)){
            return res.status(400).send("Todos os campos devem estar preenchidos.")
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(409).send('Email já está em uso! Tente fazer login.')
        }

        const encryptedPassword =  await bcrypt.hash(password, 10);


        const newUser = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        })

        const token = await jwt.sign(
            {user_id: newUser._id, email},
            process.env.TOKEN_KEY,
            { 
                expiresIn: "2h"
            }
        )

        newUser.token = token

        res.status(201).send(newUser);
    }
    catch(err){
        console.error(err)
    }
})

routes.post("/login", async (req, res) => {
    try{
        const {email, password } = req.body;
        if(!(email && password)){
            return res.status(400).send("Todos os campos devem estar preenchidos.")
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).send("Email não cadastrado. Vá para a pagína de registro.")
        }
        
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,{
                    expiresIn: "2h"
                }
            )
            
            user.token = token;
            console.log(token)

            return res.status(200).json({user})
        }
        return res.status(400).send("Invalid Credentials")

        
    }
    catch(err){
        console.error(err)
    }
})

routes.get('/paginasecreta', auth, async (req, res) => {
    const { user_id } =  req.user
    console.debug("inside secrey")


    const user = await User.findOne({ _id: user_id })
    
    res.json(user)
})

routes.post('/payment', auth, async (req, res) => {
    const { user_id } =  req.user
    const { destinatary, value } =  req.body
    

    money = Number(value)
    console.log(destinatary)

    const destiny = await User.findOne({email: destinatary})
    

    if(!destiny){
        return res.status(404).send("Use um destinatario válido.")
    }

    const user = await User.findOne({ _id: user_id })

    console.log(destiny.email)
    
    if(destiny.email === user.email){
        return res.status(404).send("Você não pode pagar para você mesmo.")
    }

    if(money > user.liMoney){
        return res.status(404).send("Saldo insuficiente.")
    }

    user.liMoney = Number(user.liMoney) - money
    destiny.liMoney = Number(destiny.liMoney) + money

    user.save()
    destiny.save()

    
    res.send(`Pagamento de R$${money} efetuado com sucesso para ${destiny.first_name}. Saldo atual: R$${user.liMoney}`)

    
    
})
module.exports = routes