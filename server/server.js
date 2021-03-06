const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./models/users');
const path = require('path'); 
require('dotenv').config();

//Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.DATABASE_LINK);

app.use('/', express.static(path.join(__dirname, '../client/build')));

app.post('/api/auth/register', async (req, res) => {
  const email = req.body.email;
  //Salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Make sure the email is not already in use
  const accountsUsingEmail = await UserModel.find({
    "email": email,
  });

  if (accountsUsingEmail.length > 0) {
    return res.status(400).send("Error: Email already in use");
  }
  //Create new user
  const newUser = new UserModel({
    "email": email,
    "password": hashedPassword,
  });

  //Save the user
  const user = await newUser.save();
  console.log("New user registered");
  return res.status(200).json(user);
});

app.post('/api/auth/login', async (req, res) => {
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
          return res.status(400).send("Wrong Password"); 
        }
        //If the user passed all previous checks, send back the user id for authentication
        return res.status(200).json(result._id);
      });
    }
  });
});

//Route to handle a workout being checked or unchecked
app.post('/api/checkDate', (req, res) => {
  const userID = req.body.userID;
  const date = req.body.date;
  const checked = req.body.checked;
  if (checked) {
    UserModel.updateOne({"_id": userID}, {$pull: {"checkedDates": date}})
    .then(() => {
      return res.status(200).send("Date Unchecked");
    })
    .catch(err => {
      console.log(err);
    });
  }
  else {
    UserModel.updateOne({"_id": userID}, {$push: {"checkedDates": date}})
    .then(() => {
      return res.status(200).send("Date Checked Added");
    })
    .catch(err => {
      console.log(err);
    });
  }
});

//Route to post a new workout for the user
//Need to limit weekly views eventually to 1 or 2
app.post('/api/addWorkout', async (req, res) => {
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

  //Make sure the name is not too long
  if (workoutName.length > 9) {
    return res.status(400).send("Error: Workout Name must be less than 10 characters")
  }

  //Check for duplicate names
  const duplicateNames = await UserModel.find({
    "_id": userID, 
    "workouts": { $elemMatch: { "name": workoutName } }
  });
  if (duplicateNames.length > 0) {
    return res.status(400).send("Error: Duplicate Workout Names Not Allowed");
  }

  //Check to make sure user only has one workout shown per day on weekly view
  //Example: If there is already a workout shown for Monday, we don't want this workout showing there too
  if (shownOnWeekly) {
    const weeklyWorkoutResults = await UserModel.find({
        "_id": userID,
        "shownOnWeekly": true,
      });
    let overlap = false;
    //Go through results, and get each workout day. If req.days contains a workout day already, there is
    //overlap and we need to return an error
    weeklyWorkoutResults.map((result) => {
      result.workouts.map((workout) => {
        workout.days.map((day) => {
          if (days.includes(day)) {
            overlap = true;
          }
        });
      });
    });
    //If there was overlap, return the error
    if (overlap) {
      return res.status(400).send("Error: Days for this workout overlap with another workout that is already Shown on the Weekly View.")
    }
  }

  //If the above checks were passed, we can add the new workout
  UserModel.updateOne({"_id": userID}, {$push: { "workouts": workout }})
  .then(() => {
    return res.status(200).send("New Workout Added");
  })
  .catch(err => {
    console.log(err);
  });
});

//Route to edit a workout for the user
app.post('/api/editWorkout', async (req, res) => {
  const userID = req.body.userID;
  const oldWorkoutName = req.body.oldName;
  const newWorkoutName = req.body.newName;
  const exercises = req.body.exercises;
  const days = req.body.days
  const shownOnWeekly = req.body.shownOnWeekly;

  //Make sure workout name is not too long
  if (newWorkoutName.length > 9) {
    return res.status(400).send("Error: Workout Name must be less than 10 characters")
  }

  //Check for duplicate names
  if (newWorkoutName !== oldWorkoutName) {
    const duplicateNames = await UserModel.find({
      "_id": userID, 
      "workouts": { $elemMatch: { "name": newWorkoutName } }
    });
    if (duplicateNames.length > 0) {
      return res.status(400).send("Error: Duplicate Workout Names Not Allowed");
    }
  }

  //Check to make sure user only has one workout shown per day on weekly view
  //Example: If there is already a workout shown for Monday, we don't want this workout showing there too if Monday
  // and shownOnWeekly are both checked
  if (shownOnWeekly) {
    const weeklyWorkoutResults = await UserModel.find({
      "_id": userID,
      "shownOnWeekly": true,
    });
    let overlap = false;
    //Go through results, and get each workout day. If req.days contains a workout day already, there is
    //overlap and we need to return an error
    weeklyWorkoutResults.map((result) => {
      result.workouts.map((workout) => {
        if (workout.name !== oldWorkoutName) { //Avoid current workout being flagged as a separate workout
          workout.days.map((day) => { 
            if (days.includes(day)) {
              overlap = true;
            }
          });
        }
      });
    });
    //If there was overlap, return the error
    if (overlap) {
      return res.status(400).send("Error: Days for this workout overlap with another workout that is already Shown on the Weekly View.")
    }
  }

  //If the above checks were passed, update the workout
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
    return res.status(200).send('Workout Updated');
  })
  .catch(err => {
    console.log(err);
  })
});

//Route to delete a workout for the user
app.post('/api/deleteWorkout', (req, res) => {
  const userID = req.body.userID;
  const workout = req.body.workout;
  const workoutName = workout.name;
  UserModel.updateOne({"_id": userID}, { $pull: { "workouts": { "name": workoutName } }})
  .then(() => {
    return res.status(200).send('Workout Deleted');
  })
  .catch(err => {
    console.log(err);
  });
});

//Route to get dates the user has checked off this week
app.get('/api/userData/checkedDates', (req, res) => {
  const userID = req.query.userID;
  UserModel.findById(userID)
  .then(result => {
    return res.status(200).send(result.checkedDates);
  })
  .catch(err => {
    console.log(err);
  });
});

//Route to get the user's saved workouts
app.get('/api/userData/workouts', (req, res) => {
  const userID = req.query.userID;
  UserModel.findById(userID)
  .then(result => {
    return res.status(200).send(result.workouts);
  })
  .catch(err => {
    console.log(err);
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening`);
});