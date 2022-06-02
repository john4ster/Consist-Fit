import './editWorkoutModal.css';
import Modal from 'react-modal';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { getCheckedDays, addExerciseSlot, removeExerciseSlot, addExercise } from '../Utils';

Modal.setAppElement('#root');

function EditWorkoutModal({ modalOpen, workout, closeModalCallback }) {

  const { userID } = useContext(AuthContext);
  const [newWorkoutName, setNewWorkoutName] = useState(workout.name);
  const oldWorkoutName = workout.name;
  const [sundayChecked, setSundayChecked] = useState(workout.days.includes("Sunday"));
  const [mondayChecked, setMondayChecked] = useState(workout.days.includes("Monday"));
  const [tuesdayChecked, setTuesdayChecked] = useState(workout.days.includes("Tuesday"));
  const [wednesdayChecked, setWednesdayChecked] = useState(workout.days.includes("Wednesday"));
  const [thursdayChecked, setThursdayChecked] = useState(workout.days.includes("Thursday"));
  const [fridayChecked, setFridayChecked] = useState(workout.days.includes("Friday"));
  const [saturdayChecked, setSaturdayChecked] = useState(workout.days.includes("Saturday"));
  const [shownOnWeeklyView, setShownOnWeeklyView] = useState(workout.shownOnWeekly);
  const [exercises, setExercises] = useState(workout.exercises); 

  const handleCheck = (check) => {
    switch(check) {
      case 'Sunday': setSundayChecked(!sundayChecked); break;
      case 'Monday': setMondayChecked(!mondayChecked); break;
      case 'Tuesday': setTuesdayChecked(!tuesdayChecked); break;
      case 'Wednesday': setWednesdayChecked(!wednesdayChecked); break;
      case 'Thursday': setThursdayChecked(!thursdayChecked); break;
      case 'Friday': setFridayChecked(!fridayChecked); break;
      case 'Saturday': setSaturdayChecked(!saturdayChecked); break;
      case 'WeeklyView': setShownOnWeeklyView(!shownOnWeeklyView); break;
    }
  }

  const saveChanges = () => {
    try {
      let fullExercises = exercises.filter((exercise) => exercise.name !== undefined);
      let checkedArr = [sundayChecked, mondayChecked, tuesdayChecked, wednesdayChecked, thursdayChecked,
                        fridayChecked, saturdayChecked];
      let days = getCheckedDays(checkedArr);
      let info = {
        userID: userID,
        oldName: oldWorkoutName,
        newName: newWorkoutName,
        exercises: fullExercises,
        days: days,
        shownOnWeekly: shownOnWeeklyView,
      }
      axios.post('/editWorkout', info)
      .then(res => {
        closeModalCallback();
        console.log(res);
      })
      .catch(err => {
        if (err.response.status === 400) {
          window.alert(err.response.data);
        }
        console.log(err);
      })
    }
    catch(err) {
      console.log(err);
    }
  }

  const deleteWorkout = (e) => {
    if(window.confirm('Are you sure you want to delete this workout?')) {
      try {
        let info = {
          userID: userID,
          workout: workout,
        }
        axios.post('/deleteWorkout', info)
        .then(res => {
          console.log(res);
          e.stopPropagation();
          closeModalCallback();
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
    <Modal isOpen={modalOpen} className="editModal">

      <div className="leftHalf">
        <h1 className="editWorkoutTitle">Edit Workout</h1>
          <input 
          type="text" 
          placeholder="Workout Name" 
          value={newWorkoutName}
          required 
          className="workoutNameInput"
          onChange={e => setNewWorkoutName(e.target.value)}/>
          <button className="deleteButton" onClick={(e) => deleteWorkout(e)}>Delete Workout</button>
        <div className="daySelection">
          <h1>Select Days</h1>
          <label>
            <input type="checkbox" checked={sundayChecked} onChange={() => handleCheck('Sunday')}/>
            Sunday
          </label>
          <label>
            <input type="checkbox" checked={mondayChecked} onChange={() => handleCheck('Monday')}/>
            Monday
          </label>
          <label>
            <input type="checkbox" checked={tuesdayChecked} onChange={() => handleCheck('Tuesday')}/>
            Tuesday
          </label>
          <label>
            <input type="checkbox" checked={wednesdayChecked} onChange={() => handleCheck('Wednesday')}/>
            Wednesday
          </label>
          <label>
            <input type="checkbox" checked={thursdayChecked} onChange={() => handleCheck('Thursday')}/>
            Thursday
          </label>
          <label>
            <input type="checkbox" checked={fridayChecked} onChange={() => handleCheck('Friday')}/>
            Friday
          </label>
          <label>
            <input type="checkbox" checked={saturdayChecked} onChange={() => handleCheck('Saturday')}/>
            Saturday
          </label>
        </div>
        <div className="weeklyViewSelection">
          <label>
            <input type="checkbox" checked={shownOnWeeklyView} onChange={() => handleCheck('WeeklyView')}/>
            Show on Weekly View
          </label>
        </div>
      </div>

      <div className="middle">
        <div className="middleHeader">
          <h1 className="exercisesTitle">Exercises</h1>
          <div className="exerciseOptions">
            <button className="addExercise" onClick={() => setExercises(addExerciseSlot(exercises))}>Add Exercise</button>
            <button className="removeExercise" onClick={() => setExercises(removeExerciseSlot(exercises))}>Remove Exercise</button>
          </div>
        </div>
          <div className="middleInputs">
            {exercises.map((x, i) => {
              return (
              <input 
              key={x.id} 
              type="text" 
              placeholder={"Exercise " + (i + 1)}
              value={x.name ? x.name : ''}
              onChange={e => setExercises(addExercise(e, e.target.value, i, exercises))}/>
              )
            })}
          </div>
      </div>

      <div className="rightHalf">
        <p className='closeButton' onClick={(e) => { 
          e.stopPropagation(); 
          closeModalCallback();
        }}>+</p>
        <button className="saveChanges" onClick={saveChanges}>Save Changes</button>
      </div>
    </Modal>
  )
}

export default EditWorkoutModal