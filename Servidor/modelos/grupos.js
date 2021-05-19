const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grupoSchema = new Schema ({
    id:Number,
    nombre:String,
    descripcion:String,
    integrantes:Array,
    admin:Number
});

module.exports = mongoose.model('grupo',grupoSchema,'grupos');