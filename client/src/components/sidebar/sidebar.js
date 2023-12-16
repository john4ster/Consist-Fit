import './sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Sidebar({ homeSelected, workoutsSelected, calendarSelected }) {
  
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch({ type: "LOGOUT" });
      navigate('/');
    }
  } 

  return (
    <div className="Sidebar">
      <div className="navIcons">
        <Link to="/" style={ homeSelected ? { color: "#F0E9DC" } : { color: "black" } }>
          <HomeIcon className="icon" fontSize="large" />
        </Link>
        <Link to="/workouts" style={workoutsSelected ? { color: "#F0E9DC" } : { color: "black" }}>
          <FitnessCenterIcon className="icon" fontSize="large" />
        </Link>
        <Link to="/calendar" style={calendarSelected ? { color: "#F0E9DC" } : { color: "black" }}>
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