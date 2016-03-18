var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('./'))

var userServer = {};
var userList = {};
var freeList = [];
io.on('connection', function(socket){
	socket.on('newUser',function(data){
		var nickname = data.user_name,
			user_id = data.user_id;
		socket.id = user_id;
		userServer[user_id] = socket;
		userList[user_id] = nickname
		freeList.push(user_id)
		io.emit('onlineCount',freeList)
		if(freeList.length > 1){
			var from = user_id;
			Arrayremove(freeList,from)
			if(freeList.length == 1){
				n = 0
			}else{
				n = Math.floor(Math.random() * freeList.length)
			}
			var to = freeList[n]
			Arrayremove(freeList,to)
			io.emit("getChat",{p1:from,p2:to},userList)
		}
	})
	socket.on('disconnect',function(){ //用户注销登陆执行内容
		var id = socket.id
		Arrayremove(freeList,id)
		delete userServer[id]
		delete userList[id]
		io.emit('onlineCount',freeList)
		io.emit('offline',{id:id})
	})
	socket.on('message',function(data){
		userServer[data.to].emit('getMsg',{msg:data.msg})
	})
})

function Arrayremove(array,name){
	var len = array.length;
	for(var i=0; i<len; i++){
		if(array[i] == name){
			array.splice(i,1)
			break
		}
	}
}


http.listen(4000, function(){
	console.log('listening on *:4000');
});