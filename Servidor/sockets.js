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

        socket.on('nuevoGrupo',async data=>{
            //Data={ids:[1,2,4,3],InfoGrupo:{} }
            let id_list = data.ids;
            
            for (let index = 0; index < id_list.length; index++) {
                let id = parseInt(id_list[index]);                
                if(id in usuarios){                    
                    usuarios[id].emit('nuevoGrupo',data.infoGrupo);                    
                }
                console.log(data);
                await Usuario.updateOne({"id":id},{ $push:{ "grupos":data.infoGrupo.id.toString() } })
            }
            
        });

        socket.on('login-nuevo', async (data,cb)=>{
            let user = await Usuario.findOne({"id":data});                        
            /*if(exist user)*/ cb(false);
            //else cb(true);
            socket.id = user.id;
            usuarios[user.id] = socket;
        });
                
    });
};