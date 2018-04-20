/*
@name 小喇叭服务器
@desc nodejs通过socket.io来跑websocket服务端，只简单处理用户绑定和消息发送，其余逻辑在php上处理
@usage node server
*/
var http = require("http");
var server = http.createServer();
var io = require("socket.io")(server);
var users = [];

server.listen(8888, function(err){
	if(err){
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:8888/\n');
});

io.on('connection', function (socket) {

	socket.on('login', function (data) {
		users[data.username] = socket.id;
		console.log(users);
	});

	socket.on('send', function (data) { //收到后台发送小喇叭广播的请求
		socket.broadcast.emit("msg", data); //给所有客户端发送小喇叭
	});

	socket.on('sendto', function (data) { //收到后台给指定用户发送消息的请求
		socket.to(users[data.username]).emit("msg", data);
    
		/*if (io.sockets.connected[users[data.username]]) {
			io.sockets.connected[users[data.username]].emit("msg", data);
		}*/
    
	});

	socket.on('disconnect', (reason) => {
		//console.log('断开连接', reason, socket.id);
	});

});