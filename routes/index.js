var express = require('express');
var router = express.Router();
const md5 = require("blueimp-md5")

const {UserModel, ChatModel} = require("../db/models")
const filter = {password: 0, __v: 0}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//test
// router.post('/register', function (req, res){
//   const {username, password} = req.body
//
//   console.log('register')
//   if (username === 'admin'){
//     res.send({code: 1, msg: 'username has been registered'})
//   }
//   else{
//     res.send({code: 0, data: {id: '01', username, password}})
//   }
// })


//router for register
router.post("/register", function (req, res) {
  const {username, password, type} = req.body

  UserModel.findOne({username}, function (error, user){
    if (user){
      res.send({code: 1, msg: 'username has been registered'})
    }
    else{
      new UserModel({username, type, password: md5(password)}).save(function (error, user) {
        //cookie
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})

        const data = {username, type, _id: user._id}
        res.send({code: 0, data})
      })
    }
  })

})

//login

router.post("/login", function (req, res) {
  const {username, password, type} = req.body

  UserModel.findOne({username, password: md5(password)}, filter, function (error, user) {
    if (user){
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
      res.send({code: 0, data: user})
    }
    else{
      res.send({code: 1, msg: "Username or password is wrong..."})
    }
  })
})


router.post("/update", function (req, res) {
  const userid = req.cookies.userid
  if(!userid){
    res.send({code: 1, msg: 'Please login first...'})
    return
  }

  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, olduser) {
    if(!olduser){
      res.clearCookie('userid')
      res.send({code: 1, msg: 'Please login first...'})
    }
    else{
      const {_id, username, type} = olduser
      const data = Object.assign(user, {_id, username, type})
      res.send({code: 0, data})
    }

  })

})



router.get("/user", function (req, res) {
  const userid = req.cookies.userid
  if(!userid){
    res.send({code: 1, msg: 'Please login first...'})
  }

  UserModel.findOne({_id: userid}, filter, function (error, user){
    res.send({code: 0, data: user})
  })
})


router.get("/userlist", function (req, res) {
  const {type} = req.query
  UserModel.find({type}, filter, function (error, users){
    res.send({code: 0, data: users})
  })
})



router.get("/msglist", function (req, res) {
  const userid = req.cookies.userid
  UserModel.find(function (error, userDocs) {
    const users = {}

    userDocs.forEach(doc =>{
      users[doc._id] = {username: doc.username, header: doc.header}
    })

    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMess) {
      res.send({code: 0, data: {users, chatMess}})
    })
  })
})


router.post("/readmsg", function (req, res) {
  const to = req.cookies.userid
  const from = req.body.from

  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    res.send({code: 0, data: doc.nModified})
  })

})

module.exports = router;
