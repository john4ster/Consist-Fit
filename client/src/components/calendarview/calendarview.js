import './calendarview.css';
import CalendarDay from '../calendarday/calendarday';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function CalendarView() {

  const today = new Date();
  const monthString = today.toDateString().substring(4, 7);
  const yearString = today.toDateString().substring(10);
  const { userID } = useContext(AuthContext);
  const [checkedDates, setCheckedDates] = useState([]);

  useEffect(() => {
    //Make a request to the server to get dates the user has checked off
    axios.get('/weeklyChecks', { params: {userID} })
    .then(res => {
      setCheckedDates(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID]);

  const getDaysInMonth = (month, year) => {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  //Change the month by going back one month or forward one month
  const changeMonth = (direction) => {
    if (direction === "forward") {
      console.log("forward");
    }
    else {
      console.log("backward");
    }
  }

  const days = getDaysInMonth(today.getMonth(), today.getFullYear());

  return (
    <div className="CalendarView">
      <div className="calendarHeader">
        <ArrowCircleLeftIcon className="arrow" fontSize="large" onClick={e => changeMonth("backward")}/>
        <h1 className="monthTitle">{monthString + yearString}</h1>
        <ArrowCircleRightIcon className="arrow" fontSize="large" onClick={e => changeMonth("forward")}/>
      </div>
      <div className="days">
        {days.map(d => (
          <CalendarDay date={d} checked={checkedDates.includes(d.setHours(0, 0, 0, 0))}/>
        ))}
      </div>
    </div>
  );
}

export default CalendarView;