/*
 * Required Libraries;
 */
var sio = require('socket.io'),
	http = require("http"),
	request = require('request'),
	querystring = require('querystring'),
	sys = require('sys');

var io = sio.listen(8080, { log: false });

var aCommand = [
		'a0',
		'a1',
		'a2',
		'a3',
		'a4',
		'a5',
		'a6',
		'a7',
		'b0',
		'b1',
		'b2',
		'b3',
		'b4',
		'b5',
		'b6',
		'b7',
		'c0',
		'c1',
		'c2',
		'c3',
		'c4'
];

var BUTTONS = [];
var COMMANDS = [];

for (var i = 0; i< 20; i++) {
	BUTTONS[i] = 0;
	COMMANDS[i] = aCommand[i];
}

function dec2Bin(dec)
{
	var res;
    if(dec > 0) {
    	res = dec.toString(2);
    } else {
        res = "00000000";
    }
    if (res.length<8) {
    	var tmp = "";
    	for (var i=res.length; i<8; i++) {
    		tmp +="0";
    	}
    	res = tmp + res;
    } 
    return res;
}


function Post(data, socket) {
	var socket = socket || null;
	var data = querystring.stringify(data);
	var options = {
		    host: '',
		    port: 80,
		    path: '/',
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/x-www-form-urlencoded',
		        'Content-Length': data.length
		    }
		};
	
	try {
		var req = http.request(options, function(res) {
		    res.setEncoding('utf8');
		    var body = '';
		    res.on('data', function (chunk) {
		    	body += chunk;
			});
		    res.on('end', function () {
		    	if (res.statusCode == '200') {
		    		var aValues = (body.replace(/\[\{/, '').replace(/\}\]/, '')).split(/,/);
		    		var str = dec2Bin(parseInt(aValues[0]));
		    		var str2 = "";
		    		for (var i = str.length; i>0; i--) {
		    			str2+=str[(i-1)];
		    		}
		    		var str = dec2Bin(parseInt(aValues[1]));
		    		for (var i = str.length; i>0; i--) {
		    			str2+=str[(i-1)];
		    		}
		    		
		    		
		    		for (var i in str2) {
			    		BUTTONS[i] = str2[i];
			    	}
			    	try {
			    		io.sockets.emit('buttons', {'buttons':BUTTONS, 'counter': SOCKETCOUNTER});
			    	} catch (e) {
			    	}
		    	}
	        });
		});
		req.write(data);
		req.end();	
	} catch (e){
		
	}
	
}

Post({});

var noActivityTimer;
var noActivityInterval;
var intervalActive = false;

function activity() {
	clearTimeout(noActivityTimer);
	clearInterval(noActivityInterval);
	if (intervalActive== true) {
		intervalActive = false;
	}
	noActivityTimer = setTimeout(noActivity, 60000);
}


var actStatus = 0;




function noActivity() {
	
	
	
	noActivityInterval = setInterval(function(){
		
		intervalActive = true;
		
		var oactStatus = actStatus;
		if (actStatus == 0) {
			actStatus = 1;
		} else {
			actStatus = 0;
		}
		
		var tmp = {};
		for (var button in BUTTONS) {
			tmp[COMMANDS[button]] = (button%2)? actStatus:oactStatus;
		}
		Post(tmp);
	}, 1500);
	
	
}

var SOCKETCOUNTER = 0;

io.sockets.on('connection', function (socket) {
	activity();
	function updateCounter(init) {
		SOCKETCOUNTER = init||0;
		for (var i in io.sockets.sockets) {
			SOCKETCOUNTER++;
		}
		
		socket.broadcast.emit('counter', {'counter': SOCKETCOUNTER});
	}
	updateCounter();
	socket.emit('buttons', {'buttons':BUTTONS, 'counter': SOCKETCOUNTER});
	socket.on('disconnect', function() {
		updateCounter(-1);
    });
	socket.on('buttonsChange', function(data) {
			activity();
			var tmp = {};
			for (var button in BUTTONS) {
				if  (data[button] && data[button] == 1) {
					var value = 1;
				} else {
					var value = 0;
				}						
				if (BUTTONS[button]!=value) {
					tmp[COMMANDS[button]] = value;
				}
				BUTTONS[button] = value;
			}
			Post(tmp, socket);
	});
});
