import React, { useEffect, useRef } from 'react'
import { ThemeContext } from '../context/theme-context'
import { faSun , faMoon , faRightToBracket , faUserPlus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './component.css'
import {Link ,useNavigate } from "react-router-dom";
import axios from 'axios'
import Alert from './alert/Alert'
export default function LoginPage() {
  // Context 
  const {setThemes,themesMode ,backEndUrl,createCookie ,checkCookie} = React.useContext(ThemeContext)
  // set Dark Theme
  const on_click = () => setThemes(themesMode === 'dark' ? 'light' : 'dark' )
  // Alert settings
  const [alertStatus , setAlertStatus] = React.useState({
    color : '',
    text : ''
  })
  const [alert , setAlert] = React.useState(false)

  let navigate = useNavigate();

  useEffect(() =>{
    function checkUserSituation(){
      // if the user logged in , redirect to profile page
      if(checkCookie('userName') && (window.location.href != '/login' || window.location.href != '/register')){
        setTimeout(() => {
          return navigate('/profile')
        }, 2000);
      }
    }
    checkUserSituation()
  })

  function closeAlert(){
    setTimeout(() => {
      setAlert(false)  
    }, 2000);
  }
  //--- LOGIN OPERATION ---//
  const onSubmitLogin = (event) =>{
    event.preventDefault()
    const loginData = { 
      userName : event.target[0].value,
      pass : event.target[1].value
    }

    axios.post(backEndUrl,loginData)
    .then((res)=>{
      setAlert(true)
      setAlertStatus({
        color : '#3D8361',
        text : 'Logged In, You Redirecting'
      })
      setTimeout(() => {
        navigate('/profile')
      }, 2000);
      const userName = res.data.memberName
      const pass = res.data.userpass
      const mail = res.data.userMail
      createCookie(userName,pass,mail,1)
  })
    .catch((e) =>{
      if(e.response.status === 406){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'Username Or Password is not correct'
        })
        closeAlert()
      }   
      else if(e.response.status === 400){
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'Username Or Password is not correct'
        })
        closeAlert()
      }  
      else{
        setAlert(true)
        setAlertStatus({
          color : '#FECD70',
          text : 'There Is A Problem, Please Try Again Later'
        })
        closeAlert()
        
      }
    })
  }


  return (
    <div id='loginPageMain'>
      <div id='loginPageWrapper'> 
        {alert && <Alert  name={alertStatus.text} color={alertStatus.color}/>}
        <div id='loginpageBox'>
          <div id='loginPageIcons'>
      {
        themesMode === 'dark' ? 
        <FontAwesomeIcon icon={faSun} color={'yellow'} onClick={on_click} /> :  
        <FontAwesomeIcon icon={faMoon} color={'white'} onClick={on_click} />
      }
          </div>
          <div id='loginPageTitle'>
              <h1>Login</h1>
          </div>
          <div id='LoginInputs'>
            <form onSubmit={onSubmitLogin}>
              <label for='userName'>User Name</label><br></br>
              <input name='userName' required></input><br></br>
              <label for='pass'>Password</label><br></br>
              <input name='pass' type='password' required></input>
              <button type='submit' >Login <FontAwesomeIcon icon={faRightToBracket} color={'white'} /></button>
            </form>
          </div>
          <div id='new_account_text'>
          <Link className='new_account_textLink' to="/register">New Account  <FontAwesomeIcon icon={faUserPlus} color={'white'} style={{paddingLeft: '5px'}} /></Link>
          </div>
         
        </div>
      </div>

    </div>
  )
}
