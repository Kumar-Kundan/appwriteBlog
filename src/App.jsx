import './App.css';
import { useState, useEffect } from 'react';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import {Header, Footer} from './components';
import {Outlet} from 'react-router-dom';
import {useDispatch} from 'react-redux';

function App() {
  const [loading,setLoading]=useState(true);
  const dispatch=useDispatch();

  //loads in first render of app component
  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData){
        dispatch(login({userData}))  //set as login
      }else{
        dispatch(logout())  //stay at logout
      }
    })
    .finally(()=> setLoading(false))
  },[]);

  //when not loading
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
        TODO:  <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) 
  : null
}

export default App;
