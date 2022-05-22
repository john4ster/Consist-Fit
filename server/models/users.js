const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  checkedDates: { //Stores list of dates that the user has worked out
    type: Array,
  },
  workouts: {
    type: Array,
  },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;