import './weeklyview.css';
import WeeklyDay from '../weeklyday/weeklyday';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

function WeeklyView({ today, checkedDates }) {
  
  const { userID } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    //Make a request to the server to get workouts so we can display the appropriate workout on each day
    axios.get('/api/workouts/userWorkouts', { params: {userID} })
    .then(res => {
      setWorkouts(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID, workouts]);

  //Get the first day of the week using today's date
  const getSunday = (date) => {
    const day = date.getDay();  
    if(day !== 0) {
      date.setHours(-24 * (day)); 
    }
    return date;
  }

  //See if a date is checked off
  function dateChecked(date) {
    const noTimeDate = date.setHours(0, 0, 0, 0); //Get date without time for comparison
    if (checkedDates.includes(noTimeDate)) {
      return true;
    }
    return false;
  }

  //Get the first day of the week, and week of string
  const sundayDate = getSunday(today);
  const weekOfString = sundayDate.toDateString().substring(3);
  //Calculate the rest of the days
  const day = 60 * 60 * 24 * 1000;
  const mondayDate = new Date(sundayDate.getTime() + day);
  const tuesdayDate = new Date(sundayDate.getTime() + (2 * day));
  const wednesdayDate = new Date(sundayDate.getTime() + (3 * day));
  const thursdayDate = new Date(sundayDate.getTime() + (4 * day));
  const fridayDate = new Date(sundayDate.getTime() + (5 * day));
  const saturdayDate = new Date(sundayDate.getTime() + (6 * day));
  //See which dates are checked
  let suChecked = dateChecked(sundayDate);
  let moChecked = dateChecked(mondayDate);
  let tuChecked = dateChecked(tuesdayDate);
  let weChecked = dateChecked(wednesdayDate);
  let thChecked = dateChecked(thursdayDate);
  let frChecked = dateChecked(fridayDate);
  let saChecked = dateChecked(saturdayDate);

  //Function to get the workout for a certain day
  //For now, we just get the first element, but there will be an option added for the user to select which
  //workout they want to be displayed on the weekly view
  const getWorkouts = (day) => {
    switch(day) {
      case 'Sunday': return workouts.filter((workout) => workout.days.includes("Sunday") && workout.shownOnWeekly);
      case 'Monday': return workouts.filter((workout) => workout.days.includes("Monday") && workout.shownOnWeekly);
      case 'Tuesday': return workouts.filter((workout) => workout.days.includes("Tuesday") && workout.shownOnWeekly);
      case 'Wednesday': return workouts.filter((workout) => workout.days.includes("Wednesday") && 
      workout.shownOnWeekly);
      case 'Thursday': return workouts.filter((workout) => workout.days.includes("Thursday") && workout.shownOnWeekly);
      case 'Friday': return workouts.filter((workout) => workout.days.includes("Friday") && workout.shownOnWeekly);
      case 'Saturday': return workouts.filter((workout) => workout.days.includes("Saturday") && workout.shownOnWeekly);
    }
  }

  return (
    <div className="WeeklyView">
      <h1 className="WeeklyTitle">Week of { weekOfString }</h1>
      <div className="WeeklyDays">
        <WeeklyDay day="Sunday" date={sundayDate} workoutCompleted={suChecked} workouts={getWorkouts('Sunday')}/>
        <WeeklyDay day="Monday" date={mondayDate} workoutCompleted={moChecked} workouts={getWorkouts('Monday')}/>
        <WeeklyDay day="Tuesday" date={tuesdayDate} workoutCompleted={tuChecked} workouts={getWorkouts('Tuesday')}/>
        <WeeklyDay day="Wednesday" date={wednesdayDate} workoutCompleted={weChecked} workouts={getWorkouts('Wednesday')}/>
        <WeeklyDay day="Thursday" date={thursdayDate} workoutCompleted={thChecked} workouts={getWorkouts('Thursday')}/>
        <WeeklyDay day="Friday" date={fridayDate} workoutCompleted={frChecked} workouts={getWorkouts('Friday')}/>
        <WeeklyDay day="Saturday" date={saturdayDate} workoutCompleted={saChecked} workouts={getWorkouts('Saturday')}/>
      </div>
    </div>
  );
}

export default WeeklyView;