import React, { useEffect } from 'react'
import { ThemeContext } from '../context/theme-context'
import { faSun , faMoon , faRightToBracket , faUserPlus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './component.css'
import {Link,useNavigate  } from "react-router-dom";
import axios from 'axios'
import Alert from './alert/Alert'

export default function Register() {
  // Context variables
  const {setThemes,themesMode,backEndUrl,checkCookie} = React.useContext(ThemeContext)
  // For Alert Massage Text And Color
  const [alertStatus , setAlertStatus] = React.useState({
    color : '',
    text : ''
  })
  const [alert , setAlert] = React.useState(false)
  // Set Theme Mode Class Name 
  const on_click = () => setThemes(themesMode === 'dark' ? 'light' : 'dark' )

  let navigate = useNavigate();

  useEffect(()=>{
    //  if the user logged in , redirect to profile page
    function checkUserSituation(){
      if(checkCookie('userName') && (window.location.href != '/login' || window.location.href != '/register')){
        return navigate('/profile')
      }
    }
    checkUserSituation()
  })

  //---FORM OPERATION ---//
  
  const onSubmitValues = (event) => {
    event.preventDefault()
    
    const registerData = {
      userName : event.target[0].value,
      userMail : event.target[1].value,
      userPass : event.target[2].value
    }
    if(event.target[2].value != event.target[3].value){
      setAlert(true)
      setAlertStatus({
        color : '#FECD70',
        text : 'Passwords dont same value'
      })
    }      
    else if(event.target[2].value.length < 6){
      setAlert(true)
      setAlertStatus({
        color : '#FECD70',
        text : 'Password Must Be Greater Than 6 Characters'
      }) 
    }
    else if(event.target[0].value.length < 3){
      setAlert(true)
      setAlertStatus({
        color : '#FECD70',
        text : 'User Name Must Be Greater Than 2 Characters'
      }) 
    }
    else{

        axios.post(`${backEndUrl}register`,registerData).then(res =>{
          if(res.status === 200) { 
            setAlert(true)
            setAlertStatus({
              color : '#3D8361',
              text : 'Register Successful, You Redirecting'
            })
            setTimeout(() => {
              return navigate('/')
            }, 3000);
            
          }
        }).catch(e =>{
          if(e.response.status === 400){
            setAlert(true)
            setAlertStatus({
              color : '#FECD70',
              text : 'This Mail And UserName already using'
            })
          }else if(e.response.status === 405){
            setAlert(true)
            setAlertStatus({
              color : '#FECD70',
              text : 'This mail is already using'
            })
          }else if(e.response.status === 406){
            setAlert(true)
            setAlertStatus({
              color : '#FECD70',
              text : 'This user name already using'
            })
          }else if(e.response.status === 501){
            setAlert(true)
            setAlertStatus({
              color : '#FECD70',
              text : 'There Is A Problem, Please Try Again Later'
            })
           
          }
      })
      

  }
  }
  return (
    <div id='loginPageMain'>
      {alert && <Alert  name={alertStatus.text} color={alertStatus.color}/>}
      <div id='loginPageWrapper'>
        <div id='loginpageBox'>
          <div id='loginPageIcons'>
      {
        themesMode === 'dark' ? 
        <FontAwesomeIcon icon={faSun} color={'yellow'} onClick={on_click} /> :  
        <FontAwesomeIcon icon={faMoon} color={'white'} onClick={on_click} />
      }
          </div>
          <div id='loginPageTitle'>
              <h1>Register</h1>
          </div>
          <div id='LoginInputs'>
            <form onSubmit={onSubmitValues}>
              <label for='userName'>User Name</label><br></br>
              <input name='userName' required></input><br></br>
              <label for='mail'>E-Mail</label><br></br>
              <input name='mail' type='email' required></input><br></br>
              <label for='pass' >Password</label><br></br>
              <input name='pass' type='password' required></input>
              <label for='pass'>Password Again</label><br></br>
              <input name='passAgain' type='password' required></input>
              <button type='submit'>Register <FontAwesomeIcon icon={faRightToBracket} color={'white'} /></button>
            </form>
          </div>
          <div id='new_account_text'>
          <Link className='new_account_textLink' to="/">Login  <FontAwesomeIcon icon={faUserPlus} color={'white'} style={{paddingLeft: '5px'}} /></Link>
          </div>
         
        </div>
      </div>

    </div>
  )
}
