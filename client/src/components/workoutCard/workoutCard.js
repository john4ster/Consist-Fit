import './workoutCard.css';
import { useContext, useState, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import EditWorkoutModal from '../editWorkoutModal/editWorkoutModal';
import NewWorkoutModal from '../newWorkoutModal/newWorkoutModal';

const key = require('weak-key');

function WorkoutCard({ workout }) {

  const { userID } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const closeModalCallback = () => setModalOpen(false);
  
  const handleDelete = () => {
    if(window.confirm('Are you sure you want to delete this workout?')) {
      try {
        let info = {
          userID: userID,
          workout: workout,
        }
        axios.post('/userData/deleteWorkout', info)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      }
      catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="WorkoutCard" onClick={() => setModalOpen(true)}>
      <div className="header">
        <h2>{workout.name}</h2>
        <h3>Days</h3>
        {workout.days.map((day) => {
          return (
            <p key={key({})}>{day}</p>
          )
        })}
        <button className="deleteButton" onClick={handleDelete}>Delete</button>
      </div>

      <div className="line"></div>

      <div className="exercises">
        <h3>Exercises</h3>
        {workout.exercises.map((exercise) => {
          return (
            <p key={key({})}>{exercise}</p>
          )
        })}
      </div>

    </div>
  );
}

export default WorkoutCard;