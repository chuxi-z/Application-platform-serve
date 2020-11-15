const {ChatModel} = require('../db/models')

module.exports = function (server) {
    // 得到 IO 对象
    const io = require('socket.io')(server) // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
        console.log('++++++++++++++++serve listen on client...')
        // 绑定 sendMsg 监听, 接收客户端发送的消息
        socket.on('sendMsg', function ({from, to, content}) {
            const chat_id = [from, to].sort().join('_')
            const create_time = new Date()
            new ChatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
                io.emit('receiveMsg', chatMsg)
            })
        })
    })
}
