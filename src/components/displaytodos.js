import React, {useContext, useEffect, useState} from 'react';
import { userContext } from '../App';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './displaytodos.css';
import Timer from './timer';

export default function DisplayTodos(){
    const [user,setUser] = useContext(userContext);
    const [userTodos , setUserTodos]=useState([]);
    const [completed,setCompleted]=useState([]);
    const [dis , setDis] = useState({
        distable : true,
        disinput : false,
    });
    const [trigger,setTrigger]=useState(true);
    const [newTask,setTask]=useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchData= async ()=>{
            let res = await axios.get('https://todosbackend.onrender.com/todos',{
                headers : {
                    'authorization' : user.accessToken
                }
            })
            if(res.data.status==='failed'){
                navigate('/')
            }else{
                if(res.data.message==='no todos'){
                    setDis({...dis,distable : false});
                }else{
                    setUserTodos(res.data.data.todosList);
                    filter(res.data.data.todosList);
                }
            }
        }
        if(trigger){
            fetchData();
            setTrigger(false);
        }
    },[navigate,user.accessToken,trigger,dis])

    const filter=(arr)=>{
        let comArr = [];
        arr.forEach((el)=>{
            if(el.status==='completed'){
                comArr.push(el);
            }
        })
        setCompleted(comArr);
    }

    const newTaskToAdd = async (e)=>{
        e.preventDefault();
        let res = await axios.post('https://todosbackend.onrender.com/addtodos',{
            'activity' : newTask,
            'status' : 'pending',
            'timeTaken' : '0'
        },{
            headers : {
                'authorization' : user.accessToken
            }
        })
        if(res.data.status==='failed'){
            res.data.message==='unauthorized'?navigate('/'):alert('try again')
        }else{
            setDis({...dis,disinput : false});
            setTrigger(true);
        }

    }
    const logoutHandler = ()=>{
        setUser({
            userId : '',
            accessToken : ''
        })
        navigate('/');
    }
    const deleteHandler= async (id)=>{
        let res = await axios.delete(`https://todosbackend.onrender.com/delete/${id}`,{
            headers : {
                'authorization' : user.accessToken
            }
        })
        if(res.data.status==='failed'){
            res.data.message==='unauthorized'?navigate('/'):alert('try again')
        }else{
            setTrigger(true);
        }
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
                    <ul className='history'>
                        {completed.map((val,key)=>{
                            return <li key={key}>{val.activity}</li>
                        })}
                    </ul>
                    <button onClick={logoutHandler}>Logout</button>
                </div>
                <div className='table'>
                    <div className='Add'>
                        {dis.disinput && <><input placeholder='Type.....' onChange={(e)=>{setTask(e.target.value)}}></input>
                        <button onClick={newTaskToAdd}>Add</button><button onClick={()=>(setDis({...dis,disinput:false}))}>Cancel</button></>}
                        {!dis.disinput && <button onClick={()=>(setDis({...dis,disinput : true}))}>Add activity</button>}
                    </div>
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
                            {dis.distable && userTodos.map((value,key)=>{
                                return (<tr key={key}>
                                <td>{value.activity}</td>
                                <td>{value.status}</td>
                                <td>{value.timeTaken}</td>
                                <td>{value.timeTaken==="0"?<Timer obj={value} token={user.accessToken} setTrigger={setTrigger}/>:
                                <button id='delete' onClick={()=>(deleteHandler(value._id))}>Delete</button>}</td>
                                </tr>);
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}