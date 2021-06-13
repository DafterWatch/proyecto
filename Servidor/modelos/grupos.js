const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grupoSchema = new Schema ({
    id:Number,
    mensajes:Array,
    miembrosDelGrupo:{
        integrantes:Array,
        admin:Array,
    },
    informacion:{
        foto:String,
        nombre:String,
        descripcion:String
    },
    mensajeFijado:String,
    tareas:Array

});

module.exports = mongoose.model('grupo',grupoSchema,'grupos');