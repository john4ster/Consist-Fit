import './workoutCard.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function WorkoutCard({ workout }) {

  const { userID } = useContext(AuthContext);

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
    <div className="WorkoutCard">
      <div className="header">
        <h2>{workout.name}</h2>
        <h3>Days</h3>
        {workout.days.map((day) => {
          return (
            <p>{day}</p>
          )
        })}
        <button className="deleteButton" onClick={handleDelete}>Delete</button>
      </div>

      <div className="line"></div>

      <div className="exercises">
        <h3>Exercises</h3>
        {workout.exercises.map((exercise) => {
          return (
            <p>{exercise}</p>
          )
        })}
      </div>
    </div>
  );
}

export default WorkoutCard;