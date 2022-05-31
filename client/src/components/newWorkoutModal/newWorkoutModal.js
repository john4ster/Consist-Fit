import './newWorkoutModal.css';
import Modal from 'react-modal';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { getCheckedDays, prepareExercisesForUpload, addExerciseSlot, removeExerciseSlot, addExercise } from '../Utils';

Modal.setAppElement('#root');

const key = require('weak-key');

function NewWorkoutModal({ modalOpen, closeModalCallback }) {

  const { userID } = useContext(AuthContext);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [sundayChecked, setSundayChecked] = useState(false);
  const [mondayChecked, setMondayChecked] = useState(false);
  const [tuesdayChecked, setTuesdayChecked] = useState(false);
  const [wednesdayChecked, setWednesdayChecked] = useState(false);
  const [thursdayChecked, setThursdayChecked] = useState(false);
  const [fridayChecked, setFridayChecked] = useState(false);
  const [saturdayChecked, setSaturdayChecked] = useState(false);
  const [shownOnWeeklyView, setShownOnWeeklyView] = useState(false);

  //Each exercise will be an object with an id, and eventually a name when the user types one
  const [exercises, setExercises] = useState([{id: 1}]); 

  //Reset the modal to its default state
  const resetModal = () => {
    setExercises([{id: 1}]);
    setNewWorkoutName('');
    setSundayChecked(false);
    setMondayChecked(false);
    setTuesdayChecked(false);
    setWednesdayChecked(false);
    setThursdayChecked(false);
    setFridayChecked(false);
    setSaturdayChecked(false);
    setShownOnWeeklyView(false);
  }

  //Handle a day checkbox being checked or unchecked
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

  //Send workout data to backend for saving
  const saveNewWorkout = () => {
    try {
      let fullExercises = exercises.filter((exercise) => exercise.name !== undefined);
      let checkedArr = [sundayChecked, mondayChecked, tuesdayChecked, wednesdayChecked, thursdayChecked,
        fridayChecked, saturdayChecked];
      let days = getCheckedDays(checkedArr);
      let info = {
        userID: userID,
        name: newWorkoutName,
        exercises: fullExercises,
        days: days,
        shownOnWeekly: shownOnWeeklyView,
      }
      axios.post('/addWorkout', info)
      .then(res => {
        resetModal();
        closeModalCallback();
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    }
    catch(err) {
      console.log(err);
    }
  }
  
  return (
    <Modal isOpen={modalOpen} className="inputModal">

        <div className="leftHalf">
          <h1 className="newWorkoutTitle">New Workout</h1>
          <input 
          type="text" 
          placeholder="Workout Name" 
          required 
          className="workoutNameInput"
          onChange={e => setNewWorkoutName(e.target.value)}/>
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
                <button className="addExercise" 
                onClick={() => setExercises(addExerciseSlot(exercises))}>Add Exercise</button>
                <button className="removeExercise" 
                onClick={() => setExercises(removeExerciseSlot(exercises))}>Remove Exercise</button>
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
            <p className='closeButton' onClick={() => closeModalCallback()}>+</p>
            <button className="saveButton" onClick={saveNewWorkout}>Save Workout</button>
          </div>

      </Modal>
  )
}

export default NewWorkoutModal;