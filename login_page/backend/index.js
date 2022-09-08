const express = require('express')
const Database = require('./dataBase/dataBase')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 2000;

app.use(cors())
app.use(express.json())

app.post('/',(req ,res) =>{
    Database.findUser(req.body.userName)
    .then((resResult)=> {
        if(req.body.pass === resResult.userPass){
            res.send({memberName : resResult.userName , userpass : resResult.userPass , userMail : resResult.userMail})
        }else{
            res.sendStatus(406)
        }
    })
    .catch((e) => res.sendStatus(400) )
})

app.post('/register' , (req, res) =>{

    Database.checkUserNameAndMail(req.body.userName,req.body.userMail)
    .then((e) =>{
        console.log(e)
        if(e === 1){
            res.sendStatus(400)
        }
        if(e === 2){
            res.sendStatus(405)
        }
        if(e === false){
            res.sendStatus(406)
        }
        if(e === true){
            Database.insertData(req.body)
            .then(()=> {res.sendStatus(200)})
            .catch(() => res.sendStatus(501))
        }
    })
     
})

app.put('/update', (req,res) =>{
    const OldUserName = req.body.oldUserName
    const OldUserMail = req.body.oldUserMail
    const OldPass = req.body.oldPass
    const mailQuery = OldUserMail === req.body.userMail
    const userNameQuery = OldUserName === req.body.userName
    const passQuery = OldPass === req.body.pass
    const updateData = { 
        userName : req.body.userName,
        userMail : req.body.userMail,
        userPass : req.body.pass,
      }
    if( mailQuery && userNameQuery && passQuery){
        res.sendStatus(400) // there is a no diffrent data
    }else{
        Database.checkUserNameAndMailForUpdate(updateData.userName,updateData.userMail)
        .then(e =>{
          // The User Name Is Not Availability
          if(e.userNameData != null && e.userNameData.userName != OldUserName && (e.userMailData === null || e.userMailData.userMail === OldUserMail)){
            res.sendStatus(405); 
          }
          // The User Mail Is Not Availability
          if(e.userMailData != null && e.userMailData.userMail != OldUserMail && (e.userNameData === null || e.userNameData.userName === OldUserName)){
            res.sendStatus(406)
          }
          // Update User Name
          if(e.userNameData === null && e.userMailData != null && e.userMailData.userMail === OldUserMail){
            Database.updateData(OldUserName,updateData)
            .then( () => res.sendStatus(201))
            .catch( () => res.sendStatus(501)) 
          }
          // E-mail Update
          if(e.userMailData === null && e.userNameData != null && e.userNameData.userName === OldUserName){
            Database.updateData(OldUserName,updateData)
            .then( () => res.sendStatus(202))
            .catch( () => res.sendStatus(501)) 
          }
          // Update 
          if(e.userMailData === null && e.userNameData === null){
            Database.updateData(OldUserName,updateData)
            .then( () => res.sendStatus(206))
            .catch( () => res.sendStatus(501)) 
          }
          // Password Update
          if(req.body.pass != OldPass && e.userMailData != null && e.userNameData != null && e.userNameData.userName === OldUserName && e.userMailData.userMail === OldUserMail){
            Database.updateData(OldUserName,updateData)
            .then( () => res.sendStatus(204))
            .catch( () => res.sendStatus(501))          
          }
          //The User Name And User Mail Is Not Availability
          if(e.userNameData != null && e.userNameData.userName != OldUserName && e.userMailData != null && e.userMailData.userMail != OldUserMail){
            res.sendStatus(500)
          }
        })
    }

})

app.listen(port , ()=>{
    console.log('server is ready')
})

