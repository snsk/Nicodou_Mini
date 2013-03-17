$(function(){
    var socket = new io.connect("/");
    
    socket.on("connect", function(){
	$("#transportName").text("ready!:" + socket.socket.transport.name);// 接続時に接続方式表示
    });
    
    socket.on("message", function(message){ //ここで同期
	console.log("message:" + message);
	addComment(message);
    });
    
    socket.on("change", function(message){ //ここで同期
	console.log("change:" + message);
	change(message);
    });
    
    $("#submitButton").click(function(event){
	socket.emit("message", {message: $("#msg").val()});// 入力メッセージをサーバへ
    });

    $("#change").click(function(event){
	socket.emit("change", {message: $("#videoid").val()});// 入力メッセージをサーバへ
    });

});

var params = { allowScriptAccess: "always" };
var atts = { id: "myytplayer" };
swfobject.embedSWF("http://www.youtube.com/v/lCuFpAo13uo?enablejsapi=1&playerapiid=ytplayer", 
                   "ytapiplayer", "560", "349", "8", null, null, params, atts);

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("myytplayer");
}

function change(message){
    ytplayer.loadVideoById(message, 0 );
}

var nicoscreenSettingInfo = {
    "base":{
	color:"white", //文字の色を指定します
	speed:"slow", //文字が流れるスピードを指定します。slow/fast/normal 
	interval:"normal",//文字が流れる間隔を指定します。slow/fast/normal
	font_size:"30px", //フォントのサイズを指定します。
	loop:false //文字が最後まで流れた後に、繰り返すかどうか　true/false
    },
    "comments":[

    ]
};
nicoscreen.set(nicoscreenSettingInfo);
nicoscreen.start();

function addComment(msg){
    var str = $(msg).val();
    nicoscreen.add(msg);
    $("#msg").val("");
}

require('nodefly').profile(
    '7b8d021e-85a2-4f22-9f67-f4ba05d44d5b',
    ['ethmusicaloop','Heroku'],
    options // optional
);