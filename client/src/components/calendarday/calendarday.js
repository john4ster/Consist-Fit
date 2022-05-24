import './calendarday.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function CalendarDay({ date, checked}) {

  const day = date.getDate();

  return (
    <div className="CalendarDay" style={checked ? {background: "#0e8610" } : {background: "white" }}>
      <p className="dayNum">{day}</p>
      <div className="dayStatus">
        <div className="bubble">
          {checked
          ? <CheckCircleIcon className="filledCheckBubble" fontSize="medium" /> 
          : <RadioButtonUncheckedIcon className="emptyCheckBubble" fontSize="medium" />}
        </div>
      </div>
    </div>
  );
}

export default CalendarDay;