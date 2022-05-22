import './calendar.css';
import Sidebar from '../../components/sidebar/sidebar';

function Calendar() {
  return (
    <div className="Calendar">
      <div className="Sidebar">
        <Sidebar calendarSelected={true}/>
      </div>
      <h1>Calendar Coming Soon</h1>
    </div>
  );
}

export default Calendar;