var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('./',{
	setHeaders: function(res,path,stat){
		if(res && path.indexOf("images/" > -1)){
			res.setHeader("Cache-Control","public")
		}
	}
}))

var userServer = {};
var userList = {};
var freeList = [];
var count = 0;
io.on('connection', function(socket){
	count += 1;
	socket.on('newUser',function(data){
		var nickname = data.user_name,
			user_id = data.user_id;
		socket.id = user_id;
		userServer[user_id] = socket;
		userList[user_id] = nickname
		freeList.push(user_id)
		io.emit('onlineCount',freeList)
		io.emit('addCount', count)
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
		count -= 1; 
		var id = socket.id
		Arrayremove(freeList,id)
		delete userServer[id]
		delete userList[id]
		io.emit('onlineCount',freeList)
		io.emit('offline',{id:id})
		io.emit('addCount', count)
	})
	socket.on('message',function(data){
		if(userServer.hasOwnProperty(data.to)){
			userServer[data.to].emit('getMsg',{msg:data.msg})
		}else{
			socket.emit("err",{msg:"对方已经下线或者断开连接"})
		}
	})
	socket.on('sendImg',function(data){
		if(userServer.hasOwnProperty(data.to)){
			userServer[data.to].emit('getImg',{msg:data.msg})
		}else{
			socket.emit("err",{msg:"对方已经下线或者断开连接"})
		}
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