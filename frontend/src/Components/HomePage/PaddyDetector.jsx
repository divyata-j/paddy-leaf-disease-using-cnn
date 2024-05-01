import React, { useState } from 'react';
import './PaddyDetector.css'; 
import './Header.css'
import Alert from './Alert';
import axios from 'axios';
import oops from '../Assets/wrong logo.png'
import { useNavigate,Link} from 'react-router-dom';
function Header() {
  const navigate = useNavigate();

  return (
    <div className="headerapp">
      {/* <div className="header-content"> */}
        <nav className="nav">
          <h4 className='header-title'>PaddyCare</h4>
          {/* <div className="nav-items"> */}
            <Link to="/" className="nav-link">Home</Link>
            <span className="nav-space"></span>
            <Link to="/about" className="nav-link">About</Link>
            {/* <span className="nav-space"></span> */}
            
          {/* </div> */}
        </nav>
      </div>
    // </div>
  );
}

function PaddyDetector() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [imageSrc,setImageSrc] = useState(null)
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
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
    setIsLoading(true);
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
      handleError('Oops, not a paddy leaf image.', oops); 
      setPrediction(null);
      setAdditionalInfo(null);
     } finally{
       setIsLoading(false);
     }
     setShowPrediction(true);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    document.getElementById('file-input').value = '';
    setPrediction(null);
    setAdditionalInfo(null);
    setShowPrediction(false);
    
  };

  const handleError = (errorMessage, imageSrc=oops) => {  
    setShowPrediction(false);
    setAlertMessage(errorMessage);
    setShowAlert(true);
    setImageSrc(imageSrc);
  };

  return (
    <div className="headermain">
      <Header/>
      {isLoading && (
              <div className="loader"> Loading...
                <div className="loader-spinner"></div>
              </div>
            )}
      <div className="background-image">
      {showPrediction && ( 
      <div className='pred-container'>
            {prediction && !isLoading && <p>Classification: {prediction}</p>}
            {additionalInfo && (
            <p>
              Treatment: <br/>
              {additionalInfo.split('\n').map((line, index) => (
                <span key={index}>{line}<br/></span>
              ))}
            </p>
          )}
          </div>
      )}
      </div>
      
      <div className="file-upload-container">
        <h2>Upload an Image</h2>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept="image/*" 
        />
        {showAlert && (
          <div className="modal-container">
            <div className="modal-background" onClick={() => setShowAlert(false)} />
            <div className="alert-wrapper">
              <Alert
                message={alertMessage}
                onClose={() => setShowAlert(false)}
                imageSrc={imageSrc} 
              />
            </div>
          </div>
        )}

        {previewURL && (
          <div>
            <h3>Selected Image:</h3>
            <img src={previewURL} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
          
        )}
  
        {selectedFile && (
          <div className="button-container">
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            <button className="reset-button" onClick={handleReset}>Reset</button>
          </div>
          
        )}
      </div>
      
    </div>
  );
}

export default PaddyDetector;