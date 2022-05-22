import './weeklyday.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function WeeklyDay({ day, date, workoutCompleted }) {

  return (
    <div className="WeeklyDay">
      <div className="dayDate">
        <h2 className="day">{day}</h2>
        <p className="date">{date}</p>
      </div>
      <div className="status">
        {workoutCompleted 
        ? <CheckCircleIcon className="filledCheckBubble" fontSize="large" /> 
        : <RadioButtonUncheckedIcon className="emptyCheckBubble" fontSize="large" />}
      </div>
    </div>
  );
}

export default WeeklyDay;