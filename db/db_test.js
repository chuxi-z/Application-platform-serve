 const mongoose = require('mongoose')

const md5 = require('blueimp-md5')

//connect with mongodb
mongoose.connect('mongodb://root:root@localhost:27017/job_hunting_test?authSource=admin', { useNewUrlParser: true })
const conn = mongoose.connection

conn.on('connected', function () {
    console.log('connect success!!!!')
})


//introduce mongoose
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // username
    password: {type: String, required: true}, // password
    type: {type: String, required: true}, // user type: boss/applicant
    avatar: {type: String}
})

const UserModel = mongoose.model('user', userSchema) //collection is users

function testSave(){
    // const userModel = new UserModel({username: 'Jerry', password: md5('123'), type: 'boss'})
    const userModel = new UserModel({username: 'Bob', password: md5('12345'), type: 'applicant'})
    userModel.save(function (error, userDoc){
        console.log('save()', error, userDoc)
    })
}

// testSave()

 function testFind() {
    UserModel.find(function (error, user) {
        console.log('find()', error, user)
    })
     UserModel.findOne({username: 'Bob'}, function (error, user) {
         console.log('findOne()', error, user)
     })
 }

 // testFind()

 function testUpdate(){
    UserModel.findByIdAndUpdate({_id: '5fa9bb88424545441cedbe04'}, {username: 'Jack'}, function (error, user) {
        console.log('findByIdAndUpdate()', error, user)
    })
 }

// testUpdate()

 function testDelete() {
    UserModel.remove({_id: '5fa9bb88424545441cedbe04'}, function (error, doc) {
        console.log("delete*()", error, doc)
    })
 }
testDelete()
