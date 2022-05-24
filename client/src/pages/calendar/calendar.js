import './calendar.css';
import Sidebar from '../../components/sidebar/sidebar';
import CalendarView from '../../components/calendarview/calendarview';

function Calendar() {
  return (
    <div className="Calendar">
      <div className="Sidebar">
        <Sidebar calendarSelected={true}/>
      </div>
      <div className="CalendarDisplay">
        <CalendarView />
      </div>
    </div>
  );
}

export default Calendar;