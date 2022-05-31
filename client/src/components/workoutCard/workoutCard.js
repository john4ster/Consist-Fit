import './workoutCard.css';
import { useState } from 'react';
import EditWorkoutModal from '../editWorkoutModal/editWorkoutModal';

const key = require('weak-key');

function WorkoutCard({ workout }) {

  const [modalOpen, setModalOpen] = useState(false);
  const closeModalCallback = () => setModalOpen(false);

  return (
    <div className="WorkoutCard" onClick={() => setModalOpen(true) }>
      <div className="header">
        <h2>{workout.name}</h2>
        <h3>Days</h3>
        {workout.days.map((day) => {
          return (
            <p key={key({})}>{day}</p>
          )
        })}
      </div>

      <div className="line"></div>

      <div className="exercises">
        <h3>Exercises</h3>
        {workout.exercises.map((exercise) => {
          return (
            <p key={key({})}>{exercise.name}</p>
          )
        })}
      </div>

      <EditWorkoutModal modalOpen={modalOpen} workout={workout} closeModalCallback={closeModalCallback} />
    </div>
  );
}

export default WorkoutCard;