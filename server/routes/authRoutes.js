const express = require('express');
const UserModel = require('../models/users.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

module.exports = router;