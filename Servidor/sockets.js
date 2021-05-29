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

        socket.on('nuevoGrupo',async (data,cb)=>{       
            
            let grupo_n = data.infoGrupo;
            let grupo = new Grupo(grupo_n);
            grupo.save(err=>{
                if(err){
                    cb({err:true, error:err.message})
                }
            });
            let id_list = data.ids;                        

            for (let index = 0; index < id_list.length; index++) {
                let id = parseInt(id_list[index]);                
                if(id in usuarios){                    
                    usuarios[id].emit('nuevoGrupo',data.infoGrupo);                    
                }                
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

        socket.on('admin-nuevo', (data,cb)=>{
           let userId = data.userId;
           let groupId = data.groupId;
           if(userId in usuarios){
               usuarios[userId].emit('admin-nuevo',null);
           }
           
           Grupo.updateOne({"id":groupId}, { $push:{"miembrosDelGrupo.admin":userId.toString()} }).exec(err=>{
               if(err)
                console.log(err.message);
           });        
        });       

        socket.on('salir-grupo',async data =>{
            let userId = data.userId;
            let groupId = data.groupId;
            let expulsado = data.expulsado;

            await Usuario.updateOne({"id": userId},{ $pull: {"grupos": groupId }}).exec((err)=>{
                if(err){
                    console.log('Error con los usuarios');                                        
                }                               
            });
            
            await Grupo.updateOne({"id":groupId},
                { $pull: {
                    "miembrosDelGrupo.integrantes":userId,
                    "miembrosDelGrupo.admin":userId
                }}
            ).exec(err =>{
                if(err){
                    console.log("Error con los grupos");
                }
            });
            let mensaje = (expulsado)? "Te han expulsado del grupo" : "Saliste del grupo";
            if(userId in usuarios){
                usuarios[userId].emit('salir-grupo',mensaje);
            }
        });

        socket.on('usuario-nuevo',data=>{
            let userId = data.userId;
            let groupId = data.groupId;
            let isAdmin = data.isAdmin;

            Usuario.updateOne({"id":userId}, {$push:{"grupos":groupId} }).exec(err => {
                if(err)
                    console.log('Error agregando grupo');
            });

            Grupo.updateOne({"id":groupId}, {$push:{"miembrosDelGrupo.integrantes":userId}}).exec(err=>{
                if(err)
                    console.log('Error agregando miembro');
            });
            if(isAdmin){
                Grupo.updateOne({"id":groupId}, {$push:{"miembrosDelGrupo.admin":userId}}).exec(err=>{
                    if(err)
                        console.log('Error agregando miembro');
                });
            }
        });

    });
};