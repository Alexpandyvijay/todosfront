import React, {useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function SignUp() {
    const navigate = useNavigate();
    const [userData,setUserData] = useState({
        userId : '',
        password : '',
        confirmPassword : ''
    })
    const [error,setError]=useState({
        confirmError : false,
        userError : false,
        message : ''
    })
    const onSubmitHandler= async (e)=>{
        e.preventDefault();
        if(userData.password===userData.confirmPassword){
            let res = await axios.post('https://todosbackend.onrender.com/signup',{
                'userId' : userData.userId,
                'password' : userData.password
            });
            if(res.data.status==='failed'){
                res.data.message==="user already exist"?
                setError({
                    confirmError : false,
                    userError : true,
                    message : res.data.message
                }):alert('res.data.message');
            }else{
                setError({
                    confirmError : false,
                    userError : false,
                    message : ''
                })
                alert('successfully registered....');
                navigate('/');
            }
        }else{
            setError({
                confirmError : true,
                userError : false,
                message : 'wrong password'
            })
        }
    }
    return(
        <div className="main">
            <h1>Sign Up</h1>
            <form onSubmit={onSubmitHandler}>
                <label>Email ID</label>
                <input type='email' placeholder="Enter mail ID" value={userData.userId} onChange={(e)=>(setUserData({...userData,userId : e.target.value}))}></input>
                {error.userError&&<p>{error.message}</p>}
                <label>password</label>
                <input type='password' onChange={(e)=>(setUserData({...userData,password : e.target.value}))}></input>
                <label>Confirm password</label>
                <input type='password' onChange={(e)=>(setUserData({...userData,confirmPassword : e.target.value}))}></input>
                {error.confirmError && <p>{error.message}</p>}
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    );
}