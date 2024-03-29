import React, { useState } from 'react';
import './PaddyDetector.css'; 
import './Header.css'
import axios from 'axios';
import { useNavigate,Link} from 'react-router-dom';
function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="headerapp">
      <div className="header-content">
        <nav className="nav">
          <div className="nav-items">
            <Link to="/home" className="nav-link">Home</Link>
            <span className="nav-space"></span>
            <Link to="/about" className="nav-link">About</Link>
            <span className="nav-space"></span>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span className="nav-space"></span>
            <Link to="/" className="nav-link" onClick={handleLogout}>Logout</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

function PaddyDetector() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  };

  const handleSubmit = async() => {
    const formdata=new FormData()
    formdata.append('image',selectedFile)
    try{
    // await axios.post(`http://localhost:9000/upload`,formdata)
    const predictResponse= await axios.post(`http://localhost:5000/detect-leaf`,formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Prediction response:", predictResponse.data); 
    setPrediction(predictResponse.data.predicted_class);
    setAdditionalInfo(predictResponse.data.additional_info);
  } catch (error) {
    console.error('Error:', error);
  }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    document.getElementById('file-input').value = '';
    setPrediction(null);
    setAdditionalInfo(null);
  };

  return (
    <div className="file-upload-container">
      <div className="background-image"></div>
      <div className="content">
        <h2>Upload a File</h2>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept="image/*" 
        />
        {previewURL && (
          <div>
            <h3>Selected Image:</h3>
            <img src={previewURL} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
        )}
        {selectedFile && (
          <div className="button-container">
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            {prediction && <p>Prediction: {prediction}</p>}
            {additionalInfo && <p>Treatment {additionalInfo}</p>}
            <button className="reset-button" onClick={handleReset}>Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaddyDetector;
