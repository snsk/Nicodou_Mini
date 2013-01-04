<html>
<head>

<?php
	echo("Hello world");
?>

<script src="http://snsk.net:8888/socket.io/lib/socket.io.js"></script>
</head>
<body>
<h1>poor realtime chat app</h1>
hit enter key to send your message.<br>
<textarea id="in" cols="60" rows="5"></textarea>
<div id="disp"><div></div></div>

<script>
var socket = io.connect('http://snsk.net:8888');
socket.on('myevent', function (data) {
    var disp = document.getElementById("disp");
    disp.innerHTML += data;
});

document.getElementById("in").onkeyup = function(e){
    if(e.keyCode == 13){
        socket.emit('myevent', document.getElementById("in").value);
        document.getElementById("in").value = ""; //clear message input area.
    }
}
</script>

</body></html>
