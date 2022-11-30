const mongoose = require("mongoose");

const sharediary = mongoose.Schema({
  plant_id: {
    type: String,
    required: [true, "Need a plant ID."],
  },
  code: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
});

mongoose.models = {};

var ShareDiary = mongoose.model("ShareDiary", sharediary);

export default ShareDiary;
