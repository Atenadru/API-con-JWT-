const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const routeProducts = require('./api/routes/products')
const routeOrders = require('./api/routes/orders')
const routeUser = require('./api/routes/user')

mongoose.connect('mongodb+srv://namroy_at:SzagYyhxDwUe5AVs@cluster0.kkkff.mongodb.net/Cluster0?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex:true
})

mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//para poder permitr peticiones Cors en el user-agent
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-with,Content-type,Accept,Authorization"
    )
    if(req.method === 'OPTIONS')
    {
        res.header("Access-Control-Allow-Methods","PUT,PATCH,POST GET,DELETE")
        return res.status(200).json({})
    }
    next()
})

app.use('/products',routeProducts)
app.use('/orders',routeOrders)
app.use('/user',routeUser)

app.use((req,res,next)=>{
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    })
})
//SzagYyhxDwUe5AVs
// aprende sobre variables de entorno
module.exports = app
