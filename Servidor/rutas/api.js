const express = require('express');
const router = express.Router();

id_grupo = 2;
var grupos = {
    1 : {
        nombre : 'Inglés III',
        descripcion : 'Grupo de inglés',
        usuarios : [1,2,3]
    }
}

var usuarios = {
    1 : {
        nombre : 'Pablo',
        descripcion : 'Me gustan los cubos'
    },
    2 : {
        nombre : 'Marco',
        descripcion : 'No me gustan los cubos'
    },
    3:{
        nombre: 'Luis',
        descripcion : 'Aveces me gustan los cubos'
    }
}

/*router.get('/api',(req,res)=>{
    console.log(req.params.id);
    res.send('La api funciona');    
});*/

router.post('/usuarios/:id',(req,res)=>{
    //TODO: Instalar Body Parser !!
    //console.log(req.body);
    let id = req.params.id;
    res.send(usuarios[id]);    
});

router.post('/grupos',(req,res)=>{
    res.send(grupos);
});

module.exports = router;