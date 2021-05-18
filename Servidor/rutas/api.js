const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var jsonParser = express.json();

id_grupo = 2;
var grupos = {
    '1' : {
        nombre : 'Inglés III',
        descripcion : 'Grupo de inglés',
        usuarios : ['1','2','3']
    }
}

var usuarios = {
    '1' : {
        nombre : 'Pablo',
        descripcion : 'Me gustan los cubos'
    },
    '2' : {
        nombre : 'Marco',
        descripcion : 'No me gustan los cubos'
    },
    '3':{
        nombre: 'Luis',
        descripcion : 'Aveces me gustan los cubos'
    }
}

/*router.get('/api',(req,res)=>{
    console.log(req.params.id);
    res.send('La api funciona');    
});*/

router.post('/usuarios/:id',(req,res)=>{
    let id = req.params.id;
    res.send(usuarios[id]);    
});

router.post('/grupos',(req,res)=>{    
    res.send(grupos);
});

router.post('/createG',jsonParser,(req,res)=>{
    //console.log(req.body);
    grupos[id_grupo.toString()] = req.body;    
    id_grupo++;
    res.send(true);
});

module.exports = router;