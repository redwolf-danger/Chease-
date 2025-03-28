import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LogInPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import VideoCallPage from './pages/VideoCallPage.jsx'
import {Toaster} from "react-hot-toast";
import { useAuthStore } from './store/useAuthStore.js'
import {Loader } from "lucide-react"
import { useThemeStore } from './store/useThemeStore.js'
// import { useVideoStore } from './store/useVideoStore.js'



const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme,setTheme} = useThemeStore();
  // const {loadScript} = useVideoStore();
  useEffect(()=>{
    setTheme(theme);
    // loadScript();
  },[]);
 

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  console.log("online users = ",onlineUsers);

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )


  return (
    <div>
      <Navbar/>
      <Toaster/>
      <Routes>
        <Route path = "/" element = {authUser ? <HomePage/> : <Navigate to = "/login"/> }/>
        <Route path = "/signup" element = {!authUser ? <SignUpPage/> : <Navigate to="/" /> }/>
        <Route path = "/login" element = {!authUser ? <LogInPage/> :  <Navigate to="/" />  } />
        <Route path = "/settings" element = {<SettingsPage/>} />
        <Route path = "/profile" element = {authUser ? <ProfilePage/> : <Navigate to = "/login"/>} />
        <Route path = "/videocall" element = {authUser ? <VideoCallPage/> : <Navigate to = "/login"/>}/>
      </Routes>
      
       
    </div>
  )
}

export default App
