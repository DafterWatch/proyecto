/*Librerias*/
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors:{
        origin:"*",
        methods: ["GET", "POST"]
    }
});
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(
    cors({
        origin:'*'
}));
app.use('/uploads',express.static('uploads'));

mongoose.connect('mongodb+srv://mongodbuser:huevos1@cluster0.uk8ak.mongodb.net/meanDatabase?retryWrites=true&w=majority',err =>{
    if(err){
        console.log('Error! '+err);
    }
});

const api = require('./rutas/api')(router);
const PORT = process.env.PORT || 3000;

/*Sockets */
require('./sockets')(io);
/*Api*/
app.use('/',api);
/*Iniciar server*/
app.set('port',PORT);
http.listen(app.get('port'), ()=>{
    console.log('Server corriendo en ',app.get('port'));
});