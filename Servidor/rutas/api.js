const express = require('express');
const jsonParser = express.json();
const emailExistence = require('email-existence');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require ('path');

const cors = require('cors');
const bodyParser = require('body-parser');

////////////////////////GOOGLE
const { google } = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');

const PATH = './uploadsFiles';

const CLIENT_ID='501838622458-4iltecautpppitda0phlomq7r8nhthmq.apps.googleusercontent.com';
const CLIENT_SECRET='5tsp4Wv4TLYSMXLPqUjglxF0';
const REDIRECT_URI='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN='1//04M_7xP_JYIobCgYIARAAGAQSNwF-L9IrBBFIXvgUAqor_zfTYGbnM4c336r8noLUQjIo6Hkcw4D97irqGs6gzyNtCiCxZipPHT0';


const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});
////////////////////////////

async function createFolder(idGroup,idTarea){
    try {

         
        var pageToken = null;
        // Using the NPM module 'async'
   
        drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder'and name='"+idGroup+"'",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageToken: pageToken
        }, function (err, res) {
            if (err) {
            // Handle error
            console.error(err);
        
            } else {
            pageToken = res.nextPageToken;
           
            var parent=res.data.files[0].id;
       
            var fileMetadata = {
                'name': idTarea,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents':[parent]
              };

              drive.files.create({
                resource: fileMetadata,
                fields: 'id'
              }, function (err, file) {
                if (err) {
                  // Handle error
                  console.error(err);
                  return err;
                } else {
               
                  return file;
                }
              });
        
            }
        });
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

 
//////////////////////////////////////TAREAS



//////////////////////////////////////////////

const fileFilter = (req,file,cb)=>{
    if(['image/jpeg','image/png','image/jpg'].includes(file.mimetype)){
        cb(null,true);
    }else
        cb(null,false);    
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now() + file.originalname); //Potential error
    }
});


const upload = multer({storage:storage, 
    limits:
    {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter : fileFilter
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mean.login.services@gmail.com',
      pass: 'huevos12'
    }
  });

module.exports = function(router){

     /*Modelos */
     const Usuario = require('../modelos/usuario');
     const Grupo = require('../modelos/grupos');
     const Reportes = require('../modelos/reportes');
 
     id_grupo = 2;


     let storage1 = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, PATH);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname)
        }
      });
    
      let upload1 = multer({
        storage: storage1
      });
    
      
      var subirArchivos= async function uploadFile(reqFile,changedName) {
        try {
          var __dirname="./uploadsFiles";
          const filePath = path.join(__dirname, changedName);
          const response = await drive.files.create({
            requestBody: {
              name: changedName, 
              mimeType: reqFile.file.mimetype,
            },
            media: {
              mimeType:  reqFile.file.mimetype,
              body: fs.createReadStream(filePath),
            },
          });
      
            return (response.data);
            }   catch (error) {
            return (error.message);
            }
        }
   
        router.post('/upload', upload1.single('upladFile'), function (req, res) {
     
            var numeroTarea= req.body.numeroTarea;
            var fechaVencimiento= req.body.fechaVencimiento;
            var idGrupo1= req.body.grupo;
            var idUsuario= req.body.usuario;
            var idTarea1=req.body.idTarea;        
            if (!req.file) {
            console.log("No file is available!");
            return res.send({
                success: false
            });
            } 
            else 
            {

            
            Grupo.find({id:idGrupo1}).exec((err,grupos)=>{
                    if(err){
                        console.log('Error con los grupos');
                        return;
                    }
                    else{         
                        var tareaDelUsuario;
                        grupos[0].tareas.forEach(element => {
                            if(element.idTarea==idTarea1){
                                tareaDelUsuario=element;
                            }                                
                        })
                        var tareaEntregadaDeUsuario;
                        tareaDelUsuario.tareasEntregadasUsuarios.forEach(element => {
                            if(element.idEstudiante==idUsuario){
                                tareaEntregadaDeUsuario=element;
                            }
                        });
                        console.log(tareaEntregadaDeUsuario);
                        if(tareaEntregadaDeUsuario==null){

                            //No hay tarea entregada

                            var fileNameString= req.file.originalname;

                            var changedName= idUsuario+"_"+new Date().getFullYear()+"_"+new Date().getMonth()+"_"+new Date().getDate()+"_"+new Date().getHours()+"_"+new Date().getMinutes()+"_"+new Date().getMilliseconds()+"_"+fileNameString.substring(fileNameString.length-5,fileNameString.length)
                            fs.renameSync(path.resolve("./uploadsFiles/" +req.file.originalname),path.resolve("./uploadsFiles/" +changedName));  

                            subirArchivos(req,changedName).then(val =>{
                                var idGrupo=parseInt(idGrupo1);
                                var idTarea=parseInt(idTarea1);
                                Grupo.updateOne({ id:idGrupo,"tareas.idTarea":idTarea},{ $push:{"tareas.$.tareasEntregadasUsuarios":{idEstudiante:idUsuario,idTareaNube:val.id,fechaYHoraEntrega:new Date()}}}).exec((err,grupo)=>{     
                                    if(err){
                                        console.log('Error con los grupos');
                                        res.json(err);
                                        return;
                                    }           
                                    else{
                                        res.json(grupo);
                                        return;
                                    }
                                });
                            })

                        }
                        else{
                               //Hay tarea entregada

                            var fileNameString= req.file.originalname;
                            var changedName= idUsuario+"_"+new Date().getFullYear()+"_"+new Date().getMonth()+"_"+new Date().getDate()+"_"+new Date().getHours()+"_"+new Date().getMinutes()+"_"+new Date().getMilliseconds()+"_"+fileNameString.substring(fileNameString.length-5,fileNameString.length)
                            fs.renameSync(path.resolve("./uploadsFiles/" +req.file.originalname),path.resolve("./uploadsFiles/" +changedName));  


                            subirArchivos(req,changedName).then(val =>{
                                var idGrupo=parseInt(idGrupo1);
                                var idTarea=parseInt(idTarea1);

                                Grupo.updateOne({id:idGrupo}, {$set: {"tareas.$[i].tareasEntregadasUsuarios.$[j].idTareaNube":val.id}},{arrayFilters: [{"i.idTarea":idTarea},{"j.idEstudiante":idUsuario}]}).exec((err,grupo)=>{
                                    if(err){
                                        console.log('Error con los grupos');
                                        res.json(err);
                                        return;
                                    }           
                                    else{
                                        console.log(grupo);
                                        res.json(grupo);
                                        return;
                                    }
                                    
                                });
                                
                            })

                            

                        }

                    }
                    
                });  
        }
        
      });
      router.get('/descargarTarea',(req,res1)=>{   
                    

        var idDescargaTarea=req.query.idTareaNube;

        drive.files.get({ fileId: idDescargaTarea }, (er, re) => {
            if (er) {
                console.log(er);
                return;
            }
            var dest = fs.createWriteStream("./downloadFiles" + '/' + re.data.name); 
            drive.files.get(
                { fileId: idDescargaTarea, alt: "media" },
                { responseType: "stream" },
                function(err, res) {
                res.data
                    .on("end", () => { 
                    console.log("done");
                    return res1.download(path.resolve("./downloadFiles" + '/' + re.data.name),re.data.name);
                    })
                    .on("error", err => {
                    console.log("Error", err);
                    return res1.send({
                        success: false
                    });
                    })
                    .pipe(dest);
                }
            );
            });
        
    });

    router.get('/getInformacionArchivo',(req,res1)=>{   
                    

        var idDescargaTarea=req.query.idTareaNube;

        drive.files.get({ fileId: idDescargaTarea }, (er, re) => {
            if (er) {
                console.log(er);
                return;
            }
            else{
                res1.json(re.data.name);
            }
            
            });
        
    });


////////////////////////////
    router.post('/crearTarea/:idGrupo/:nombreGrupo/:titulo/:instrucciones/:puntos/:startDate/:endDate/:horaVencimiento/:esRecordatorio',(req,res)=>{    
        let idGrupo = req.params.idGrupo; 
        let nombreGrupo = req.params.nombreGrupo; 
        let titulo = req.params.titulo; 
        let instrucciones = req.params.instrucciones; 
        let puntos = req.params.puntos; 
        let startDate = req.params.startDate; 
        let endDate = req.params.endDate; 
        let horaVencimiento = req.params.horaVencimiento; 
        let esRecordatorio = req.params.esRecordatorio; 
        let tareasEntregadasUsuarios=[];
        let tarea = {
            titulo:titulo,
            instrucciones:instrucciones,
            puntos:puntos,
            startDate:startDate,
            endDate:endDate,
            horaVencimiento:horaVencimiento,
            esRecordatorio:esRecordatorio,
            tareasEntregadasUsuarios:tareasEntregadasUsuarios,
        }
        Grupo.findOne({ id: idGrupo }).exec((err,grupo)=>{
            tarea.idTarea=grupo.tareas.length;
            
            Grupo.updateOne({id: idGrupo}, {$push: {tareas:[tarea]}}).exec((err,grupos)=>{
                if(err){
                    console.log(err);
                    return;
                }
                else{
                    
                }                    
                res.json(grupos);
            });
        });
        
    });

    router.post('/calificarTarea',jsonParser,(req,res)=>{

        var idGrupo=req.body.params.idGrupo;
        var idTareas=req.body.params.tareaSeleccionada;
        var idEstudiante=req.body.params.idEstudiante;
        var calificacion=req.body.params.calificacion;

        idGrupo=parseInt(idGrupo);
        idTareas=parseInt(idTareas);

        Grupo.updateOne({id:idGrupo}, {$set: {"tareas.$[i].tareasEntregadasUsuarios.$[j].calificacion":calificacion}},{arrayFilters: [{"i.idTarea":idTareas},{"j.idEstudiante":idEstudiante}]}).exec((err,grupo)=>{
                    if(err){
                        console.log('Error con los usuarios');
                        res.json(err);
                        return;
                    }           
                    else{
                        console.log(grupo);
                        res.json(grupo);
                        return;
                    }
                    
                });
        
    });

    router.post('/obtenerGrupo/:idGrupo',(req,res)=>{
        Grupo.find({id:req.params.idGrupo},{}).exec((err,tareas)=>{
            if(err){
                console.log('Error con los grupos');
                return;
            }
                        
            res.json(tareas);
        });
    });

    router.post('/subirTarea',upload.single('upladFile'),async (req,res)=>{   
                
        
        res.send('http://localhost:3000/'+req.file.path);
       
    });
//////////////////////////////      

    router.post('/addfromGroup/:id/:idGroup/:isAdmin',(req,res)=>{
        let id = req.params.id;  
        let idGroup = req.params.idGroup;
        let isAdmin = req.params.isAdmin;

       Usuario.updateOne({id: id}, {$push: {grupos:[idGroup]}}).exec((err,usuarios)=>{
        if(err){
            console.log('Error con los usuarios');
            return;
        }                    
        });
        Grupo.updateOne({"id": idGroup}, {$push: {"miembrosDelGrupo.integrantes":[id]}}).exec((err,usuarios)=>{
            if(err){
                console.log('Error con los grupos');
                return;
            }                    
        });
        if(isAdmin){
            Grupo.updateOne({"id": idGroup}, {$push: {"miembrosDelGrupo.admin":[id]}}).exec((err,usuarios)=>{
                if(err){
                    console.log('Error con los grupos de administradores');
                    return;
                }                    
            });
        }        
    });


    router.get('/con',(req,res)=>{
        Usuario.find({}).exec((err,usuarios)=>{
            if(err){
                console.log('Error con los usuarios');
                return;
            }               
            res.json(usuarios);
        });
    });
    /*Revisar luego */
    router.post('/usuarios/:id',(req,res)=>{
        let id = req.params.id;        
        Usuario.findOne({"id": id}).exec((err,usuarios)=>{
            if(err){
                console.log('Error con los usuarios');
                return;
            }                    
            res.json(usuarios);
        });
    });

    router.post('/grupos',(req,res)=>{    
        Grupo.find({}).exec((err,grupos)=>{
            if(err){
                console.log('Error recuperando grupos');
                return;
            }
            res.json(grupos);
        });    
    });

    router.post('/gruposId',jsonParser,(req,res)=>{                      
        Grupo.find({ id:{$in:req.body} }).exec((err,grupos)=>{
           if(err){
               console.log('Error recuperando grupos '+err.message);
               return;
           }            
           res.json(grupos);
        });
    });

    router.post('/createG',jsonParser,(req,res)=>{
        
        var grupo = new Grupo(req.body);
        grupo.save(function (err) {
            if (err) {
                console.log(err);
                res.send(false);
                return;
            }         
        });
        
        res.send(true);
    });

    router.post('/getGroupCount',(req,res)=>{            
        Grupo.countDocuments({},async (err,c)=>{
            res.json({conteo:c});
        });        
    });
    router.post('/isAdmin/:idUser/:idGroup',(req,res)=>{ 
        let user = req.params.idUser;
        let group = req.params.idGroup;
 
        Usuario.findOne({"id": user}).exec((err,usuarios)=>{
            if(err){
                console.log('Error con los usuarios');
                return;
            }
            Grupo.findOne({"id": group}).exec((err,grupos)=>{
                if(err){
                    console.log('Error con el grupo');
                    return;
                }
                var admins = grupos.miembrosDelGrupo.admin; 
                if(admins.includes(usuarios.id.toString())){
                    res.send(true)
                }            
                else{                
                    res.send(false)
                }
            });
        });   
    });

    router.post('/getGroupMessages',jsonParser,(req,res)=>{        
        let groupId = req.body.id;
        
        Grupo.findOne({"id":groupId}).exec((err,grupo) =>{
            if(err){
                console.log("Erro recuperando grupo: "+err.message);                
            }
            let aux = JSON.stringify(grupo);         
            let grupo_ = JSON.parse(aux);            
            res.send(grupo_.mensajes);
       });
       
    });
    router.post('/crearUser',jsonParser, async (req,res)=>{
        let datos = req.body;
        let existeCorreo;
        let estaRegistrado = true;
        await checkEmail(datos.email).then(res=> existeCorreo=res);        
        await Usuario.find({'email':datos.email}).exec().then(usuario =>{
            if(usuario.length === 0){
                estaRegistrado=false
            }
        });

        /*let fakeId = makeid(5);*/
        
        let mensaje = (!existeCorreo)? 'Dirección de correo no valida':'¡La cuenta ya está registrada!';
        let error = !existeCorreo || estaRegistrado; 
        let respuesta ={
            error,
            mensaje
        };                

        if(!error){
            let id = -1;
            await Usuario.find({}).exec().then(usuarios => id=usuarios.length + 1);

            let newUser = {
                id,
                nombre : datos.name,
                descripcion : "",
                grupos : [],
                email : datos.email,
                contraseña : datos.password,
                preguntaSeguridad : datos.securityQuestion,
                respuesta : datos.securityAns,
                fotoPerfil:"uploads\\default.png"
            }

            let nuevoUsuario = new Usuario(newUser);
            await nuevoUsuario.save(err=>{
                if(err) console.log(err);
            });
            respuesta['user'] = newUser;
        }

        res.send(respuesta);
    });

    function checkEmail(email){
        return new Promise(resolve =>{
            emailExistence.check(email, (err,res)=> resolve(res));
        });
    }

    router.post('/isRegistered/:mail',async (req,res)=>{
        let userMail = req.params.mail;        
        let fields = {
            error : false,
            pregunta : "",
            respuesta : ""
        }
        await Usuario.findOne({"email":userMail}).exec().then(usuario =>{
            if(usuario !== null){
                fields.pregunta = usuario.preguntaSeguridad;
                fields.respuesta = usuario.respuesta;
            }else{
                fields.error = true;
            }
        });
        res.send(fields);
    });
    router.post('/sendPassword/:email', async (req,res)=>{
        let password = "";
        await Usuario.findOne({'email':req.params.email}).exec().then(usuario =>{
            password = usuario.contraseña;
        });

        let mailOptions = {
            from : 'mean.login.services@gmail.com',
            to : req.params.email,
            subject : 'Contraseña de cuenta',
            text : 'Su contraseña es :' + password
        }

        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log(err);                
            }else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.send(true);

    });

    router.post('/changeInfo',jsonParser,(req,res)=>{
        let id = req.body.id;
        let field = req.body.field;
        let newField = req.body.newField;

        switch(field){
            case "nombre":
                Usuario.updateOne({"id":id},{$set:{"nombre":newField }}).exec(err=>{
                    if(err)
                        console.log(err);
                });
                break;
            case "descripcion":
                Usuario.updateOne({"id":id},{$set:{"descripcion":newField }}).exec(err=>{
                    if(err)
                        console.log(err);
                });
                break;
        }
        res.send(true);
    });

    router.post('/changeImage',upload.single('profileImage'),async (req,res)=>{   
        
        let previousImage = './'+req.body.previousImage.substring(22);
        try{
            if(!previousImage === './uploads\\default.png')
            fs.unlinkSync(previousImage);
        }catch{
            console.log('Error borrando la foto anterior');
        }
        await Usuario.updateOne({'id':req.body.id},{$set:{'fotoPerfil':req.file.path}}).exec(err=>{
            if(err){
                console.log(err.message);
            }
        });
        res.send('http://localhost:3000/'+req.file.path);
    });

    router.post('/changeGroupImage',upload.single('groupPicture'), async (req,res)=>{
        await Grupo.updateOne({"id":req.body.groupId},{$set:{'informacion.foto':req.file.path}}).exec(err=>{
            if(err) console.log(err);
        });
        res.send('http://localhost:3000/'+req.file.path);
    });

    router.post('/prepareGroupProfile',upload.single('groupPicture'), async(req,res)=>{
        res.send(req.file.path);
    });

    router.post('/getReportesUsuario',async (req,res)=>{
        let dataReportes;
        await Reportes.find({}).exec().then(reportes =>{
            dataReportes = reportes;
        });
        res.send(dataReportes);
    });

    router.post('/mostrarMensajes/:idUsuario', async (req,res)=>{
        let mensajes = [];
        let idUsuario = req.params.idUsuario;
        await Grupo.find({}).exec().then(grupos_ =>{            
            for(let g of grupos_){
                for(let mensaje of g.mensajes){
                    if(mensaje.type == 1 && mensaje.user == idUsuario){
                        mensajes.push(mensaje);
                    }
                }
            }
        });
        res.send(mensajes);
    });    
    router.post('/borrarReporte/:idReporte', async (req,res)=>{
        await Reportes.deleteOne({"id_reportado":req.params.idReporte}).exec();        
        res.send(true);
    });

    router.post('/bloquearUsuario',jsonParser,async (req,res)=>{       
        let id = req.body.idUsuario;        
        let type = req.body.type; 
        await Reportes.updateOne({"id_reportado":id}, { $set:{"type":type} }).exec();
        res.send(true);
    });

    router.post('/desbloquear/:idBloqueo', async (req,res)=>{                        
        Reportes.deleteOne({"id_bloqueado":req.params.idBloqueo}).exec((err,data) =>{
            if(err) console.log(err.message);            
        });

        res.send(true);
    });

    router.post('/bloquearUsuarioDirecto',jsonParser,async (req,res)=>{
        let existe=false;
        let id_bloqueado = req.body.idUsuario;
        await Reportes.find({"id_bloqueado":id_bloqueado}).exec().toPromise(data =>{
            if(data) existe = true;
        });
        if(existe){
            res.json({error: true,mensaje:'El usuario ya está bloqueado'});        
            return;
        }
        let type = 3;        
        let reporte = 'Bloqueado por administrador';

        let reporte = new reporte({type,id_bloqueado,reporte});
        reporte.save((err)=>{
            if(err){
                console.log(err.message);
                res.json({error:true,mensaje:err.message});
            }
        });
        res.json({error:false});        
    });

    router.post('/estaBloqueado/:idUsuario', async (req, res)=>{
        let bloqueado = false;
        await Reportes.findOne({"id_bloqeuado":bloqueado}).exec().toPromise(data =>{
            if(data) bloqueado=true;
        });
        res.send(bloqueado);
    });

    return router;
}

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * 
        charactersLength)));
   }
   return result.join('');
}