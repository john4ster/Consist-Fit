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

  useEffect(() => {
    //Make a request to the server to get dates the user has checked off
    axios.get('/api/dates/checkedDates', { params: {userID} })
    .then(res => {
      setCheckedDates(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID, checkedDates]);

  return (
    <div className="Home">
      <div className="Sidebar">
        <Sidebar homeSelected={true}/>
      </div>
      <div className="homeArea">
        <div className="weeklyView"> 
          <WeeklyView today={today} checkedDates={checkedDates}/>
        </div>
      </div>
    </div>
  );
}

export default Home;