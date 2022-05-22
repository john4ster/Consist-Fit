import './sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Sidebar({ homeSelected, workoutsSelected, calendarSelected }) {
  
  const { dispatch } = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
  } 

  return (
    <div className="Sidebar">
      <div className="navIcons">
        <Link to="/" style={ homeSelected ? { color: "#3fadd8" } : { color: "black" } }>
          <HomeIcon selectedIconclassName="icon" fontSize="large" />
        </Link>
        <Link to="/workouts" style={workoutsSelected ? { color: "#3fadd8" } : { color: "black" }}>
          <FitnessCenterIcon className="icon" fontSize="large" />
        </Link>
        <Link to="/calendar" style={calendarSelected ? { color: "#3fadd8" } : { color: "black" }}>
          <EventAvailableIcon className="icon" fontSize="large" />
        </Link>
      </div>
      <div className="logoutIcon">
        <LogoutIcon onClick={e => handleLogout(e)} className="icon" fontSize="large" />
      </div>
    </div>
  );
}

export default Sidebar;