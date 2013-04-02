//client

var socket = new io.connect("/");

//イベント受信時
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

socket.on("event", function(status){
    console.log("event.stat:" + status.newStatus);
    console.log("event.time:" + status.currentTime.toString());
    console.log("event.id:" + status.videoId);
    console.log("local.stat:" + ytplayer.getPlayerState());
    if(ytplayer.getPlayerState() != -1){
	ytplayer.seekTo(status.currentTime, true);
	console.log("seek by remote!");
    }
});

socket.on("count", function(message){
    console.log("count:" + message.toString());
    $("#count").text("Peoples:" + message.toString());
});

//イベントリスナ登録
$("#submitButton").click(function(event){
    socket.emit("message", {message: $("#msg-prefix").val() + $("#msg").val()});
});

$("#change").click(function(event){
    socket.emit("change", {message: $("#videoid").val()});
});

function onytplayerStateChange(newState) {
    ytapiplayer.status.newStatus = newState;
    ytapiplayer.status.currentTime = ytplayer.getCurrentTime();
    ytapiplayer.status.videoId = ytplayer.getVideoId();

    socket.emit("event", {message: ytapiplayer.status});
    if(newState === 0){//In play complete, loop. But, this version has problem that clear video buffer, means every time full load the video.
	ytplayer.stopVideo();
    }
}

//プレーヤーオブジェクト
var ytapiplayer = {
    params: { 
	allowScriptAccess: "always",
	wmode: "transparent",
    },
    atts: { id: "myytplayer" },
    status: {
	videoId: "",
	newStatus: 0,
	currentTime: 0,
    },
    sync: function(){
	this.status.newStatus = ytplayer.getPlayerState();
	this.status.currentTime = ytplayer.getCurrentTime();
	this.status.videoId = ytplayer.getVideoId();
/*	console.log("sync.status: " + this.status.newStatus);
	console.log("sync.currentTime: " + this.status.currentTime);
	console.log("sync.videoId: " + this.status.videoId);
*/
    }
};

swfobject.embedSWF("http://www.youtube.com/v/kvnV0qc9lRI?enablejsapi=1&playerapiid=ytplayer", 
                   "ytapiplayer", "560", "349", "8", null, null, ytapiplayer.params, ytapiplayer.atts);

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("myytplayer");
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    ytplayer.getVideoId = function(){ //why does not exist with Youtube JS API's...
	return ytplayer.getVideoUrl().split("&v=")[1];
    };
    ytapiplayer.sync();
}

function change(message){
    ytplayer.loadVideoById(message, 0 );
}

function addComment(msg){
    nicoscreen.add(msg);
    $("#parent").prepend('<div id="user">'+ msg +'</div>');
}

var nicoscreenSettingInfo = {
    "base":{
	color:"white", //文字の色を指定します
	speed:"slow", //文字が流れるスピードを指定します。slow/fast/normal 
	interval:"fast",//文字が流れる間隔を指定します。slow/fast/normal
	font_size:"20px", //フォントのサイズを指定します。
	loop:false //文字が最後まで流れた後に、繰り返すかどうか　true/false
    },
    "comments":[

    ]
};
nicoscreen.set(nicoscreenSettingInfo);
nicoscreen.start();
