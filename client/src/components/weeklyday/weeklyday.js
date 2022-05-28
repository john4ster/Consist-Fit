import './weeklyday.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function WeeklyDay({ day, date, workoutCompleted }) {

  const { userID } = useContext(AuthContext);
  const dateString = date.toDateString().slice(3, -4)

  //Check or uncheck the day
  const handleCheck = () => {
    let info = {
      userID: userID,
      date: date.setHours(0, 0, 0, 0),
      checked: workoutCompleted,
    }
    axios.post('/checkDate', info)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="WeeklyDay">
      <div className="dayDate">
        <h2 className="day">{day}</h2>
        <p className="date">{dateString}</p>
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