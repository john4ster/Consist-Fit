const express = require('express');
const UserModel = require('../models/users.js');

const router = express.Router();

//Route to handle a workout being checked or unchecked
router.post('/checkDate', (req, res) => {
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

//Route to get dates the user has checked off this week
router.get('/checkedDates', (req, res) => {
  const userID = req.query.userID;
  UserModel.findById(userID)
  .then(result => {
    return res.status(200).send(result.checkedDates);
  })
  .catch(err => {
    console.log(err);
  });
});

module.exports = router;