import './forgotPassword.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const sendResetEmail = (e) => {
    e.preventDefault();
    const resetInfo = {
      email: email
    }
    axios.post('/api/auth/sendResetEmail', resetInfo)
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        window.alert("Reset email sent, check your inbox for a link to reset your password");
      }
      else {
        window.alert("Error sending reset email");
      }
    })
    .catch(err => { 
      console.log(err);
    });
  }

  return (
    <div className="forgotPassword">
      <div className="forgotPasswordPanel">
        <h1>Reset Password</h1>
        <p>Enter your email and we'll send you a link to reset your password</p>
        <form className="forgotPasswordForm" onSubmit={sendResetEmail}>
          <input 
          placeholder="Email" 
          type="email" 
          required 
          className="forgotPasswordInput" 
          onChange={e => setEmail(e.target.value)}/>
          <button className="forgotPasswordButton">Reset Password</button>
        </form>
        <Link to="/">Back to Login</Link>
      </div>
  </div>
  );
}

export default ForgotPassword;