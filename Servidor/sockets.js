module.exports = function (io){
    
    const Usuario = require('./modelos/usuario');
    const Grupo = require('./modelos/grupos');

    var usuarios = {

    };

    io.on('connection', socket=>{
        console.log('Nueva conexión');
        
        socket.on('nuevoMensaje', data=>{            
            //data = {idGrupo , mensaje}
                     
            Grupo.updateOne({"id":data.idGrupo}, { $push: {"mensajes":[data.mensaje]} }).exec(err=>{
                if(err){
                    console.log('Error cargando mensaje: '+err.message);
                };
            });
            io.sockets.emit('nuevoMensaje',data.mensaje);    
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
            cb({err:false});
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

        socket.on('quitar-admin',data =>{
            console.log(data);
            let userId = data.userId;
            let groupId = data.groupId;

            if(userId in usuarios){
                usuarios[userId].emit('quitar-admin',null);
            }

            Grupo.updateOne({"id":groupId}, {$pull:{"miembrosDelGrupo.admin": userId.toString()}}).exec(err=>{
                if(err)
                 console.log(err.message);
            });      
        }); 

        socket.on('salir-grupo',data =>{
            let userId = data.userId;
            let groupId = data.groupId;
            let expulsado = data.expulsado;
            

            Usuario.updateOne({"id": userId},{ $pull: {"grupos": groupId }}).exec((err)=>{
                if(err){
                    console.log('Error con los usuarios');                                        
                }                               
            });
            
            Grupo.updateOne({"id":groupId.toString()},
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
                usuarios[userId].emit('salir-grupo',{mensaje,groupId});
            }
        });

        socket.on('usuario-nuevo',async (data,cb)=>{
            let userId = data.userId;
            let groupId = data.groupId;
            let isAdmin = data.isAdmin;

            Usuario.updateOne({"id":userId}, {$push:{"grupos":groupId.toString()} }).exec(err => {
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
            let newGroup;
            await Grupo.findOne({"id":groupId}).exec().then(grupo =>{
                newGroup= grupo;
            });
            let user;
            await Usuario.findOne({"id":userId}).exec().then(user_=>{
                user = user_;
            });
            if(userId in usuarios){
                usuarios[userId].emit('usuario-nuevo',newGroup);
            }
            cb(user);
        });

        socket.on('group-info-change',async data=>{
            //{ idgroup , campo , nuevoCampo }
            let idGroup = data.idGroup;
            let campo = data.campo;
            let nuevoCampo = data.nuevoCampo;            
            
            switch (campo) {
                case "nombre":
                    Grupo.updateOne({"id":idGroup},{$set: {"informacion.nombre":nuevoCampo }}).exec((err)=>{
                        if(err){
                            console.log(err.message);
                        }
                    });
                    break;
            
                case "descripcion":
                    Grupo.updateOne({"id":idGroup},{$set: {"informacion.descripcion":nuevoCampo }}).exec((err)=>{
                        if(err){
                            console.log(err.message);
                        }
                    });
                    break;
            }
            
            let ids = [];
            await Grupo.findOne({"id":idGroup}).exec().then((grupo) =>{                                
                ids = grupo.miembrosDelGrupo.integrantes;
            });            
            for(let i = 0;i<ids.length;i++){
                let id = parseInt(ids[i]);
                if(id in usuarios){                    
                    usuarios[id].emit('group-info-change',{campo,nuevoCampo,idGroup});                       
                }  
            }
        });       

    });
};