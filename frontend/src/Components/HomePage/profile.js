import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'
import { useNavigate } from 'react-router-dom';
function ExampleComponent() {
    
    const navigate = useNavigate();
    const [user, setUserData] = useState({email:null,name:null});

    useEffect(async () => {
        const token = localStorage.getItem("token")
        const response = await axios.post('http://localhost:9000/authenticate', token)
        .then(result => {
            if(result.status != 200) {
                navigate("/signup")
            }
        })
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching data with:", user);
                const response = await axios.get('http://localhost:9000/profile')
                .then(result => {
                    console.log(result.data); // Log the response data
                    const newUser = {email:result.data.email, name:result.data.username}
                    setUserData(newUser);
                    
                })
                .catch(err => console.log(err));
                // console.log("Response:", response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        try {
            if (user) {
                fetchData();
                
                
            }
        } catch (error) {
            
            console.error('Error in useEffect:', error);
        }
    }, []);
    

    return (
        <div>
            <h1>Example Component</h1>
            {user ? (
                <div>
                    <h2>User Information:</h2>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.name}</p>
                    {/* <p>Username: {user.username}</p> */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ExampleComponent;
