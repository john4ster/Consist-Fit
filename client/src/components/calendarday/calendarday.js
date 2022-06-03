import './calendarday.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function CalendarDay({ date, checked }) {

  const { userID } = useContext(AuthContext);
  const day = date.getDate();

  const handleCheck = () => {
    let info = {
      userID: userID,
      date: date.setHours(0, 0, 0, 0),
      checked: checked,
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
    <div className="CalendarDay" style={checked ? {background: "#0e8610" } : {background: "white" }}>
      <p className="dayNum">{day}</p>
      <div className="dayStatus">
        <div className="bubble">
          {checked
          ? <CheckCircleIcon className="filledCheckBubble" fontSize="medium" onClick={handleCheck} /> 
          : <RadioButtonUncheckedIcon className="emptyCheckBubble" fontSize="medium" onClick={handleCheck} />}
        </div>
      </div>
    </div>
  );
}

export default CalendarDay;