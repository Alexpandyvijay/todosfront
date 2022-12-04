import React ,{useState,useEffect} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Timer(props){
    const [count,setCount]=useState(0);
    const navigate = useNavigate();
    const [isActive,setIsActive]=useState(false);
    const [disBtn,setDisBtn]=useState({
        start : true,
        pause : false,
        resume : false
    })
    useEffect(()=>{
        let timer;
        if(isActive){
            timer = setInterval(()=>{setCount((count)=>count+1)},1000)
        }else{
            clearInterval(timer);
        }
        return ()=>{
            clearInterval(timer);
        }
    },[isActive])
    const startHandler=()=>{
        let starting = {
            start : false,
            pause : true,
        }
        setIsActive(true);
        setDisBtn({...disBtn,...starting})
    }
    const pauseHandler=()=>{
        let pausing = {
            resume : true,
            pause : false
        }
        setIsActive(false);
        setDisBtn({...disBtn,...pausing})
    }
    const resumeHandler=()=>{
        let resuming = {
            resume : false,
            pause : true
        }
        setIsActive(true);
        setDisBtn({...disBtn,...resuming})
    }
    const endHandler=async ()=>{
        console.log(props.obj._id);
        let res = await axios.put(`https://todosbackend.onrender.com/updatetodos/${props.obj._id}`,{
            "status" : "completed",
            "timeTaken" : `0${Math.floor(count/60) % 60}`.slice(-2)+':'+`0${(count% 60)}`.slice(-2)
        },{
            headers : {
                'authorization' : props.token
            }
        })
        console.log(res);
        if(res.data.status === 'failed'){
            res.data.message==='unauthorized'?navigate('/'):console.log(res.data.message);
        }else{
            setIsActive(false)
            setCount(0);
            props.setTrigger(true);
        }
    }
    return(
        <div className="timer">
        {disBtn.start && <button id='start' onClick={startHandler}>start</button>}
        {disBtn.pause && <><span>{`0${Math.floor(count/60) % 60}`.slice(-2)+':'+`0${(count% 60)}`.slice(-2)}</span><button id='end' onClick={endHandler}>end</button><button id='pause' onClick={pauseHandler}>pause</button></>}
        {disBtn.resume && <><span>{`0${Math.floor(count/60) % 60}`.slice(-2)+':'+`0${(count% 60)}`.slice(-2)}</span><button id='resume' onClick={resumeHandler}>resume</button></>}
        </div>
    )
}