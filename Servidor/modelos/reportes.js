const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reporteSchema = new Schema ({
    type : Number,
    id_reportado : Number,
    reporte : String,
    id_reportador : Number
});

module.exports = mongoose.model('Reporte',reporteSchema,'Reportes');