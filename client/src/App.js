import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/register/register';
import Login from './pages/login/login';
import Home from './pages/home/home';
import Workouts from './pages/workouts/workouts';
import Calendar from './pages/calendar/calendar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const { userID } = useContext(AuthContext);

  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={userID ? <Home /> : <Login />} />
            <Route path="/register" element={userID ? <Home /> : <Register />} />
            <Route path="/workouts" element={ <Workouts /> } />
            <Route path="/calendar" element={ <Calendar /> } />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
