const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema ({
    id:Number,
    nombre:String,
    descripcion:String,
    grupos:Array,
    email : String,
    contraseña : String,
    preguntaSeguridad : String,
    respuesta : String,
    fotoPerfil : String,
    estado : Boolean,
    nuevosMensajes : Object,
    idMovil : String
});

module.exports = mongoose.model('usuario',usuarioSchema,'usuarios');