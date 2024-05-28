const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchHistorySchema = new Schema({
    keyword:{type:String, required:true},
    searchDate:{type: Date, default:Date.now},
    opportunities:{type:Array, required: true}
});

module.exports = mongoose.model('searchHistory',searchHistorySchema)