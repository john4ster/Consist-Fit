import './workouts.css';
import Sidebar from '../../components/sidebar/sidebar';

function Workouts() {
  return (
    <div className="Workouts">
      <div className="Sidebar">
        <Sidebar workoutsSelected={true}/>
      </div>
      <h1>Workouts Coming Soon</h1>
    </div>
  );
}

export default Workouts;