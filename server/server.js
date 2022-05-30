const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require('./models/users');
require('dotenv').config();

//Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.DATABASE_LINK);

app.post('/auth/register', async (req, res) => {
  try {
    //Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const newUser = new UserModel({
      "email": req.body.email,
      "password": hashedPassword,
    });

    //Save the user
    const user = await newUser.save();
    console.log("New user registered");
    res.status(200).json(user);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    //See if the user exists
    await UserModel.findOne({"email": req.body.email})
    .then(async result => {
      //If a result was not found, the user does not exist
      if (!result) {
        res.status(404).send("User not found");
      }
      //If a result was found, the user exists, check the password
      else {
        await bcrypt.compare(req.body.password, result.password) //Compare the passwords
        .then(validPassword => {
          //If the passwords don't match, do not log the user in 
          if (!validPassword) { 
            res.status(500).send("Wrong Password"); 
          }
          //If the user passed all previous checks, send back the user id for authentication
          res.status(200).json(result._id);
        });
      }
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Route to handle a workout being checked or unchecked
app.post('/checkDate', (req, res) => {
  try {
    const userID = req.body.userID;
    const date = req.body.date;
    const checked = req.body.checked;
    if (checked) {
      UserModel.updateOne({"_id": userID}, {$pull: {"checkedDates": date}})
      .then(() => {
        res.status(200).send("Date Unchecked");
      })
      .catch(err => {
        console.log(err);
      });
    }
    else {
      UserModel.updateOne({"_id": userID}, {$push: {"checkedDates": date}})
      .then(() => {
        res.status(200).send("Date Checked Added");
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Route to post a new workout for the user
//Need to limit weekly views eventually to 1 or 2
app.post('/addWorkout', (req, res) => {
  try {
    const userID = req.body.userID;
    const workoutName = req.body.name;
    const exercises = req.body.exercises;
    const days = req.body.days;
    const shownOnWeekly = req.body.shownOnWeekly;
    const workout = {
      name: workoutName,
      exercises: exercises,
      days: days,
      shownOnWeekly: shownOnWeekly,
    }
    UserModel.updateOne({"_id": userID}, {$push: { "workouts": workout }})
    .then(() => {
      res.status(200).send("New Workout Added");
    })
    .catch(err => {
      console.log(err);
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Route to edit a workout for the user
app.post('/editWorkout', (req, res) => {
  try {
    const userID = req.body.userID;
    const oldWorkoutName = req.body.oldName;
    const newWorkoutName = req.body.newName;
    const exercises = req.body.exercises;
    const days = req.body.days
    const shownOnWeekly = req.body.shownOnWeekly;
    UserModel.findOneAndUpdate(
      {
        "_id": userID, 
        "workouts": { 
          $elemMatch: { "name": oldWorkoutName } 
        }
      },
      {
        "workouts.$.name": newWorkoutName,
        "workouts.$.exercises": exercises,
        "workouts.$.days": days,
        "workouts.$.shownOnWeekly": shownOnWeekly,
      },
    )
    .then(() => {
      res.status(200).send('Workout Updated');
    })
    .catch(err => {
      console.log(err);
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
})

//Route to delete a workout for the user
app.post('/deleteWorkout', (req, res) => {
  try {
    const userID = req.body.userID;
    const workout = req.body.workout;
    const workoutName = workout.name;
    UserModel.updateOne({"_id": userID}, { $pull: { "workouts": { "name": workoutName } }})
    .then(() => {
      res.status(200).send('Workout Deleted');
    })
    .catch(err => {
      console.log(err);
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Route to get dates the user has checked off this week
app.get('/userData/checkedDates', (req, res) => {
  try {
    const userID = req.query.userID;
    UserModel.findById(userID)
    .then(result => {
      res.status(200).send(result.checkedDates);
    })
    .catch(err => {
      console.log(err);
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Route to get the user's saved workouts
app.get('/userData/workouts', (req, res) => {
  const userID = req.query.userID;
  UserModel.findById(userID)
  .then(result => {
    res.status(200).send(result.workouts);
  })
  .catch(err => {
      console.log(err);
  });
});

const port = 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});