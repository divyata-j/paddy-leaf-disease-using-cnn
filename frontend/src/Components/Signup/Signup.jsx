import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './Signup.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { useNavigate } from 'react-router-dom'

function Signup() {
    
    const[username,setName]=useState();
    const[email,setEmail]=useState();
    const[password,setPassword]=useState();
    const navigate=useNavigate();

    const handleSubmit = (e)=>{
       
        e.preventDefault()
        axios.post(`http://localhost:9000/signup`,{username,email,password})
        .then(result=> {console.log(result)
        navigate('/login')
        })
        .catch(err=>console.log(err))
        
    }
  return (
    <div className='container'>
        <div className="header">
            <div className="text">Sign Up</div>
            <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit} >
            <div className="inputs">
                <div className="input">
                <img src={user_icon} alt=""/>
                <input type="text" placeholder='Name' onChange={(e)=>setName(e.target.value)} required/>
                </div>

                <div className="input">
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder='Email id' onChange={(e)=>setEmail(e.target.value)} required/>
                </div>

                <div className="input">
                    <img src={password_icon} alt=""/>
                    <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required/>
                </div>
            </div>
            <button type="submit" className="submit" >Sign Up</button>
            </form>
            <p className='link'>Already have an account? <Link to="/login" >Login</Link> </p>
           
    </div>
  )
};

export default Signup