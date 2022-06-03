import './register.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (password !== confirmedPassword) { //Confirm passwords match
      setPasswordsMatch(false);
    }
    else { //If passwords match, create the new user and add send their info to the back-end
      const newUser = {
        email: email,
        password: password,
      }
      try {
        axios.post('/api/auth/register', newUser)
        .then(response => { 
          console.log(response) 
        })
        .catch(err => { 
          console.log(err.response) 
        });
        navigate('/'); //Send user to home/login page
      }
      catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="register">
      <h1>Register</h1>
      { !passwordsMatch ? <p className="passwordWarning">Passwords do not match</p> : <p></p>}
      <form className="registerForm" onSubmit={handleClick}>
        <input 
        placeholder="Email" 
        type="email" 
        required 
        className="registerInput" 
        onChange={e => setEmail(e.target.value)}/>
        <input 
        placeholder="Password" 
        type="password" 
        required 
        className="registerInput"
        onChange={e => setPassword(e.target.value)}/>
        <input 
        placeholder="Confirm Password" 
        type="password" 
        required 
        className="registerInput"
        onChange={e => setConfirmedPassword(e.target.value)}/>
        <button className="registerButton">Register</button>
      </form>
      <p className="loginText">Already have an account?</p>
      <Link to="/">Login Here</Link>
    </div>
  );
}

export default Register;