import React from 'react'
import '../component.css'
export default function Alert(props) {
  return (
    <div className='Alert' style={{backgroundColor : props.color}}>
        {props.name}
    </div>
  )
}
