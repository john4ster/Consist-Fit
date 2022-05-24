import './weeklyview.css';
import WeeklyDay from '../weeklyday/weeklyday';

function WeeklyView({ today, checkedDates }) {
  
  //Get the first day of the week using today's date
  const getSunday = (date) => {
    const day = date.getDay();  
    if(day !== 0) {
      date.setHours(-24 * (day)); 
    }
    return date;
  }

  //See if a date is checked off
  function dateChecked(date) {
    const noTimeDate = date.setHours(0, 0, 0, 0); //Get date without time for comparison
    if (checkedDates.includes(noTimeDate)) {
      return true;
    }
    return false;
  }

  //Get the first day of the week, and week of string
  const sundayDate = getSunday(today);
  const weekOfString = sundayDate.toDateString().substring(3);
  //Calculate the rest of the days
  const day = 60 * 60 * 24 * 1000;
  const mondayDate = new Date(sundayDate.getTime() + day);
  const tuesdayDate = new Date(sundayDate.getTime() + (2 * day));
  const wednesdayDate = new Date(sundayDate.getTime() + (3 * day));
  const thursdayDate = new Date(sundayDate.getTime() + (4 * day));
  const fridayDate = new Date(sundayDate.getTime() + (5 * day));
  const saturdayDate = new Date(sundayDate.getTime() + (6 * day));
  //See which dates are checked
  let suChecked = dateChecked(sundayDate);
  let moChecked = dateChecked(mondayDate);
  let tuChecked = dateChecked(tuesdayDate);
  let weChecked = dateChecked(wednesdayDate);
  let thChecked = dateChecked(thursdayDate);
  let frChecked = dateChecked(fridayDate);
  let saChecked = dateChecked(saturdayDate);

  return (
    <div className="WeeklyView">
      <h1 className="WeeklyTitle">Week of { weekOfString }</h1>
      <div className="WeeklyDays">
        <WeeklyDay day="Sunday" date={ sundayDate.toDateString().slice(3, -4) } workoutCompleted={suChecked}/>
        <WeeklyDay day="Monday" date={ mondayDate.toDateString().slice(3, -4) } workoutCompleted={moChecked}/>
        <WeeklyDay day="Tuesday" date={ tuesdayDate.toDateString().slice(3, -4) } workoutCompleted={tuChecked}/>
        <WeeklyDay day="Wednesday" date={ wednesdayDate.toDateString().slice(3, -4) } workoutCompleted={weChecked}/>
        <WeeklyDay day="Thursday" date={ thursdayDate.toDateString().slice(3, -4) } workoutCompleted={thChecked}/>
        <WeeklyDay day="Friday" date={ fridayDate.toDateString().slice(3, -4) } workoutCompleted={frChecked}/>
        <WeeklyDay day="Saturday" date={ saturdayDate.toDateString().slice(3, -4) } workoutCompleted={saChecked}/>
      </div>
    </div>
  );
}

export default WeeklyView;