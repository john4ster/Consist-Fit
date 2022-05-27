import './workoutCard.css';

function WorkoutCard({ workout }) {



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
      </div>
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