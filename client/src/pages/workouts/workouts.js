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
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const closeModalCallback = () => setNewModalOpen(false);

  useEffect(() => {
    axios.get('/userData/workouts', { params: {userID} })
    .then(res => {
      setWorkouts(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [userID, workouts]);

  return (
    <div className="Workouts">
      <div className="Sidebar">
        <Sidebar workoutsSelected={true}/>
      </div>
      <h1 className="Title">My Workouts</h1>

      <div className="workoutCards">
        {workouts?.map((workout) => {
          return (
            <WorkoutCard key={workout.name} workout={workout} />
          )
        })}
      </div>

      <button className="addWorkoutButton" onClick={() => setNewModalOpen(true)}>Add Workout</button>
      <NewWorkoutModal modalOpen={newModalOpen} closeModalCallback={closeModalCallback} />
    </div>
  );
}

export default Workouts;