var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
var socket = require('socket.io');
var io = socket(server);


//console.log('hi');

var mapList = ['space', 'beach'];

var playersInformation = [];
var blockInformation = [];
var socketIDlist = [];
var bulletList = [];
var landlist = [];
var coreInformation = [];
var gameStarted = false;
var gameStartCountdown = 11;
//var selectedMap = 'spikes'; //"beach", "space", "new";

var mapNo2 = Math.floor(Math.random() * mapList.length);
var selectedMap = mapList[mapNo2];

var serverIsRestarting = false;



function makeCore(x, y, team) {
	var data = {
	    x: x * 20 - 20,
	    y: y * 20,
	    hp: 30,
	    type: 'core',
	    team: 'lightgreen'
	}
	coreInformation.push(data);
	var data2 = {
	    x: 2400 - x * 20,
	    y: y * 20,
	    hp: 30,
	    type: 'core',
	    team: 'orange'
	}
	coreInformation.push(data2);
}

function makeLand(x, y) {
	var data = {
	    x: x * 20 - 20,
	    y: y * 20,
	    type: 'land',
	    color: 'gray'
	}
	landlist.push(data);
	var data2 = {
	    x: 2400 - x * 20,
	    y: y * 20,
	    type: 'land',
	    color: 'gray'
	}
	landlist.push(data2);
}

function makeLandOpp(x, y, diff) {
	var data = {
	    x: x * 20 - 20,
	    y: y * 20,
	    type: 'land',
	    color: 'gray'
	}
	landlist.push(data);
	var data2 = {
	    x: 2400 - x * 20,
	    y: y * 20 - diff,
	    type: 'land',
	    color: 'gray'
	}
	landlist.push(data2);
}

var oc = '#d88c00';
var gc = '#00bf1f';

function colorb(x, y) {
	var data = {
	    x: x - 20,
	    y: y,
	    hp: 1000,
	    type: 'sandbag',
	    team: 'none',
	    color: gc
	}
	blockInformation.push(data);
	var data2 = {
	    x: 2400 - x,
	    y: y,
	    hp: 1000,
	    type: 'sandbag',
	    team: 'none',
	    color: oc
	}
	blockInformation.push(data2);
}

function colorg(x, y) {
	var data = {
	    x: x - 20,
	    y: y,
	    hp: 1000,
	    type: 'sandbag',
	    team: 'none',
	    color: gc
	}
	blockInformation.push(data);
}

function coloro(x, y) {
	var data2 = {
	    x: 2400 - x,
	    y: y,
	    hp: 1000,
	    type: 'sandbag',
	    team: 'none',
	    color: oc
	}
	blockInformation.push(data2);
}
// MAP //
function drawMap() {
	if (selectedMap == 'space') {
		for(var x=1;15>x;x++)for(var y=0;30>y;y++)makeLand(x,y);for(var y=0;30>y;y++)makeLand(20,y);for(var y=0;30>y;y++)makeLand(21,y);for(var y=0;30>y;y++)makeLand(22,y);for(var y=0;28>y;y++)makeLand(23,y+1);for(var y=0;28>y;y++)makeLand(24,y+1);for(var y=0;26>y;y++)makeLand(25,y+2);for(var y=0;24>y;y++)makeLand(26,y+3);for(var y=0;22>y;y++)makeLand(27,y+4);for(var y=0;18>y;y++)makeLand(28,y+6);for(var y=0;14>y;y++)makeLand(29,y+8);for(var x=40;55>x;x++)for(var y=20;30>y;y++)makeLand(x,y);for(var y=21;29>y;y++)makeLand(39,y);for(var y=23;27>y;y++)makeLand(38,y);makeCore(7,26),makeCore(6,26),makeCore(5,26),makeCore(7,27),makeCore(6,27),makeCore(5,27),makeCore(7,2),makeCore(6,2),makeCore(5,2),makeCore(7,3),makeCore(6,3),makeCore(5,3);for(var y=0;30>y;y++)(5>y||y>24)&&colorb(280,20*y);for(var y=0;30>y;y++)(5>y||y>24)&&colorb(400,20*y);colorb(420,0),colorb(420,580),colorb(440,0),colorb(440,580),colorb(440,20),colorb(440,560),colorb(460,20),colorb(460,560),colorb(480,20),colorb(480,560),colorb(480,40),colorb(480,540),colorb(500,40),colorb(500,540),colorb(500,60),colorb(500,520),colorb(520,60),colorb(520,520),colorb(520,80),colorb(520,500),colorb(520,80),colorb(520,520),colorb(540,80),colorb(540,480),colorb(540,100),colorb(540,500);for(var x=40;55>x;x++)colorb(20*x,580);for(var x=40;55>x;x++)colorb(20*x,400);
	} else if (selectedMap == 'beach') {
		for(var x=1;15>x;x++)for(var y=0;30>y;y++)makeLand(x,y);for(var x=12;15>x;x++){for(var y=0;2>y;y++)makeCore(x,y);for(var y=28;30>y;y++)makeCore(x,y)}for(var x=20;25>x;x++)for(var y=0;30>y;y++){var notallowList=[];24==x&&(notallowList=[0,1,28,29]),23==x&&(notallowList=[0,29]),-1==notallowList.indexOf(y)&&makeLand(x,y),24==x&&-1==notallowList.indexOf(y)&&(10>y||y>19)&&colorb(20*x,20*y)}for(var x=40;60>x;x++){for(var y=20;30>y;y++)makeLandOpp(x,y, 400);52>x&&(coloro(20*x,180),colorg(20*x,400))}
	} else if (selectedMap == 'spikes') {
		for(var x=1;10>x;x++)for(var y=0;30>y;y++)makeLand(x,y);

		for (var x = 8; x < 10; x++) {
			for (var y = 0; y < 30; y++) {
				if ((y > 26) || (y < 3)) {
					makeCore(x, y);
				}
			}
		}
		for (var x = 10; x<15; x++) {
			for (var y = 0; y< 30; y++) {
				if ((y >= 20) || (y < 10)) {
					makeLand(x, y);
				}
			}
		}

		for (var x = 30; x<35; x++) {
			for (var y = 0; y< 30; y++) {
				if ((y >= 20) || (y < 10)) {
					makeLand(x, y);
					if (x == 34) {
						colorb(x * 20, y*20);
					}
				}
			}
		}
	}
}
// MAP //
var bulletNo = 0;

var teams = {
	lightgreen: {
		noofPlayers: 0
	},
	orange: {
		noofPlayers: 0
	}
}

function resetData(delay) {
	if (serverIsRestarting == false) {
		serverIsRestarting = true;
		setTimeout(function() {
			io.emit('exit', '');

			setTimeout(function() {
				playersInformation = [];
				blockInformation = [];
				socketIDlist = [];
				bulletList = [];
				landlist = [];
				coreInformation = [];
				gameStarted = false;
				gameStartCountdown = 11;
				var pickAgain = true;
				while (pickAgain) {
					var mapNo = Math.floor(Math.random() * mapList.length);
					if (selectedMap != mapList[mapNo]) {
						pickAgain = false;
						selectedMap = mapList[mapNo];
					}
				}
				drawMap();
				teams = {
					lightgreen: {
						noofPlayers: 0
					},
					orange: {
						noofPlayers: 0
					}
				}
				bulletNo = 0;
				setTimeout(function() {
					serverIsRestarting = false;
				}, 500);
			}, 1000);
		}, delay);
	}
}
drawMap();


io.sockets.on('connection', newConnection);
function newConnection(socket) {
	socket.on('cnt', cnt);
	function cnt(data) {
		//console.log('New player! id=' + socket.id + ' name=' + data.name);
		var teamname = '';
		var soawbx = 100;
		if (teams.lightgreen.noofPlayers >= teams.orange.noofPlayers) {
			teams.orange.noofPlayers += 1;
			teamname = 'orange';
			spawnx = data.mapWidth - 98;
		} else {
			teams.lightgreen.noofPlayers += 1;
			teamname = 'lightgreen';
			spawnx = 100;
		}

		playersInformation.push({
			x: spawnx,
			y: 200,
			id: socket.id,
			name: data.name,	
			team: teamname,
			hp: 50,
			msg: '',
			kills: 0
		});
		socketIDlist.push(socket.id);
		socket.emit('id', {
			id: socket.id,
			team: teamname
		});
		for (var i=0; i<blockInformation.length; i++) {
			socket.emit('block', blockInformation[i]);
		}
		for (var i=0; i<coreInformation.length; i++) {
			socket.emit('core', coreInformation[i]);
		}
		for (var i=0; i<landlist.length; i++) {
			socket.emit('land', landlist[i]);
		}
		socket.emit('start', {bool: gameStarted, no: playersInformation.length, cd: gameStartCountdown, map: selectedMap});
	}

	socket.on('disconnect', function() {
		//console.log('someone disconnected!');
      	for (var i = 0; i < playersInformation.length; i++) {
      		if (playersInformation[i].id == socket.id) {
      			var theteamname = playersInformation[i].team;
      			if (theteamname == 'lightgreen') {
      				teams.lightgreen.noofPlayers -= 1;
      			} else {
      				teams.orange.noofPlayers -= 1;
      			}
      			playersInformation.splice(i, 1);
      			socketIDlist.splice(i, 1);
      			break;
      		}
      	}
   	});

	socket.on('to', msg);
	function msg(data) {
		if (socket.id == data.id) {
			var index = socketIDlist.indexOf(socket.id);
			playersInformation[index].x = data.x;
			playersInformation[index].y = data.y;
		} else {
			//console.log('there is error with id');
		}
	}
	socket.on('gun', gun);
	function gun(data) {
		bulletNo += 1;
		data.no = bulletNo;
		io.emit('gun', data);
		bulletList.push(data);
	}

	socket.on('msg', msgmsg);
	function msgmsg(data) {
		var index = socketIDlist.indexOf(data[1]);
		if (typeof playersInformation[index] != 'undefined') {
			playersInformation[index].msg = data[0];
		}
	}

	socket.on('land', land);
	function land(data) {
		landlist.push(data);
		socket.broadcast.emit('land', data);
	}


	socket.on('medied', medied);
	function medied(data) {
		if (socket.id == data) {
			io.emit('death', data);
			//console.log(data + ' died!');
		} else {
			//console.log('there is error with id');
		}
	}
	socket.on('block', block);
	function block(data) {
		blockInformation.push(data);
		socket.broadcast.emit('block', data);

	}
}

var heartbeatInterval = setInterval(function() {
	io.emit('heartbeat', playersInformation);
}, 100);

function killbullet(no, i) {
	io.emit('killbullet', no);
	bulletList.splice(i, 1);
}
function killPlayer(id, del) {
	setTimeout(function() {
		var index = socketIDlist.indexOf(id);
		/*
		playersInformation.splice(index, 1);
		socketIDlist.splice(index, 1);*/
		if (playersInformation[index].team == 'lightgreen') {
			playersInformation[index].x = 2400 - 98;
		} else {
			playersInformation[index].x = 100;
		}
		playersInformation[index].y = 200;
		playersInformation[index].hp = 50;
		io.emit('killplayer', playersInformation[index].id);

	}, del);
}
var bulletInterval = setInterval(function() {
	for (var i = 0; i < bulletList.length; i++) {
		bulletList[i].mex += bulletList[i].byx;
		bulletList[i].mey += bulletList[i].byy;
		var mex = bulletList[i].mex;
		var mey = bulletList[i].mey;
		var bulletAlive = true;
		for (var z = 0; z < blockInformation.length; z++) {
			var bux = blockInformation[z].x;
			var buy = blockInformation[z].y;
			var minuser = 10 - bulletList[i].bulletsize / 2;
			if ((mex - 35 + minuser < bux) && (mex + 15 - minuser > bux) && (mey - 35 + minuser < buy) && (mey + 15 - minuser > buy)) { // right, left
				////console.log('collision');
				var animationInfo = {
					x: blockInformation[z].x,
					y: blockInformation[z].y
				}
				var itisbunker = false
				if ((blockInformation[z].type == 'sandbag') || (blockInformation[z].type == 'slab')) {
					if (blockInformation[z].type == 'slab') {
						/*if (blockInformation[z].team != bulletList[i].team) {
							if (blockInformation[z].hp > 0) {
								blockInformation[z].hp -= bulletList[i].bulletsize;
							} else {
								io.emit('killblock', blockInformation[z]);
								blockInformation.splice(z, 1);
							}
						} else {*/
						itisbunker = true;
						//}
					} else {
						if (blockInformation[z].hp > 0) {
							blockInformation[z].hp -= bulletList[i].bulletsize;
						} else {
							io.emit('killblock', blockInformation[z]);
							blockInformation.splice(z, 1);
						}
					}
				}
				if (itisbunker == false) {
					killbullet(bulletList[i].no, i);
					io.emit('animation', animationInfo);
					bulletAlive = false;
				}
				break;
			}
		}
		if (bulletAlive) {
			for (var z = 0; z < playersInformation.length; z++) {
				if (playersInformation[z].team != bulletList[i].team) {
					var bux = playersInformation[z].x;
					var buy = playersInformation[z].y;
					var minuser = 5;
					if ((mex - 35 + minuser < bux) && (mex + 15 - minuser > bux) && (mey - 35 + minuser < buy) && (mey + 15 - minuser > buy)) { // right, left
						////console.log('collision');
						var knockbackDir = {
							x: (bulletList[i].byx),
							y: (bulletList[i].byy)
						}
						var knockToPos = {
							x: 0,
							y: 0
						}
						if (knockbackDir.x < 0) {knockbackDir.x *= -1};
						if (knockbackDir.y < 0) {knockbackDir.y *= -1};
						while ((knockbackDir.x < 20) && (knockbackDir.y < 20)) {knockbackDir.x *= 1.1;knockbackDir.y *= 1.1;}
						if (knockbackDir.x >= 20) {knockbackDir.x = 20;} else {if (knockbackDir.x >= 11) {knockbackDir.x = 20;} else {knockbackDir.x = 0;}}
						if (knockbackDir.y >= 20) {knockbackDir.y = 20;} else {if (knockbackDir.y >= 11) {knockbackDir.y = 20;} else {knockbackDir.y = 0;}}
						if (bulletList[i].byx < 0) {knockbackDir.x *= -1;}
						if (bulletList[i].byy < 0) {knockbackDir.y *= -1;}

						knockToPos.x = playersInformation[z].x + knockbackDir.x;
						knockToPos.y = playersInformation[z].y + knockbackDir.y;

						var hasland = false;
						for (var k = 0; k < landlist.length; k++) {
							if ((landlist[k].x == knockToPos.x) && (landlist[k].y == knockToPos.y)) {
								hasland = true;
								break;
							}
						}
						if (hasland) {
							var hasblock = false;
							for (var j = 0; j < blockInformation.length; j++) {
								if ((blockInformation[j].x == knockToPos.x) && (blockInformation[j].y == knockToPos.y)) {
									hasblock = true;
								}
							}
							for (var j = 0; j < coreInformation.length; j++) {
								if ((coreInformation[j].x == knockToPos.x) && (coreInformation[j].y == knockToPos.y)) {
									hasblock = true;
								}
							}
							if (hasblock) {
								knockToPos.x = playersInformation[z].x;
								knockToPos.y = playersInformation[z].y;
							}
						} else {
							playersInformation[z].hp = 0;
						}
						var same = false;
						if ((playersInformation[z].x == knockToPos.x) && (playersInformation[z].y == knockToPos.y)) {
							same = true;
						}
						playersInformation[z].x = knockToPos.x;
						playersInformation[z].y = knockToPos.y;
						var animationInfo = {
							x: playersInformation[z].x,
							y: playersInformation[z].y
						}
						io.emit('animation', animationInfo);
						var data = {
							id: playersInformation[z].id,
							x: knockToPos.x,
							y: knockToPos.y
						}
						io.emit('tp', data);
						playersInformation[z].hp -= bulletList[i].bulletsize;
						//console.log(bulletList[i].bulletsize);
						if (playersInformation[z].hp <= 0) {
							if (same) {
								killPlayer(playersInformation[z].id, 0);
							} else {
								if (typeof playersInformation[z] != 'undefined') {
									killPlayer(playersInformation[z].id, 500);
								}
							}
							var killerIndex = socketIDlist.indexOf(bulletList[i].id);
							playersInformation[killerIndex].kills += 1;
						}
						killbullet(bulletList[i].no, i);
						bulletAlive = false;
						break;
					}
				}
			}
		}
		if (bulletAlive) {
			for (var z = 0; z < coreInformation.length; z++) {
				if (coreInformation[z].team != bulletList[i].team) {
					var bux = coreInformation[z].x;
					var buy = coreInformation[z].y;
					var minuser = 5;
					if ((mex - 35 + minuser < bux) && (mex + 15 - minuser > bux) && (mey - 35 + minuser < buy) && (mey + 15 - minuser > buy)) { // right, left
						////console.log('collision');
						var animationInfo = {
							x: coreInformation[z].x,
							y: coreInformation[z].y
						}
						io.emit('animation', animationInfo);
						coreInformation[z].hp -= bulletList[i].bulletsize;
						//console.log(bulletList[i].bulletsize);
						if (coreInformation[z].hp <= 0) {
							var data = {
								x: coreInformation[z].x,
								y: coreInformation[z].y,
								team: coreInformation[z].team
							}
							io.emit('killcore', data);
							coreInformation.splice(z, 1);
						}
						killbullet(bulletList[i].no, i);
						bulletAlive = false;
						break;
					}
				}
			}
		}
	}
}, 33);

var checkVictoryInterval = setInterval(function() {
	if (serverIsRestarting == false) {
		var lightgreenHasCore = false;
		var orangeHasCore = false;
		for (var i = 0; i < coreInformation.length; i++) {
			if (coreInformation[i].team == 'lightgreen') {
				lightgreenHasCore = true;
			}
			if (coreInformation[i].team == 'orange') {
				orangeHasCore = true;
			}
		}
		if (orangeHasCore == false) {
			io.emit('victory', 'lightgreen');
			//console.log('lightgreen won!');
			resetData(5000);
		}
		if (lightgreenHasCore == false) {
			io.emit('victory', 'orange');
			//console.log('orange won!')
			resetData(5000);
		}
	}
}, 500);

var removeOldBulletsInterval = setInterval(function() {
	var noofBullets = bulletList.length;
	while (noofBullets > 0) {
		noofBullets--;
		for (var i = 0; i < bulletList.length; i++) {
			var diffX = (bulletList[i].startx - bulletList[i].mex); if (diffX < 0) {diffX *= -1}
			var diffY = (bulletList[i].starty - bulletList[i].mey); if (diffY < 0) {diffY *= -1}
			if ((diffX > bulletList[i].range) || (diffY > bulletList[i].range)) {
				killbullet(bulletList[i].no, i);
			}
			break;
		}
	}
}, 100);

var beginGameInterval = setInterval(function() {
	if (playersInformation.length >= 4) {
		if (gameStartCountdown > 1) {
			gameStartCountdown -= 1;
		} else {
			gameStarted = true;
		}
	} else {
		gameStartCountdown = 11;
	}
	io.emit('start', {bool: gameStarted, no: playersInformation.length, cd: gameStartCountdown});
}, 1000);