import './login.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const credentials = {
        email: email,
        password: password,
      }
      //Make login request to the server, and use the userID it sends back to authenticate the user
      axios.post('/auth/login', credentials)
      .then(res => {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      })
      .catch(err => { 
        console.log(err) 
        dispatch({ type: "LOGIN_FAILURE", payload: err });
      });
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form className="loginForm" onSubmit={handleLogin}>
        <input 
        placeholder="Email" 
        type="email" 
        required 
        className="loginInput" 
        onChange={e => setEmail(e.target.value)}/>
        <input 
        placeholder="Password" 
        type="password" 
        required 
        className="loginInput"
        onChange={e => setPassword(e.target.value)}/>
        <button className="loginButton">Login</button>
      </form>
      <p className="registerText">Don't have an account?</p>
      <Link to="/register">Sign Up Here</Link>
    </div>
  );
}

export default Login;