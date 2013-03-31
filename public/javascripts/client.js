//client

$(function(){
    var socket = new io.connect("/");
    
    socket.on("connect", function(){
	$("#transportName").text("ready!:" + socket.socket.transport.name);// 接続時に接続方式表示
    });

    socket.on("message", function(message){
	console.log("message:" + message);
	addComment(message);
    });

    socket.on("change", function(message){
	console.log("change:" + message);
	change(message);
    });
    
    $("#submitButton").click(function(event){
	socket.emit("message", {message: $("#msg").val()});
    });

    $("#change").click(function(event){
	socket.emit("change", {message: $("#videoid").val()});
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

function addComment(msg){
    var str = $(msg).val();
    nicoscreen.add(msg);
    $("#parent").prepend('<div id="user">'+ msg +'</div>');
    $("#msg").val("");
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

