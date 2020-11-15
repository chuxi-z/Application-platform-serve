const mongoose = require('mongoose')

mongoose.connect("mongodb://root:root@localhost:27017/job_hunting?authSource=admin")
const conn = mongoose.connection

conn.on("connected", () =>{
    console.log("connect success!!!")
})


const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel

const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的 id
    to: {type: String, required: true}, // 接收用户的 id
    chat_id: {type: String, required: true}, // from 和 to 组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type:Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
})
// 定义能操作 chats 集合数据的 Model
const ChatModel = mongoose.model('chat', chatSchema) // 向外暴露 Model
exports.ChatModel = ChatModel
