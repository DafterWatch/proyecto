const express = require('express');
const jsonParser = express.json();

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
       console.log(id);
       console.log(idGroup);
       console.log(isAdmin);

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

    return router;
}