import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login'
import Homepage from './Components/HomePage/PaddyDetector.jsx'
import About from './Components/HomePage/About.jsx';

function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path='/about' element={<About/>}></Route>
        {/* <Route path='/' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route> */}
        <Route path='/' element={<Homepage/>}></Route>
        {/* <Route path='/profile' element={<Profile/>}></Route> */}
      </Routes>
  
    </BrowserRouter>
  );
}

export default App;
