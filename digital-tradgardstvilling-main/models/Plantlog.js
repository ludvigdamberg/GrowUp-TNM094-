const mongoose = require('mongoose')


const plantlog = mongoose.Schema({
    plant_id:{
        type: String,
        required : [true, "Need a plant ID."]
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    img:{
        type: String
    },
    description:{
        type: String,

    },
    user_id : {
        type: String,
        required: true
    }


})

mongoose.models = {};

var PlantLog = mongoose.model('PlantLog', plantlog);

export default PlantLog;