import React, {useContext, useState } from "react";
import axios from 'axios';
import {Link,useNavigate} from 'react-router-dom';
import {userContext} from '../App.js';

export default function SignIn() {
    const [,setUser] = useContext(userContext);
    const navigate = useNavigate();
    const [userData,setUserData] = useState({
        userId : '',
        password : ''
    });
    const [error,setError]=useState({
        statePass : false,
        stateUser : false,
        message : ''
    })
    const handleOnSubmit=async(e)=>{
        e.preventDefault();
        let res = await axios.post('http://localhost:5000/',userData);
        if(res.data.status==='failed'){
            res.data.message==="Invalid userName"?
            setError({
                statePass : false,
                stateUser : true,
                message : res.data.message
            }):setError({
                statePass : true,
                stateUser : false,
                message : res.data.message
            });
        }else{
            setUser({userId : userData.userId, accessToken : res.data.token});
            navigate('/displaytodos');
        }
    }
    return(
        <div className="main">
            <h1>Sign In</h1>
            <form onSubmit={handleOnSubmit}>
                <label>Email ID</label>
                <input type='email' placeholder="Enter mail ID" value={userData.userId} onChange={(e)=>(setUserData({...userData,userId : e.target.value}))}></input>
                {error.stateUser && <p>{error.message}</p>}
                <label>password</label>
                <input type='password' onChange={(e)=>(setUserData({...userData,password : e.target.value}))}></input>
                {error.statePass && <p>{error.message}</p>}
                <button type='submit'>Sign In</button>
            </form>
            <p>Don't have an account?</p><span><Link to='/signup'>Sign Up</Link></span>
        </div>
    );
}