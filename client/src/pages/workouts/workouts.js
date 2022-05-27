import './workouts.css';
import Sidebar from '../../components/sidebar/sidebar';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import NewWorkoutModal from '../../components/newWorkoutModal/newWorkoutModal';
import WorkoutCard from '../../components/workoutCard/workoutCard';

const key = require('weak-key');

function Workouts() {

  const { userID } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const closeModalCallback = () => setModalOpen(false);

  useEffect(() => {
    axios.get('/userData/workouts', { params: {userID} })
    .then(res => {
      setWorkouts(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID]);

  return (
    <div className="Workouts">
      <div className="Sidebar">
        <Sidebar workoutsSelected={true}/>
      </div>
      <h1 className="Title">My Workouts</h1>

      <div className="workoutCards">
        {workouts.map((workout) => {
          return (
            <WorkoutCard workout={workout} />
          )
        })}
      </div>

      <button className="addWorkoutButton" onClick={() => setModalOpen(true)}>Add Workout</button>
      <NewWorkoutModal modalOpen={modalOpen} mode={'new'} closeModalCallback={closeModalCallback} />
    </div>
  );
}

export default Workouts;