const express = require('express');
const UserModel = require('../models/users.js');

const router = express.Router();

router.post('/addWorkout', async (req, res) => {
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
router.post('/editWorkout', async (req, res) => {
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
router.post('/deleteWorkout', (req, res) => {
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

//Route to get the user's saved workouts
router.get('/userWorkouts', (req, res) => {
  const userID = req.query.userID;
  UserModel.findById(userID)
  .then(result => {
    return res.status(200).send(result.workouts);
  })
  .catch(err => {
    console.log(err);
  });
});

module.exports = router;