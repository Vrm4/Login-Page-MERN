import './App.css';
import React, { useEffect } from 'react';
import { ThemeContext } from './context/theme-context';
import LoginPage from './components/Login_page';
import { BrowserRouter , Routes , Route } from "react-router-dom";
import Register from './components/Register';
import axios from 'axios';
import Profile from './components/Profile';


const  backEndUrl = 'http://localhost:2000/'

function App() {
  const [themesMode, setThemes] = React.useState('dark')
  
  //--- COOKIE SETTINGS (CREATE,CHECK,DELETE,GET) ---//
  function createCookie(name, pass , mail ,DateToLive){
    let date = new Date()
    date.setMonth(date.getMonth() + DateToLive)
    document.cookie = `userName=${name}; expires=${date.toString()}; path=/`
    document.cookie = `password=${pass}; expires=${date.toString()}' path=/`
    document.cookie = `userMail=${mail}; expires=${date.toString()}; path=/`
  } 

  function checkCookie(cookieName){
    const query = document.cookie.split('; ')
    .some(item => item.trim().startsWith(`${cookieName}=`))
    return query
  }
  function deleteCookie(){
    document.cookie = `userName=; expires = Thu, 01 Jan 1970 00:00:00 GTM; path=/`
    document.cookie = `password=; expires = Thu, 01 Jan 1970 00:00:00 GTM; path=/`
    document.cookie = `userMail=; expires = Thu, 01 Jan 1970 00:00:00 GTM; path=/`
  }
  function getValueOfCookie(value){
    const cookies = document.cookie.split(';')
    .find( item => item.trim().startsWith(`${value}=`))
    ?.split('=')[1]   
    return cookies 
  }

  useEffect(()=>{
    // If themesMode changes, the class name will change
    document.body.className = themesMode
  },[themesMode])
  
  return (
    <BrowserRouter>
    
    <ThemeContext.Provider value={{setThemes,themesMode,backEndUrl,createCookie,checkCookie,deleteCookie,getValueOfCookie}}>
    <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<Register />} />  
    <Route path="/profile" element={<Profile />} />  
    </Routes>
    </ThemeContext.Provider>
    
    </BrowserRouter>
  );
}

export default App;
