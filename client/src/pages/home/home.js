import './home.css';
import Sidebar from '../../components/sidebar/sidebar';
import WeeklyView from '../../components/weeklyview/weeklyview';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Home() {

  const { userID } = useContext(AuthContext);
  const [checkedDates, setCheckedDates] = useState([]);
  const today = new Date(); 
  const [todayChecked, setTodayChecked] = useState(false);

  useEffect(() => {
    //Make a request to the server to get dates the user has checked off
    axios.get('/weeklyChecks', { params: {userID} })
    .then(res => {
      setCheckedDates(res.data);
      if (res.data.includes(today.setHours(0, 0, 0, 0))) {
        setTodayChecked(true);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID]);

  //Handle user adding a new date
  const handleNewDate = (e) => {
    e.preventDefault();
    let todayDate = new Date().setHours(0, 0, 0, 0);
    let info = {
      userID: userID,
      newDate: todayDate,
    }
    try {
      axios.post("/addDate", info)
      .then(res => {
        console.log(res);
        setTodayChecked(true);
        setCheckedDates([...checkedDates, todayDate]);
      })
      .catch(err => {
        console.log(err);
      });
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="Home">
      <div className="Sidebar">
        <Sidebar homeSelected={true}/>
      </div>
      <div className="checkArea">
        <div className="weeklyView"> 
          <WeeklyView today={today} checkedDates={checkedDates}/>
        </div>

        {todayChecked 
        ? 
        <span></span>
        : 
        <div className="checkupBox">
          <h3>Did you workout today?</h3>
          <button onClick={e => handleNewDate(e)}>Yes</button>
        </div>}

      </div>
    </div>
  );
}

export default Home;