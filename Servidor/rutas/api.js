const express = require('express');
const jsonParser = express.json();
const emailExistence = require('email-existence');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');

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

    id_grupo = 2;
   
    /*Moví el método a los sockets */     

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