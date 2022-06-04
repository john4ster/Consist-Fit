# Consist Fit
Consist Fit is a web app focused on one thing: helping users stay consistent with their workouts. Some workout apps can be overwhelming for people who casually go to the gym, or for people looking to get back into the gym. While many workout apps show you lots of statistics on your workouts and diet, Consit Fit takes the opposite approach and simply helps you track how often you go to the gym. Users just login once a day to report if they met their fitness goals for that day, and they can view how consistent they've been on a weekly or monthly timescale. Consist Fit is aimed at people trying to build a new gym habit, people trying to get back into the gym, or people that are into exercising on a more casual level.

# Features

### Home Page
* The home page shows a view of this week, with any days the user has checked off
* It also allows the user to check and uncheck days
* The home page also displays what workouts should be done on each day to help keep the user on schedule

### Workouts Page
* The workouts page shows the user's saved workouts, displaying info such as the name, days, and exercises
* The user can also create new workouts and edit existing workouts here
* This is also where the user can decide which workouts appear on the weekly view on the home page

### Calendar Page
* The calendar page allows the user to see how consistent they have been over the past month, as well as previous months

# Authentication System
* Consist Fit uses the React Context API to keep track of which user is logged in
* It also uses the browser's local storage to store the user, so the user stays logged in if they revisit the page

# Usage
Consist-Fit is available to use at the following URL: https://consist-fit-heroku.herokuapp.com/

If you'd like to try the app without making an account, you can use a sample account with the following credentials:

`username: john@gmail.com`

`password: consistfit123!`

# Technologies
Consist Fit is built using the MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS).
