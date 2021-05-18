/*Librerias*/
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const api = require('./rutas/api');

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