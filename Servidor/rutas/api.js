const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = express.json();

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://mongodbuser:huevos1@cluster0.uk8ak.mongodb.net/meanDatabase?retryWrites=true&w=majority',err =>{
    if(err){
        console.log('Error! '+err);
    }
});

/*Modelos */
const Usuario = require('../modelos/usuario');
const Grupo = require('../modelos/grupos');

id_grupo = 2;

/*router.get('/api',(req,res)=>{
    console.log(req.params.id);
    res.send('La api funciona');    
});*/

router.get('/con',(req,res)=>{
    Usuario.find({}).exec((err,usuarios)=>{
        if(err){
            console.log('Error con los vídeos');
            return;
        }               
        res.json(usuarios);
    });
});
/*Revisar luego */
router.post('/usuarios/:id',(req,res)=>{
    let id = req.params.id;
    console.log(id);
    Usuario.find({"id": id}).exec((err,usuarios)=>{
        if(err){
            console.log('Error con los vídeos');
            return;
        }               
        console.log(usuarios);
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

router.post('/createG',jsonParser,(req,res)=>{
    

    var grupo = new Grupo(req.body)
    grupo.save(function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('group added')
    }
    })

    //grupos[id_grupo.toString()] = req.body;    
    //id_grupo++;
    res.send(true);

  
});

module.exports = router;