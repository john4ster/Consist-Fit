import './workouts.css';
import Sidebar from '../../components/sidebar/sidebar';
import { useState } from 'react';
import NewWorkoutModal from '../../components/workoutModal/workoutModal';

const key = require('weak-key');

function Workouts() {

  const [modalOpen, setModalOpen] = useState(false);
  const closeModalCallback = () => setModalOpen(false);

  return (
    <div className="Workouts">
      <div className="Sidebar">
        <Sidebar workoutsSelected={true}/>
      </div>
      <h1>My Workouts</h1>
      <button className="addWorkoutButton" onClick={() => setModalOpen(true)}>Add Workout</button>
      <NewWorkoutModal modalOpen={modalOpen} closeModalCallback={closeModalCallback} />
    </div>
  );
}

export default Workouts;