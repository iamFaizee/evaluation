const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();
const cors = require('cors')


const {connection} = require('./config/db');
const { Usermodel } = require('./models/User.model');
const {todoRouter} = require('./routes/todo.routes');
const { authentication } = require('./middleware/authentication');

const app = express();

app.use(cors())

app.use(express.json());


app.post('/signup', async (req,res) => {
    const {email,password} = req.body

    const hashed_password = bcrypt.hashSync(password, 8);
    const new_user = new Usermodel({
        email,
        password: hashed_password,
        ipAddress: req.ip,
    })

    await new_user.save()
    res.json({success: 'Signup successful'})
})


app.post('/login', async (req,res) => {
    const {email,password} = req.body;
    const user = await Usermodel.findOne({email});

    if(!user){
        res.json({error: 'Please Sign up'})
    }

    const hash = user.password;
    const correct_password = bcrypt.compareSync(password, hash)

    if(correct_password){
        const token = jwt.sign({userID: user._id}, process.env.SECRET);
        res.status(200).json({success: 'Login successful', "token": token})
    }
    else{
        res.status(500).json({error: 'Login failed'})
    }
})


app.use('/todos', authentication, todoRouter)


app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
})