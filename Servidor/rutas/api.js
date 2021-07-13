const express = require('express');
const jsonParser = express.json();
const emailExistence = require('email-existence');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require ('path');

const cors = require('cors');
const bodyParser = require('body-parser');
const Hogan = require('hogan.js');

//obtener el archivo
const template = fs.readFileSync('./rutas/mailCard.hjs','utf-8');
//compilar el archivo
const compiledTemplate = Hogan.compile(template);

////////////////////////GOOGLE
const { google } = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');
const { log } = require('console');
const usuario = require('../modelos/usuario');

const PATH = './uploadsFiles';

const CLIENT_ID='501838622458-4iltecautpppitda0phlomq7r8nhthmq.apps.googleusercontent.com';
const CLIENT_SECRET='5tsp4Wv4TLYSMXLPqUjglxF0';
const REDIRECT_URI='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN='1//041CkAXDbHAmPCgYIARAAGAQSNwF-L9Irh6SL1haaC_0gRNteMc1X8DApxc7AGgbCiDRyKhpQB_e8S5gOyX4yuLPmazGDw9i7erE';

require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
const ExcelJS = require('exceljs/dist/es5');

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
//////////////////////////////////////////////////////7
//APP RECOGNITION


const process = require('process');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
//const log = require('@vladmandic/pilogger');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const fetch = require('node-fetch').default;
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const tf = require('@tensorflow/tfjs-node');
const faceapi = require('@vladmandic/face-api'); // this is equivalent to '@vladmandic/faceapi'

const modelPathRoot = '../model';
const imgPathRoot = './rostros'; // modify to include your sample images
const minConfidence = 0.15;
const maxResults = 5;
let optionsSSDMobileNet;


///////////////////////////////////////////////////////

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
      //console.log(error.message);
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
        cb(null, Date.now() + file.originalname); 
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
    
      let storage3 = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./rostrosComparar");
        },
        filename: (req, file, cb) => {
          cb(null,req.query.codLog+".jpg")
        }
      });
    
      let upload3 = multer({
        storage: storage3
      });

      let storage4 = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./rostros");
        },
        filename: (req, file, cb) => {
          cb(null,req.query.codUser+".jpg")
        }
      });
    
      let upload4 = multer({
        storage: storage4
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
            //console.log("No file is available!");
            return res.send({
                success: false
            });
            } 
            else 
            {

            
            Grupo.find({id:idGrupo1}).exec((err,grupos)=>{
                    if(err){
                        //console.log('Error recuperando grupo \x1b[36m%s\x1b[0m', 'upload', err.message);
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
                                        //console.log('Error actualizando grupo \x1b[36m%s\x1b[0m', 'upload', err.message);
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
                                        //console.log('Error actualizando grupo \x1b[36m%s\x1b[0m', 'upload', err.message);
                                        res.json(err);
                                        return;
                                    }           
                                    else{
                                        //console.log(grupo);
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
    router.get('/cambiarToken',(req,res1)=>{   
        var nuevoToken=req.query.nuevoToken;
        this.REFRESH_TOKEN=nuevoToken;
        res1.send("true");
        
    });
    router.get('/descargarRegistroDeTarea',(req,res)=>{   
                  
        var idGrupo=req.query.idGrupo;
        var idTarea=req.query.idTarea;

        Grupo.find({id:req.query.idGrupo},{}).exec((err,tareas)=>{
            if(err){
                //console.log('Error recuperando grupo \x1b[36m%s\x1b[0m', '/obtenerGrupo', err.message);
                return;
            }
          
            var tareasMatriz= tareas[0].tareas
            var tareaSeleccionada;
            tareasMatriz.forEach(element =>
                {
                    if(element.idTarea==idTarea){
                        tareaSeleccionada=element;
                    }
                });


            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Me';
            workbook.lastModifiedBy = 'Her';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
            const worksheet = workbook.addWorksheet('My Sheet');
       

            // adjust properties afterwards (not supported by worksheet-writer)
            worksheet.properties.outlineLevelCol = 2;
            worksheet.properties.defaultRowHeight = 15;
            worksheet.headerFooter.differentFirst = true;
            worksheet.headerFooter.firstHeader = "Hello Exceljs";
            worksheet.headerFooter.firstFooter = "Hello World"
            const row1 = [];
            row1[1] = "Titulo";
            row1[2] = tareaSeleccionada.titulo.trim();
            worksheet.addRow(row1);
            const row2 = [];
            row2[1] = "Instrucciones";
            row2[2] = tareaSeleccionada.instrucciones.trim();
            worksheet.addRow(row2);
            const row3 = [];
            row3[1] = "Titulo";
            row3[2] = tareaSeleccionada.puntos.trim();
            const row4 = [];
            row4[1] = "Fecha de inicio";
            row4[2] = tareaSeleccionada.startDate.trim();
            worksheet.addRow(row4);
            const row5 = [];
            row5[1] = "Fecha de cierre";
            row5[2] = tareaSeleccionada.endDate.trim();
            worksheet.addRow(row5);
            const row6 = [];
            row6[1] = "Hora de vencimiento";
            row6[2] = tareaSeleccionada.horaVencimiento.trim();
            worksheet.addRow(row6);
            const row7 = [];
            row7[1] = "¿Es recordatorio?";
            row7[2] = tareaSeleccionada.esRecordatorio.trim();
            const row8 = [];
            row8[1] = "Codigo de tarea";
            row8[2] = tareaSeleccionada.idTarea;
            worksheet.addRow(row8);
            const row9 = [];
            row9[1] = "Tareas entregadas:";
            worksheet.addRow(row9);
            var tareasEntregadas=tareaSeleccionada.tareasEntregadasUsuarios;
            //console.log(tareasEntregadas)
            tareasEntregadas.forEach(e=>{
                var rowG1 = [];
                rowG1[2] = "Codigo de estudiante";
                rowG1[3] = e.idEstudiante;
                worksheet.addRow(rowG1);
                var rowG2 = [];
                rowG2[2] = "Codigo de tarea en la nube";
                rowG2[3] = e.idTareaNube;
                worksheet.addRow(rowG2);
                var rowG3 = [];
                rowG3[2] = "Fecha de la entrega";
                rowG3[3] = e.fechaYHoraEntrega;
                worksheet.addRow(rowG3);
                var rowG4 = [];
                rowG4[2] = "Calificación";
                rowG4[3] = e.calificacion;
                worksheet.addRow(rowG4);
            })
            worksheet.columns.forEach(function (column, i) {
                var maxLength = 0;
                column["eachCell"]({ includeEmpty: true }, function (cell) {
                    var columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength ) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength;
            });
            var NombreRegistro= "Excel"+Date.now()+".xlsx";
            const stream = fs.createWriteStream('Registros/'+NombreRegistro);
                workbook.xlsx.write(stream).then(v=>{
                    res.download('Registros/'+NombreRegistro);
                })
                     
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
                        //console.log('Error actulizando usuarios \x1b[36m%s\x1b[0m', '/calificarTarea', err.message);
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
                //console.log('Error recuperando grupo \x1b[36m%s\x1b[0m', '/obtenerGrupo', err.message);
                return;
            }
                        
            res.json(tareas);
        });
    });

    router.post('/subirTarea',upload.single('upladFile'),async (req,res)=>{                   
        
        res.send('https://mean-server1.herokuapp.com/'+req.file.path);
       
    });
//////////////////////////////      

    router.post('/addfromGroup/:id/:idGroup/:isAdmin',(req,res)=>{
        let id = req.params.id;  
        let idGroup = req.params.idGroup;
        let isAdmin = req.params.isAdmin;

       Usuario.updateOne({id: id}, {$push: {grupos:[idGroup]}}).exec((err,usuarios)=>{
        if(err){
            //console.log('Error actulizando usuarios \x1b[36m%s\x1b[0m', '/addfromGroup', err.message);
            return;
        }                    
        });
        Grupo.updateOne({"id": idGroup}, {$push: {"miembrosDelGrupo.integrantes":[id]}}).exec((err,usuarios)=>{
            if(err){
                //console.log('Error actualizando grupos \x1b[36m%s\x1b[0m', 'addfromGroup', err.message);
                return;
            }                    
        });
        if(isAdmin){
            Grupo.updateOne({"id": idGroup}, {$push: {"miembrosDelGrupo.admin":[id]}}).exec((err,usuarios)=>{
                if(err){
                    //console.log('Error actualizando grupos de administradores \x1b[36m%s\x1b[0m', '/addfromGroup', err.message);
                    return;
                }                    
            });
        }        
    });


    router.get('/con',(req,res)=>{
        Usuario.find({}).exec((err,usuarios)=>{
            if(err){
                //console.log('Error recuperando usuarios \x1b[36m%s\x1b[0m', '/con', err.message);
                return;
            }               
            res.json(usuarios);
        });
    });
    /*Revisar luego */
    router.post('/usuarios/:id',(req,res)=>{
        let id = req.params.id;      
        if(id){  
            Usuario.findOne({"id": id}).exec((err,usuarios)=>{
                if(err){
                    //console.log('Error recuperando usuarios \x1b[36m%s\x1b[0m', 'usuarios/id', err.message);
                    return;
                }                    
                res.json(usuarios);
            });
        }
    });

    router.post('/grupos',(req,res)=>{    
        Grupo.find({}).exec((err,grupos)=>{
            if(err){
                //console.log('Error recuperando grupos \x1b[36m%s\x1b[0m', 'grupos', err.message);
                return;
            }
            res.json(grupos);
        });    
    });

    router.post('/gruposId',jsonParser,(req,res)=>{                      
        Grupo.find({ id:{$in:req.body} }).exec((err,grupos)=>{
           if(err){
               //console.log('Error recuperando grupos \x1b[36m%s\x1b[0m', 'gruposId', err.message);
               return;
           }            
           res.json(grupos);
        });
    });

    router.post('/createG',jsonParser,(req,res)=>{
        
        var grupo = new Grupo(req.body);
        grupo.save(function (err) {
            if (err) {
                console.log(err.message);
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
                //console.log('Error recuperando usuarios \x1b[36m%s\x1b[0m', 'isAdmin', err.message);            
                return;
            }
            Grupo.findOne({"id": group}).exec((err,grupos)=>{
                if(err){
                    //console.log('Error recuperando grupo \x1b[36m%s\x1b[0m', 'isAdmin', err.message);
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
                //console.log('Error recuperando grupo \x1b[36m%s\x1b[0m', 'getGroupMessages', err.message);
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
                fotoPerfil:"uploads\\default.png",
                estado : false,
                nuevosMensajes :{},
                idMovil : ""
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
        let userName = "";
        await Usuario.findOne({'email':req.params.email}).exec().then(usuario =>{
            password = usuario.contraseña;
            userName = usuario.nombre;
        });

        let mailOptions = {
            from : 'mean.login.services@gmail.com',
            to : req.params.email,
            subject : 'Contraseña de cuenta',            
            html: compiledTemplate.render({contrasenia: password, nombre:userName})
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
                    if(err){
                       //console.log('Error actualizando usuario \x1b[36m%s\x1b[0m', '/changeInfo', err.message);
                    }
                });
                break;
            case "descripcion":
                Usuario.updateOne({"id":id},{$set:{"descripcion":newField }}).exec(err=>{
                    if(err){
                        //console.log('Error actualizando grupo \x1b[36m%s\x1b[0m', '/changeInfo', err.message);
                    }
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
            //console.log('Error borrando la foto anterior');
        }
        await Usuario.updateOne({'id':req.body.id},{$set:{'fotoPerfil':req.file.path}}).exec(err=>{
            if(err){
                //console.log('Error actualizando usuario \x1b[36m%s\x1b[0m', '/changeImage', err.message);
            }
        });
        res.send('https://mean-server1.herokuapp.com/'+req.file.path);
    });

    router.post('/changeGroupImage',upload.single('groupPicture'), async (req,res)=>{

        let previousImage = './'+req.body.previousImage.substring(22);
        try {
            if(!previousImage === './uploads\\default.png')
            fs.unlinkSync(previousImage);
        } catch (error) {
            console.log('Error borrando la imagen anterior del grupo');
        }

        await Grupo.updateOne({"id":req.body.groupId},{$set:{'informacion.foto':req.file.path}}).exec(err=>{
            if(err) console.log('Error actualizando grupo \x1b[36m%s\x1b[0m', '/changeGroupImage', err.message);
        });
        res.send('https://mean-server1.herokuapp.com/'+req.file.path);
    });

    router.post('/prepareGroupProfile',upload.single('groupPicture'), async(req,res)=>{
        //IF req.file.path ELSE enviar el path de la imágen por defecto
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
        //OJO: EL REPORTE NO SÉ PUEDE REPETIR
        await Reportes.deleteOne({"id_reportado":req.params.idReporte}).exec();        
        res.send(true);
    });

    router.post('/bloquearUsuario',jsonParser,async (req,res)=>{       
        let id = req.body.idUsuario;        
        let type = req.body.type; 

        let grupo = req.body.grupo;
        await Reportes.updateOne({"id_reportado":id}, { $set:{"type":type} }).exec();
        if(grupo){
            await Grupo.updateOne({"id":id},{$set:{"informacion.estado":true}}).exec();
        }
        else{
            await Usuario.updateOne({"id":id},{$set:{"estado":true}}).exec();
        }
        res.send(true);
    });

    router.post('/desbloquear/:idBloqueo/:grupo', (req,res)=>{     
        let grupo = req.params.grupo;  
        let id = req.params.idBloqueo;                         
        Reportes.deleteOne({"id_reportado":id}).exec((err,data) =>{
            if(err) console.log('Error borrando reporte \x1b[36m%s\x1b[0m', '/desbloquear', err.message);         
        });        
        if(grupo==1){            
            Grupo.updateOne({"id":id},{$set:{"informacion.estado":false}}).exec((err,data) =>{
                if(err){
                    //console.log('Error desbloqueando grupo \x1b[36m%s\x1b[0m', '/desbloquear', err.message);   
                }                
            });
            
        }else{      
            console.log('desbloqueando usuario');      
            Usuario.updateOne({"id":id},{$set:{"estado":false}}).exec((err,data)=>{
                if(err){
                    //console.log('Error desbloqueando usuario \x1b[36m%s\x1b[0m', '/desbloquear', err.message);   
                }                
            });
        }

        res.send(true);
    });

    router.post('/bloquearUsuarioDirecto',jsonParser,async (req,res)=>{
        let existe=false;
        let id_bloqueado = req.body.idUsuario;
        await Reportes.findOne({"id_bloqueado":id_bloqueado}).exec().then(data =>{
            if(data){
                existe = true;                
            } 
        });
        if(existe){
            res.json({error: true,mensaje:'El usuario ya está bloqueado'});        
            return;
        }
        let type = 3;        
        let mensaje_reporte = 'Bloqueado por administrador';

        let reporte = new Reportes({type,id_reportado:id_bloqueado,reporte:mensaje_reporte});
        reporte.save((err)=>{
            if(err){
                //console.log('Error creando reporte \x1b[36m%s\x1b[0m', '/bloquearUsuarioDirecto', err.message);
                res.json({error:true,mensaje:err.message});
            }
        });
        await Usuario.updateOne({"id":id_bloqueado},{$set:{"estado":true}}).exec();
        res.json({error:false});        
    });
    router.post('/generarReporte',jsonParser,(req,res)=>{
        let newReporte = new Reportes(req.body);
        newReporte.save(err=>{
            if(err){
                //console.log('Error creando reporte \x1b[36m%s\x1b[0m', '/bloquearUsuarioDirecto', err.message);   
            }
        });
        res.send(true);
    });

    router.post('/men/:id',async (req,res)=>{
        let id = req.params.id.toString();          
        
        const doc = await usuario.findOne({ id });
        
        let mensajes = doc.nuevosMensajes;
        mensajes['4']=0;
        console.log(mensajes);
        usuario.updateOne({id}, {$pull:{[`nuevosMensajes.${5}`]:0}}).exec();        
        await doc.save();

        res.send(true);
    })

    router.post('/actMensajesVistos',jsonParser,(req,res)=>{
        let id = parseInt(req.body.id);
        let mensajes = req.body.mensajes;        

        usuario.updateOne({"id":id}, {$set: { 'nuevosMensajes':mensajes }}).exec(err=>{
            if(err){
                //console.log('Error actualizando mensajes sin leer \x1b[36m%s\x1b[0m', '/actMensajesVistos', err.message);
            }
        });

        res.send(true);
    });

    //-----------
    router.post('/loginHuella/:idMovil',(req,res)=>{
        let id = req.params.idMovil;
        if(id){  
            Usuario.findOne({"idMovil": id}).exec((err,usuarios)=>{
                if(err){
                    //console.log('Error recuperando usuario \x1b[36m%s\x1b[0m', 'usuarios/id', err.message);                    
                    return;
                }                    
                res.json(usuarios);
            });
        }
    });
    router.post('/registrarHuella/:id/:idMovil',jsonParser,(req,res)=>{
        let id = req.params.id;
        let newField = req.params.idMovil;
        console.log(req.params)
        Usuario.updateOne({"id":id},{$set:{"idMovil":newField}}).exec((err, data)=>{
            console.log(data);
            if(err)
            console.log('Error actualizando usuario \x1b[36m%s\x1b[0m', '/changeInfo', err.message);
        });    
        res.send(true);
    });


    router.post('/compararImagenes',upload3.single('groupPicture'),async (req,res)=>{
        main(req.query.codLog+".jpg").then(v=>{
            res.send(v);
        })
    })
    router.post('/registrarRostro',upload4.single('groupPicture'),async (req,res)=>{
        res.send("¡Registro realizado con exito!");
    })

    return router;
    //---------

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function image(input) {
    // read input image file and create tensor to be used for processing
    let buffer;
    console.log('Loading image:', input);
    if (input.startsWith('http:') || input.startsWith('https:')) {
      const res = await fetch(input);
      if (res && res.ok) buffer = await res.buffer();
      else  console.log('Invalid image URL:', input, res.status, res.statusText, res.headers.get('content-type'));
    } else {
      buffer = fs.readFileSync(input);
    }
  
    // decode image using tfjs-node so we don't need external depenencies
    // can also be done using canvas.js or some other 3rd party image library
    if (!buffer) return {};
    const tensor = tf.tidy(() => {
      const decode = faceapi.tf.node.decodeImage(buffer, 3);
      let expand;
      if (decode.shape[2] === 4) { // input is in rgba format, need to convert to rgb
        const channels = faceapi.tf.split(decode, 4, 2); // tf.split(tensor, 4, 2); // split rgba to channels
        const rgb = faceapi.tf.stack([channels[0], channels[1], channels[2]], 2); // stack channels back to rgb and ignore alpha
        expand = faceapi.tf.reshape(rgb, [1, decode.shape[0], decode.shape[1], 3]); // move extra dim from the end of tensor and use it as batch number instead
      } else {
        expand = faceapi.tf.expandDims(decode, 0);
      }
      const cast = faceapi.tf.cast(expand, 'float32');
      return cast;
    });
    return tensor;
  }
  
  async function detect(tensor) {
    try {
      const result = await faceapi
        .detectAllFaces(tensor, optionsSSDMobileNet)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()
        .withAgeAndGender();
      return result;
    } catch (err) {
      log.error('Caught error', err.message);
      return [];
    }
  }
  
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  function detectPromise(tensor) {
    return new Promise((resolve) => faceapi
      .detectSingleFace(tensor, optionsSSDMobileNet)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender()
      .then((res) => resolve(res))
      .catch((err) => {
        log.error('Caught error', err.message);
        resolve([]);
      }));
  }
  
  function print(face) {
    const expression = Object.entries(face.expressions).reduce((acc, val) => ((val[1] > acc[1]) ? val : acc), ['', 0]);
    const box = [face.alignedRect._box._x, face.alignedRect._box._y, face.alignedRect._box._width, face.alignedRect._box._height];
    const gender = `Gender: ${Math.round(100 * face.genderProbability)}% ${face.gender}`;
    console.log(`Detection confidence: ${Math.round(100 * face.detection._score)}% ${gender} Age: ${Math.round(10 * face.age) / 10} Expression: ${Math.round(100 * expression[1])}% ${expression[0]} Box: ${box.map((a) => Math.round(a))}`);
  }
  
  async function main(idArchivoRostroComparar) {

    console.log('FaceAPI single-process test');
  
    await faceapi.tf.setBackend('tensorflow');
    await faceapi.tf.enableProdMode();
    await faceapi.tf.ENV.set('DEBUG', false);
    await faceapi.tf.ready();
  
    console.log(`Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${faceapi.version.faceapi} Backend: ${faceapi.tf?.getBackend()}`);
  
    console.log('Loading FaceAPI models');
    const modelPath = path.join(__dirname, modelPathRoot);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence, maxResults });
  
    const dir = fs.readdirSync(imgPathRoot);
    
    const labeledDescriptors = [
      ]
    for (const img of dir) {
        if (!img.toLocaleLowerCase().endsWith('.jpg')) continue;
        const tensor = await image(path.join(imgPathRoot, img));
        const result = await detect(tensor);
        tensor.dispose();
        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(
            img,
              [result[0].descriptor]
        ))
      }
      const img3=idArchivoRostroComparar;
      const tensor3 = await image(path.join("./rostrosComparar", img3));
      const result3 = await detect(tensor3);
      tensor3.dispose();
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors,0.6);
      const distance= await faceMatcher.matchDescriptor(result3[0].descriptor);

      return distance;
  }