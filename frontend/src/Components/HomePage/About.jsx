import React from 'react';
import './About.css'
import { Link, useNavigate } from 'react-router-dom';
function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here if needed
    // For example, clearing session storage, etc.

    // Redirect to the main page
    navigate('/');
  };

  return (
    <div className="headerapp">
      <div className="header-content">
        <nav className="nav">
          <div className="nav-items">
            <Link to="/" className="nav-link">Home</Link>
            <span className="nav-space"></span>
            <Link to="/about" className="nav-link">About</Link>
            <span className="nav-space"></span>
            
          </div>
        </nav>
      </div>
    </div>
  );
}
function About() {
  return (
    <div className='aboutpage'>
      <Header />
      <div className=''>
      <h1 className="t-color" >About</h1>
      
      <p className="t-color">
        Welcome to the "Recognition and Classification of Paddy Leaf Disease" project! This project aims to
        develop a system that can accurately recognize and classify diseases in paddy leaves using machine learning
        and image processing techniques.
      </p>
      <p className="t-color">
        The system will analyze images of paddy leaves to identify various types of diseases such as blast, sheath
        blight, and brown spot. It will provide insights to farmers, helping them take appropriate measures to
        protect their crops and improve yield.
      </p>
      <p className="t-color">
        Our team is dedicated to creating an efficient and reliable solution that contributes to the advancement
        of agriculture and supports farmers in their efforts to ensure food security.
      </p>
      </div>
    </div>
  );
}

export default About;
