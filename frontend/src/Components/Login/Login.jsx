import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:9000/login`, { email, password })
            .then(result => {
                console.log(result.data); // Log the response data
                if (result.data === "Success") {
                    setShowToast(true);
                    // localStorage.setItem('token', result.data.token)
                    setTimeout(() => {
                        setShowToast(false);
                        navigate('/home');
                    }, 1000);
                } else {
                    setErrorMessage('Invalid email or password. Please try again.');
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='container'>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder='Email id' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {errorMessage && <div className="error-message" >{errorMessage}</div>}
                </div>
                <button type="submit" className="submit">Login</button>
                
                
            </form>
            <p className='link'>Don't have an account? <Link to="/">Sign Up</Link> </p>
            {showToast && (
                <div className='toast'>
                    Login successful!!
                </div>
            )}
        </div>
    );
}

export default Login;
