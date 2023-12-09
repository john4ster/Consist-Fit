import './resetPassword.css';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {

  const { id, token } = useParams(); //Get params from URL 

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  //Send the new password to the back-end for reset
  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      window.alert("Passwords do not match");
    }

    axios.post(`/api/auth/resetPassword/${id}/${token}`, {newPassword: newPassword})
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        const userConfirmed = window.confirm("Password successfully changed! Click OK to return to the login page");
        if (userConfirmed) {
          navigate('/');
        }
      }
      else {
        window.alert("Error resetting password");
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="resetPassword">
      <div className="resetPanel">
        <h1>Reset Password</h1>
        <p>Enter your new password</p>
        <form className="resetForm" onSubmit={handleReset}>
          <input 
          placeholder="Email" 
          type="email" 
          required 
          className="resetInput" 
          onChange={e => setEmail(e.target.value)}
          autoComplete="off"/>
          <input 
          placeholder="New Password" 
          type="password" 
          required 
          className="resetInput"
          onChange={e => setNewPassword(e.target.value)}
          autoComplete="off"/>
          <input 
          placeholder="Confirm New Password" 
          type="password" 
          required 
          className="resetInput"
          onChange={e => setConfirmNewPassword(e.target.value)}
          autoComplete="off"/>
          <button className="resetButton">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default Login;