import './workouts.css';
import Sidebar from '../../components/sidebar/sidebar';
import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const key = require('weak-key');

function Workouts() {

  const { userID } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  //Each exercise will be an object with an id, and eventually a name when the user types one
  const [exercises, setExercises] = useState([{id: 1}]); 

  useEffect(() => {
    //Make a request to the server to get dates the user has checked off
    console.log(exercises.length);
  }, [userID]);

  const addWorkout = () => {
    setModalOpen(true);
  }

  const addExerciseSlot = () => { 
    let exKey = key({}); //Generate key to be used in input
    if (exercises.length < 15) {
      setExercises([...exercises, {id: exKey}]);
    }
  }

  const removeExerciseSlot = () => {
    if (exercises.length > 1) {
      setExercises(exercises.slice(0, -1));
    }
  }

  //Add exercise to the list
  const addExercise = (e, name, index) => {
    e.preventDefault();
    const newExercise = {
      id: exercises[index].id,
      name: name
    }; 
    const newExercises = exercises.map((exercise, i) => {
      if (i === index) {
        return newExercise;
      }
      else {
        return exercise;
      }
    });
    setExercises(newExercises);
  }

  //Remove any empty slots from the exercises array so they aren't posted
  //Also only get the names from the exercise objects, as the id is only used client side
  const prepareForUpload = (exercises) => {
    let arr = [];
    for (let i = 0; i < exercises.length; i++) {
      console.log(exercises[i].name);
      if (exercises[i].name !== undefined) {
        arr.push(exercises[i].name);
      }
    }
    return arr;
  }

  const saveNewWorkout = () => {
    try {
      let fullExercises = prepareForUpload(exercises);
      let info = {
        userID: userID,
        name: newWorkoutName,
        exercises: fullExercises,
      }
      console.log(newWorkoutName);
      axios.post('/addWorkout', info)
      .then(res => {
        setModalOpen(false);
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
    <div className="Workouts">
      <div className="Sidebar">
        <Sidebar workoutsSelected={true}/>
      </div>
      <h1>My Workouts</h1>
      <button className="addWorkoutButton" onClick={addWorkout}>Add Workout</button>
      <Modal isOpen={modalOpen} className="inputModal">

        <div className="leftHalf">
          <h1 className="newWorkoutTitle">New Workout</h1>
          <input 
          type="text" 
          placeholder="Workout Name" 
          required 
          className="workoutNameInput"
          onChange={e => setNewWorkoutName(e.target.value)}/>
        </div>

          <div className="middle">
            <div className="middleHeader">
              <h1 className="exercisesTitle">Exercises</h1>
              <div className="exerciseOptions">
                <button className="addExercise" onClick={addExerciseSlot}>Add Exercise</button>
                <button className="removeExercise" onClick={removeExerciseSlot}>Remove Exercise</button>
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
                onChange={e => addExercise(e, e.target.value, i)}/>
                )
              })}
            </div>
          </div>

          <div className="rightHalf">
            <p className='closeButton' onClick={() => setModalOpen(false)}>+</p>
            <button className="saveButton" onClick={saveNewWorkout}>Save Workout</button>
          </div>

      </Modal>
    </div>
  );
}

export default Workouts;