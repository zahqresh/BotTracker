const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
    botId:String,
    date: String,
    ip: String,
    country: String,
    region: String,
    city: String,
    languages: String,
    type:String,
    os: String,
    browser:String
});

module.exports = mongoose.model('Botschema',botSchema);