module.exports = function (io){

    usuarios = [1,2,3,4,5];

    io.on('connection', socket=>{
        console.log('Nueva conexión');
        
        socket.on('nuevoMensaje', data=>{
            console.log(data);
            io.sockets.emit('nuevoMensaje',data);
        });
    });
};