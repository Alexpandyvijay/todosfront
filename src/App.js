import SignIn from './components/signin.js';
import SignUp from './components/signup.js';
import DisplayTodos from './components/displaytodos.js';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, { createContext, useState } from 'react';
const userContext = createContext([]);
function App() {
  const [user , setUser] = useState({
    userId : '',
    accessToken : ''
  })
  return (
    <div className="App">
      <Router>
        <userContext.Provider value={[user,setUser]}>
        <Routes>
          <Route path='/' element={<SignIn/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/displaytodos' element={<DisplayTodos/>}></Route>
        </Routes>
        </userContext.Provider>
      </Router>
    </div>
  );
}

export default App;
export {userContext};
