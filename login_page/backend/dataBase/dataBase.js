const {MongoClient} = require('mongodb')

const uri ='mongodb+srv://vrm:mongodb1234@cluster0.clbkfyg.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri)

async function main() {
    try {
        await client.connect()
    } catch (e) {
        console.error(e)
    } 
}

main().catch(console.error);

const dbName = 'login_page'
const collectionName = 'members'

async function insertData(data){
    try {
        await client.db(dbName).collection(collectionName).insertOne(data)
    } catch (e) {
        return e
    }  

}
async function findUser(findUserName){
    const result = await client.db(dbName).collection(collectionName).findOne({userName : findUserName})
    if (result){return result}
    else {throw error}
    
}
async function updateData(findData , data){
    const result = await client.db(dbName).collection(collectionName).updateMany({userName : findData}, {$set : data})
    if(result){return result}
    else {throw error}
}
async function checkUserNameAndMail(findUserName , findMail){
    const checkUserName = await client.db(dbName).collection(collectionName).findOne({userName : findUserName}) 
    const checkUserMail = await client.db(dbName).collection(collectionName).findOne({userMail : findMail} )
    if(checkUserName && checkUserMail){
        return 1
    }
    else if(checkUserMail){
        return 2
    }
    else if(checkUserName){
        return false
    }
    else{
        return true
    }
}
async function checkUserNameAndMailForUpdate(findUserName , findMail){
    const checkUserName = await client.db(dbName).collection(collectionName).findOne({userName : findUserName}) 
    const checkUserMail = await client.db(dbName).collection(collectionName).findOne({userMail : findMail} )
    return {
        userMailData : checkUserMail,
        userNameData : checkUserName
    }
}
module.exports = {insertData,findUser,updateData,checkUserNameAndMail,checkUserNameAndMailForUpdate}