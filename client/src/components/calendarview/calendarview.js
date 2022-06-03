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

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const today = new Date();
  const [monthNum, setMonthNum] = useState(today.getMonth());
  const [yearNum, setYearNum] = useState(today.getFullYear());
  const monthString = monthNames[monthNum];
  const yearString = yearNum.toString();
  const { userID } = useContext(AuthContext);
  const [checkedDates, setCheckedDates] = useState([]);

  useEffect(() => {
    //Make a request to the server to get dates the user has checked off
    axios.get('/api/userData/checkedDates', { params: {userID} })
    .then(res => {
      setCheckedDates(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID, checkedDates]);

  //Get all days in the selected month
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
      if (monthNum === 11) { //If the month is December, advance to January of the next year
        setMonthNum(0);
        setYearNum(yearNum + 1);
      }
      else {
        setMonthNum(monthNum + 1);
      }
    }
    else {
      if (monthNum === 0) { //If the month is January, go back to December of the last year
        setMonthNum(11);
        setYearNum(yearNum - 1);
      }
      else {
        setMonthNum(monthNum - 1);
      }
    }
  }

  //Get all the days in the selected month
  const days = getDaysInMonth(monthNum, yearNum);

  return (
    <div className="CalendarView">
      <div className="calendarHeader">
        <ArrowCircleLeftIcon className="arrow" fontSize="large" onClick={() => changeMonth("backward")}/>
        <h1 className="monthTitle">{monthString + " " + yearString}</h1>
        <ArrowCircleRightIcon className="arrow" fontSize="large" onClick={() => changeMonth("forward")}/>
      </div>
      <div className="days">
        {days.map(d => (
          <CalendarDay key={d} date={d} checked={checkedDates.includes(d.setHours(0, 0, 0, 0))}/>
        ))}
      </div>
    </div>
  );
}

export default CalendarView;