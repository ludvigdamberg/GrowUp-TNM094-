import mongoose from "mongoose";
var Schema = mongoose.Schema;

var plant = new Schema({
  nickname: {
    type: String,
    trim: true,
    maxlength: [20, "Name cannot exceede 20 characters"],
  },
  flower_name: {
    type: String,
    trim: true,
    maxlength: [50, "Name cannot exceede 50 characters"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    maxlength: [50, "Name cannot exceede 50 characters"],
    trim: true,
  },
  last_watered: {
    type: Date,
    default: Date.now,
  },
  water_interval: {
    type: Number,
    default: 7,
  },
  information: {
    type: String,
  },
  assignments: {
    // -> Varje slot är ett objekt med nycklarna "text": String och "complete": Boolean
    type: [Object],
  },
  wiki_url: {
    type: String,
  },
  img: {
    type: String,
  },
  user_id: {
    type: String,
    required: true,
  },
});

mongoose.models = {};

var Plant = mongoose.model("Plant", plant);

export default Plant;
