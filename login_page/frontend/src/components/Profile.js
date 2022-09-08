import React, { useEffect } from 'react'
import {Link ,useNavigate } from "react-router-dom";
import { ThemeContext } from '../context/theme-context'
import { faSun , faMoon , faEye , faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import Alert from './alert/Alert';
export default function Profile() {
  // Context Values
  const {setThemes,themesMode ,backEndUrl,deleteCookie ,checkCookie,getValueOfCookie,createCookie} = React.useContext(ThemeContext)
  const [settings , setSettings] = React.useState(false)
  const [showPass, setShowPass] = React.useState(false)
  //Values ​​from sessions 
  const [valueOfUsername , setUserNameValue] = React.useState(getValueOfCookie('userName'))
  const [valueOfUsermail , setUserMailValue] = React.useState(getValueOfCookie('userMail'))
  const [valueOfPass , setPassValue] = React.useState(getValueOfCookie('password'))
  // Alert Settings
  const [alertStatus , setAlertStatus] = React.useState({
    color : '',
    text : ''
  })
  const [alert , setAlert] = React.useState(false)
  //Refs
  const passInputRef = React.useRef(null)
  const updateInputsRef = React.useRef(null)
  // set Dark Theme
  const on_click = () => setThemes(themesMode === 'dark' ? 'light' : 'dark' )

  function checkSettingsStatus(){
    settings ? setSettings(false) : setSettings(true)
  }
  function show_pass(){
    showPass ? setShowPass(false) : setShowPass(true)
  }
  //--- UPDATE OPERATIONS ---//
  const onSubmitUpdate = (event) =>{
    event.preventDefault()
    const updateData = { 
      userName : event.target[0].value,
      userMail : event.target[1].value,
      pass : event.target[2].value,
      oldUserName : getValueOfCookie('userName'),
      oldUserMail : getValueOfCookie('userMail'),
      oldPass : getValueOfCookie('password')
    }

    axios.put(`${backEndUrl}update`,updateData)
    .then((e)=>{
      if(e.status === 201){
        setAlert(true)
        setAlertStatus({
          color : '#3D8361',
          text : 'User Name Updated!'
        })
      }
      if(e.status === 202){
        setAlert(true)
        setAlertStatus({
          color : '#3D8361',
          text : 'E-mail Updated!'
        })
      }
      if(e.status === 204){
        setAlert(true)
        setAlertStatus({
          color : '#3D8361',
          text : 'Password Updated!'
        })
      }
      if(e.status === 206){
        setAlert(true)
        setAlertStatus({
          color : '#3D8361',
          text : 'Updated!'
        })
      }
      setTimeout(() => {
        deleteCookie()
        createCookie(updateData.userName,updateData.pass,updateData.userMail,1)
        window.location.reload()       
      }, 2500);

    })
    .catch((e)=>{
      console.log(e)
      if(e.response.status === 400){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'There Is A Not Different Value'
        })
      }
      if(e.response.status === 405){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'The User Name Is Not Availability'
        })
      }
      if(e.response.status === 406){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'The E-Mail Is Not Availability'
        })
      }
      if(e.response.status === 500){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'The E-Mail And User Name Are Not Availability'
        })
      }
      if(e.response.status === 501){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'There Is A Problem, Please Try Again Later'
        })
      }
    })
  }

  let navigate = useNavigate();
  useEffect(() =>{
    // if the user does not logged in, redirect to login page
    function checkUserSituation(){
      if(!checkCookie('userName') && (window.location.href != '/login' || window.location.href != '/register')){
        return navigate('/')
      }
    }
    checkUserSituation()
  },[])

  useEffect(() =>{
    if(showPass){
      passInputRef.current.type = 'text'
    }else{
      passInputRef.current.type = 'password'
    }
  },[showPass])
  useEffect(() =>{
    if(settings){
      updateInputsRef.current.style.display = 'block'
    }else{
      updateInputsRef.current.style.display = 'none'
    }
  },[settings])

  function logout(){
    deleteCookie()
    setAlert(true)
    setAlertStatus({
      color : '#FECD70',
      text : 'Logged Out, You Redirecting'
    })
    setTimeout(() => {
      window.location.reload()
    }, 4000);
  }

  function changeUserNameValue(event){
    setUserNameValue(event.target.value)
  }

  function changeUserMailValue(event){
    setUserMailValue(event.target.value)
  }

  function changePassValue(event){
    setPassValue(event.target.value)
  }
  
  return (
    <div id='profile-wrapper'>
     {alert && <Alert  name={alertStatus.text} color={alertStatus.color}/>}
      <div className='ProfileCart'>
      <div id='loginPageIcons'>
      {
        themesMode === 'dark' ? 
        <FontAwesomeIcon icon={faSun} color={'yellow'} onClick={on_click} /> :  
        <FontAwesomeIcon icon={faMoon} color={'white'} onClick={on_click} />
      }
          </div>
        <h1 id='userNameTitle'>{valueOfUsername}</h1>
        <p id='mail-text'>{valueOfUsermail}</p>
        <div id='button-wrapper'>
        <button className='buttons' onClick={checkSettingsStatus}>
          Settings
        </button>
        <button onClick={logout} className='buttons'>
          Logout
        </button>
        </div>
        <div id='updateInputs' ref={updateInputsRef}>
          <form onSubmit={onSubmitUpdate}>
          <label>User Name</label><br></br>
          <input 
          type='text' 
          id='userName' 
          value={valueOfUsername}
          onChange={changeUserNameValue}
          required
          /><br></br>
          <label>E-Mail</label><br></br>
          <input 
          type='mail' 
          value={valueOfUsermail} 
          onChange={changeUserMailValue}
          required
          /><br></br>
          <label>Pass</label> {showPass ? <FontAwesomeIcon icon={faEye} color={'white'} onClick={show_pass} /> : <FontAwesomeIcon icon={faEyeSlash} color={'white'} onClick={show_pass} />} <br></br>
          <input 
          id='pass' 
          type='password' 
          value={valueOfPass} 
          onChange={changePassValue}
          ref={passInputRef}
          required
          /><br></br>
          <button type='submit'>Update</button>
          </form>

        </div>
      </div>
    </div>
  )
}
