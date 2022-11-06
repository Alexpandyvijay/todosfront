import React, {useContext, useEffect, useState} from 'react';
import { userContext } from '../App';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import './displaytodos.css';

export default function DisplayTodos(){
    const [user,setUser] = useContext(userContext);
    const [userTodos , setUserTodos]=useState([]);
    const [display , setDisplay] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchData= async ()=>{
            console.log(user.accessToken);
            let res = await axios.get('http://localhost:5000/todos',{
                headers : {
                    'authorization' : user.accessToken
                }
            })
            if(res.data.status==='failed'){
                navigate('/')
            }else{
                if(res.data.message==='no todos'){
                    setDisplay(false);
                }else{
                    setUserTodos(res.data.data.todosList);
                }
            }
        }
        fetchData();
    },[navigate,user.accessToken])
    const logoutHandler = ()=>{
        setUser({
            userId : '',
            accessToken : ''
        })
        navigate('/');
    }
    return(
        <div className='display'>
            <header>
                <h1>ToDo</h1>
                <h1>{user.userId.split('@')[0]}</h1>
            </header>
            <section>
                <div className='side-bar'>
                    <h3>History</h3>
                    <div className='history'>

                    </div>
                    <button onClick={logoutHandler}>Logout</button>
                </div>
                <div className='table'>
                    <button>Add activity</button>
                    <table>
                        <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Status</th>
                            <th>Time Taken</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {display && userTodos.map((value,key)=>{
                                return (<tr key={key}>
                                <td>{value.activity}</td>
                                <td>{value.status}</td>
                                <td>{value.timeTaken}</td>
                                </tr>);
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}