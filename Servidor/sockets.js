module.exports = function (io){
    
    const Usuario = require('./modelos/usuario');
    const Grupo = require('./modelos/grupos');

    var usuarios = {

    };

    io.on('connection', socket=>{
        console.log('Nueva conexión');
        
        socket.on('nuevoMensaje', data=>{
            console.log(data);
            io.sockets.emit('nuevoMensaje',data);
            //Llevar mensaje a la base de datos
        });

        socket.on('nuevoGrupo',data=>{
            grupos[data.nombre] = [];    
        });

        socket.on('login-nuevo', async (data,cb)=>{
            let user = await Usuario.findOne({"id":data});
            /*if(exist user)*/ cb(false);
            //else cb(true);
            socket.id = user.id;
            usuarios[user.id] = socket;
        });
        
        //Parte a reemplazar con otro tipo de comunicación !!!!
        socket.on('pedirMensajes',(nombre,cb)=>{
            if(nombre in grupos){
                cb(grupos.nombre);
            }
            cb(null);
        });        
        socket.on('buscarUsuario',(id,cb)=>{
            if(id in usuarios){
                cb({
                    error: false,
                    usuario:usuarios[id]
                });                
                return;
            }
            cb({
                error:true,
                usuario:null
            });
        });
        socket.on('crearGrupo',(data,cb)=>{            
            grupos[id_grupo] = data;
            cb(id_grupo,data);                        
            id_grupo++;
        });
    });
};