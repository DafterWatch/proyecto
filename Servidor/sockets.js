module.exports = function (io){

    id_grupo = 2;
    var grupos = {
        1 : {
            nombre : 'Inglés III',
            descripcion : 'Algo',
            usuarios : []
        }
    }
    
    var usuarios = {
        1 : {
            nombre : 'Pablo',
            descripcion : 'Me gustan los cubos'
        },
        2 : {
            nombre : 'Marco',
            descripcion : 'No me gustan los cubos'
        },
        3:{
            nombre: 'Luis',
            descripcion : 'Aveces me gustan los cubos'
        }
    }

    io.on('connection', socket=>{
        console.log('Nueva conexión');
        
        socket.on('nuevoMensaje', data=>{
            console.log(data.mensaje);
            io.sockets.emit('nuevoMensaje',data.mensaje);
            grupos[data.grupo].append(data.mensaje);
        });

        socket.on('nuevoGrupo',data=>{
            grupos[data.nombre] = [];    
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