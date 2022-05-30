//File to store functions shared between components

//Functions shared between New Workout Modal and Edit Workout Modal

const key = require('weak-key');

//Will return exercises with a new exercise slot added
export const addExerciseSlot = (exercises) => { 
  let exKey = key({}); //Generate key to be used in input
  if (exercises.length < 15) {
    return [...exercises, {id: exKey}];
  }
}

//Will return exercises with last exercise slot removed
export const removeExerciseSlot = (exercises) => {
  if (exercises.length > 1) {
    return exercises.slice(0, -1);
  }
}

//Return exercises with a new exercise added
export const addExercise = (e, name, index, exercises) => {
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
  return newExercises;
}

//Given an array of day checks (booleans), return only checked days
export const getCheckedDays = (checkedArr) => {
  let days = [];
  if (checkedArr[0]) { days.push('Sunday'); }
  if (checkedArr[1]) { days.push('Monday'); }
  if (checkedArr[2]) { days.push('Tuesday'); }
  if (checkedArr[3]) { days.push('Wednesday'); }
  if (checkedArr[4]) { days.push('Thursday'); }
  if (checkedArr[5]) { days.push('Friday'); }
  if (checkedArr[6]) { days.push('Saturday'); }
  return days;
}

//Prepare exercises array for upload
export const prepareExercisesForUpload = (exercises) => {
  let arr = [];
  for (let i = 0; i < exercises.length; i++) {
    if (exercises[i].name !== undefined) {
      arr.push(exercises[i]);
    }
  }
  return arr;
}