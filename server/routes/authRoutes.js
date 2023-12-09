const express = require('express');
const UserModel = require('../models/users.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

router.post('/sendResetEmail', async (req, res) => {
  //See if the user exists
  await UserModel.findOne({"email": req.body.email})
  .then(async result => {
    //If a result was not found, the user does not exist
    if (!result) {
      res.status(404).send("User not found");
    }
    //If a result was found, the user exists, send a reset email
    else {
      //Send reset email
      //Set up nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASSWORD,
        },
      });

      //Generate the reset token and url
      const secret = JWT_SECRET + result.password;
      const token = jwt.sign({email: result.email, id: result._id}, secret, {expiresIn: '5m'});
      const resetURL = `${process.env.FRONTEND_URL}/resetPassword/${result._id}/${token}`;

      //Send the email with the reset link
      const emailText = `There was a request to reset your password. If you did not make this request, please reach out to us at ${process.env.APP_EMAIL}.\n\n` +
      `Here is the link to reset your password; it will expire in 5 minutes:\n` +
      `${resetURL}`;

      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: req.body.email,
        subject: 'Reset Password Request',
        text: emailText,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Email sent: " + info.response);
          return res.status(200).send("Email Sent");
        }
      });
    }
  });
});

router.post('/resetPassword/:id/:token', async (req, res) => {
  const {id, token} = req.params;
  const newPassword = req.body.newPassword;

  //Verify user exists and token is valid
  const user = await UserModel.findOne({"_id": id});
  if (!user) {
    return res.status(404).send("User not found");
  }
  const secret = JWT_SECRET + user.password;
  try {
    jwt.verify(token, secret);
    //If the token is valid, we can now reset the password
    //Salt and hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    //Update the user's password and let them know if it was successful
    const resetResult = await UserModel.updateOne({"_id": id}, {"password": hashedPassword});
    if (!resetResult) {
      return res.status(400).send("Error resetting password");
    }
    res.status(200).send("Password Successfully Reset");
  }
  catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).send("Token Not Verified");
  }
});

module.exports = router;