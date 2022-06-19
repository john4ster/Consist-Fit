import './weeklyday.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function WeeklyDay({ day, date, workoutCompleted, workouts }) {

  const { userID } = useContext(AuthContext);
  const dateString = date.toDateString().slice(3, -7) + date.getDate();
  const today = new Date();

  //See if this date is today
  const dateIsToday = (date) => {
    if (today.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  }
  const isToday = dateIsToday(date);

  //Check or uncheck the day
  const handleCheck = () => {
    let info = {
      userID: userID,
      date: date.setHours(0, 0, 0, 0),
      checked: workoutCompleted,
    }
    axios.post('/api/checkDate', info)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="WeeklyDay" style={isToday ? {background: "#D8D8D8" } : {background: "white" }}>
      <div className="dayDate">
        <h2 className="day">{day}</h2>
        <p className="date">{dateString}</p>
        {workouts?.map((workout) => {
          return (
            <p className="workout">{workout.name}</p>
          )
        })}
      </div>
      <div className="status">
        {workoutCompleted 
        ? <CheckCircleIcon className="filledCheckBubble" fontSize="large" onClick={handleCheck}/> 
        : <RadioButtonUncheckedIcon className="emptyCheckBubble" fontSize="large" onClick={handleCheck}/>}
      </div>
    </div>
  );
}

export default WeeklyDay;