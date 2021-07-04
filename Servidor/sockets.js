module.exports = function (io){
    
    const Usuario = require('./modelos/usuario');
    const Grupo = require('./modelos/grupos');

    var usuarios = {

    };

    io.on('connection', socket=>{
        console.log('Nueva conexión');
        
        socket.on('nuevoMensaje', async data=>{            
            //data = {idGrupo , mensaje, integrantes}
            let integrantes = data.integrantes;
             
            Grupo.updateOne({"id":data.idGrupo}, { $push: {"mensajes":[data.mensaje]} }).exec(err=>{
                if(err){
                    console.log('Error cargando mensaje: '+err.message);
                };
            });
            for(let i=0;i<integrantes.length;i++){
                let id = integrantes[i];
                if(id in usuarios){
                    usuarios[id].emit('nuevoMensaje',{idGrupo:data.idGrupo, mensaje: data.mensaje});
                }else{                                
                    await Usuario.updateOne({"id":id}, { $inc: {  [`nuevosMensajes.${data.idGrupo}`] : 1  }}).exec((err)=>{
                        if(err){
                            console.log('Error actualizando mensajes \x1b[36m%s\x1b[0m', 's/nuevoMensaje', err.message);
                        }                        
                    });
                }
            }        
            //io.sockets.emit('nuevoMensaje',{idGrupo:data.idGrupo, mensaje: data.mensaje});    
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
                //await Usuario.updateOne({"id":id},{ $push:{ "grupos":data.infoGrupo.id.toString() } })
                await Usuario.updateOne({"id":id},{ $push:{ "grupos":data.infoGrupo.id.toString() } }, {$set: { [`nuevosMensajes.${data.infoGrupo.id}`]:0 } });
            }
            cb({err:false});
        });

        socket.on('login-nuevo', async (data,cb)=>{           

            if(data.created){
                socket.id = data.id;
                usuarios[data.id] = socket;
                return;
            }

            if(data.test){
                socket.id = data.id;
                usuarios[data.id] = socket;
                return;
            }

            let user;
            await Usuario.findOne({"email":data.id}).exec().then(usuario => user = usuario);
            if(user === null){
                cb({error:true,mensaje:"El usuario no está registrado"});
                return;
            }
            if(user.contraseña !==data.password){
                cb({error:true,mensaje:"La contraseña es incorrecta"});
                return;
            }
            if(user.id in usuarios){
                cb({error:true,mensaje:"Ya hay alguien logeado en la cuenta"});
                return;
            }
      
            cb({error:false, user});
            socket.id = user.id;
            usuarios[user.id] = socket;
        });

        socket.on('admin-nuevo', (data,cb)=>{
           let userId = data.userId;
           let groupId = data.groupId;           
           
            Grupo.updateOne({"id":groupId}, { $push:{"miembrosDelGrupo.admin":userId.toString()} }).exec(err=>{
                if(err)
                    console.log(err.message);
            });                    
            if(userId in usuarios){
                console.log('Emite el evento');
                usuarios[userId].emit('admin-nuevo',groupId);
            }
        });

        socket.on('quitar-admin',data =>{            
            let userId = data.userId;
            let groupId = data.groupId;

            if(userId in usuarios){
                usuarios[userId].emit('quitar-admin',groupId);
            }

            Grupo.updateOne({"id":groupId}, {$pull:{"miembrosDelGrupo.admin": userId.toString()}}).exec(err=>{
                if(err)
                 console.log(err.message);
            });      
        }); 

        socket.on('salir-grupo',data =>{
            console.log(data);
            let userId = data.userId;
            let groupId = data.groupId;
            let expulsado = data.expulsado;
            

            Usuario.updateOne({"id": userId},{ $pull: {"grupos": groupId.toString() }}).exec((err)=>{
                if(err){
                    console.log('Error actualizando usuarios \x1b[36m%s\x1b[0m', 's/salir-grupo', err.message);                                     
                }                               
            });
                   Grupo.updateOne({"id":groupId},
                { $pull: {
                    "miembrosDelGrupo.integrantes":userId,
                    "miembrosDelGrupo.admin":userId
                }}
            ).exec(err =>{
                if(err){
                    console.log('Error actualizando grupos \x1b[36m%s\x1b[0m', 's/salir-grupo', err.message);   
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

        socket.on('nuevo-form', async data =>{
            // data = {groupId , formulario}            
            let groupId = data.groupId;
            data.formulario["respuestas"] = [];
            data.formulario["cantidadVotos"] = 0;
            data.formulario["valores"] = Array(data.formulario.cuestions.length).fill(0);
            
            let idForm = -1;
  
            await Grupo.find({}).exec().then(grupos=>{
                let count = 0;
                for(let i=0;i<grupos.length;i++){
                    let grupo = grupos[i];
                    for(let j=0;j<grupo.mensajes.length;j++){
                        let mensaje = grupo.mensajes[j];
                        if(mensaje.type===2){
                            count++;
                        }
                    }
                }
                idForm=count;
            });
            
            data.formulario['idForm']=idForm;
            Grupo.updateOne({"id":groupId} , {$push : {"mensajes": data.formulario}}).exec(err=>{err?console.log(err.message):""});
            io.sockets.emit('nuevo-form', { infoForm : data.formulario, idGrupo:groupId});
        });

        socket.on('group-picture-change', async data=>{
            let groupId = data.groupid;
            let integrantesG = data.integrantesG; //Si no se puede enviar desde el cliente hacemos un query aquí
            let newProfileDir = data.newProfileDir;
            for(let index = 0;index<integrantesG.length;index++){
                let integrante = integrantesG[index];
                if(integrante in usuarios){
                    usuarios[integrante].emit('group-picture-change',{newProfile:newProfileDir,group:groupId});
                }
            }
            
        });

        socket.on('respuesta-form', async data =>{                   
            let userId = data.userId;
            let formId = data.idForm;
                       
            await Grupo.updateOne({"mensajes.idForm":formId}, { $push:{"mensajes.$.respuestas":userId} }).exec((err)=>{
                if(err){
                    console.log(err.message);
                }
            });

            await Grupo.updateOne({"mensajes.idForm":formId}, { $inc:{"mensajes.$.cantidadVotos":1} }).exec((err)=>{
                if(err){
                    console.log(err.message);
                }
            });            

            let form = null;
            let idGrupo
            await Grupo.findOne({"mensajes.idForm":formId}).exec().then((form_)=>{
                idGrupo = form_.id;
                form = form_.mensajes.filter(x=> x.type === 2 && x.idForm=== formId);
            });

            let newValues = updatePercentages({answersInfo : data, formInfo : form[0]})
            let newData = {valores: newValues, idForm: formId, cantVotos : form[0].cantidadVotos,idGrupo };
            io.sockets.emit('respuesta-form',newData);
        });
        function updatePercentages(data){
            
            let multipleAnswer = data.formInfo.multipleAnswer;
            this.previousVoteCount = data.formInfo.cantidadVotos - 1;
            
            let voteCuantity = data.formInfo.cantidadVotos;
            let voteValue = 100 / voteCuantity;
            
            if(multipleAnswer){      

                let internalvoteCuantity = this.previousVoteCount * data.answersInfo.multipleAns.length;      
                voteValue = 100 / (voteCuantity * data.answersInfo.multipleAns.length);

                for(let index = 0;index < data.formInfo.valores.length;index++){

                    let valor = data.formInfo.valores[index];
                    let m = Math.ceil((valor * internalvoteCuantity)/100);              
                    let newValor = m * voteValue;                        
                    
                    data.formInfo.valores[index] = newValor;

                }      
                
                for(let index = 0; index < data.formInfo.cuestions.length;index++){
                    const cuestion = data.formInfo.cuestions[index];
                    
                    if(data.answersInfo.multipleAns.includes(cuestion)){
                    data.formInfo.valores[index] +=voteValue;
                    
                    }
                }
            

            }else{      
                for(let index = 0;index < data.formInfo.valores.length;index++){

                    let valor = data.formInfo.valores[index];
                    let m = Math.ceil((valor * this.previousVoteCount)/100);              
                    let newValor = m * voteValue;                        
                    
                    data.formInfo.valores[index] = newValor;

                }      
                
                for(let index = 0; index < data.formInfo.cuestions.length;index++){
                    const cuestion = data.formInfo.cuestions[index];
                    
                    if(cuestion === data.answersInfo.selectedOpction){
                    data.formInfo.valores[index] +=voteValue;
                    break;
                    }
                }
            }
            
            Grupo.findOneAndUpdate({"mensajes.idForm":data.answersInfo.idForm},{"mensajes.$.valores":data.formInfo.valores} ,{upsert:true}).exec((err)=>{
                if(err) {
                    console.log(err.message);   
                }
            });

            return data.formInfo.valores;
        }
        socket.on('message-pinned',data=>{
            let message = data.message;
            let groupId = data.idGroup;
            let members = data.groupIntegrants;
            console.log(data);
            Grupo.updateOne({"id":groupId},{$set:{"mensajeFijado":message}}).exec(err=>{
                if(err) console.log(err);
            });
            for (let index = 0; index < members.length; index++) {
                const group_user = members[index];                
                if(group_user in usuarios){
                    usuarios[group_user].emit('message-pinned',{groupId, message});
                }
            }
        });
        socket.on('remove-pin',data=>{
            let groupId = data.groupId;
            let members = data.members;
            Grupo.updateOne({"id":groupId},{$set:{"mensajeFijado":""}}).exec(err=>{
                if(err) console.log(err);
            });
            for (let index = 0; index < members.length; index++) {
                const group_user = members[index];                
                if(group_user in usuarios){
                    usuarios[group_user].emit('remove-pin',{groupId});
                }
            }
        });        
        socket.on('cerrar-sesion', id=>{
            console.log('sesión cerrada');
            if(!socket.id)return;
            delete usuarios[id];
        });
        socket.on('disconnect', ()=>{
            console.log('sesión cerrada');
            if(!socket.id)return;
            delete usuarios[ socket.id ];
        });
    });
};