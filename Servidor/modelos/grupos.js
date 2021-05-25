const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grupoSchema = new Schema ({
    id:Number,
    mensaje:{
        archivo:{
            mensaje:String,
            remitente:Number,
            hora:Date

        }
    },
    miembrosDelGrupo:{
        integrantes:Array,
        admin:Array,
    },
    informacion:{
        foto:String,
        nombre:String,
        descripcion:String
    }
});

module.exports = mongoose.model('grupo',grupoSchema,'grupos');