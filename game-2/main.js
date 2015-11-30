console.log("Loaded!");

// wait for DOM to load before running JS
$(function() {
  // inital condition
  var canvas1 = document.getElementById('ground1');
  var ctx1 = canvas1.getContext('2d');
  var canvas2 = document.getElementById('ground2');
  var ctx2 = canvas2.getContext('2d');
  var width = canvas1.width;
  var height = canvas1.height;
  var paused = false;
  var stop = false;
  $('.reset').on("click", function handleButton() {
    reset();
  });

  $(document).keydown(function (ele) {
    if(ele.keyCode === 39) { // if > pressed
      players[0].go = true;
    }
    if(ele.keyCode === 68) { // if D pressed
      players[1].go = true;
    }
    if(ele.keyCode === 38) { // if ^ pressed
      if(players[0].jumpHeight === 0) {
        players[0].jumping = true;
      }
    }
    if(ele.keyCode === 87) { // if W pressed
      if(players[1].jumpHeight === 0) {
        players[1].jumping = true;
      }
    }
    if(ele.keyCode === 80) { //if P pressed
      paused = !paused;
    }
  });

  $(document).keyup(function (ele) {
    if(ele.keyCode === 39) { // if Q pressed
      players[0].go = false;
    }
    if(ele.keyCode === 68) { // if P pressed
      players[1].go = false;
    }
    if(ele.keyCode === 98) { //if space pressed

    }
  });

  function winnerCheck() {
    //greetWinner
    for (var i = 0; i < players.length; i++) {
      if(players[i].rounds > 2) {
        stop = true;
        players[i].wins += 1;
        grounds[i].drawWin();
        console.log("Winner is Player" + i);
      }
    }
  }
  function reset() {
    pasued = false;
    stop = false;
    for (var i = 0; i < players.length; i++) {
      players[i].speed = 2;
      players[i].rounds = 0;
      grounds[i].offset = 801;
      grounds[i].coin.crashed = false;
    }
  }

  var Player = function (color, ctx) {
    this.ctx = ctx;
    this.color = color;
  	this.x = 20;
    this.y = 200;
    this.radius = 50;
    this.go = false;
    this.speed = 2;
    this.rounds = 0;
    this.jumping = false;
    this.jumpHeight = 0;
    this.jumpMax = 120;
    this.jumpSpeed = 3;
  	this.wins = 0;
  };

  Player.prototype = {
    drawPlayer: function () {
      this.jump();
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y-this.jumpHeight);
      ctx.beginPath();
      ctx.arc(this.radius,this.radius,this.radius,Math.PI/7,-Math.PI/7,false);
      ctx.lineTo(25,50);
      ctx.fill();
      ctx.restore();
    },
    jump: function () {
      if(this.jumping && this.jumpHeight < this.jumpMax) {
        this.jumpHeight += this.jumpSpeed;
      } else if(!this.jumping && this.jumpHeight !== 0) {
        this.jumpHeight -= this.jumpSpeed;
      } else {
        this.jumping = false;
      }
    }
  };

  var Ground = function (ctx) {
    this.ctx = ctx;
    this.color = "#00004d";
    this.offset = 801;
    this.coin = {
      color: "#FFFF00",
      radius: 12,
      x: 785,
      y: 250,
      hieight: 0,
      maxHeight: 170,
      crashed: false
    };
  };

  Ground.prototype = {
    drawGround: function () {
      var ctx  = this.ctx;
      ctx.strokeStyle = this.color;
      ctx.save();
      ctx.strokeRect(0,0,width,height);
      ctx.setLineDash([10, 3]);
      ctx.lineDashOffset = this.offset;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(800,300);
      ctx.stroke();
      ctx.restore();
    },
    drawText: function (wins, speed) {
      var ctx = this.ctx;
      ctx.save();
      ctx.font = "25px Arial";
      ctx.fillText("Wins: " + wins, 650, 50);
      ctx.fillText("Turbo > " + (speed*50), 300, 50);
      ctx.restore();
    },
    drawWin: function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = "#000000";
      ctx.translate(width/2, height/2);
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.font = "25px Arial";
      ctx.strokeText("Win!", -25, 10);
      ctx.restore();
    },
    drawCoin: function () {
      var ctx  = this.ctx;
      eatCoin();
      if(!this.coin.crashed) {
        ctx.save();
        ctx.fillStyle = this.coin.color;
        ctx.strokeStyle = "#000000";
        ctx.setTransform(1, 0, 0, 1.5, this.coin.x - this.offset, this.coin.y - this.coin.height);
        ctx.beginPath();
        ctx.arc(0, 0, this.coin.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.arc(0, 0, this.coin.radius/2, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fill("evenodd");
        ctx.restore();
      }
    }
  };

  function eatCoin(player, ground) {
    for (var i = 0; i < players.length; i++) {
      var coinX = grounds[i].coin.x - grounds[i].offset;
      var coinY = grounds[i].coin.y - grounds[i].coin.height;
      var playerX = players[i].x;
      var playerY = players[i].y - players[i].jumpHeight;
      if (playerX < coinX + grounds[i].coin.radius*2 &&
          playerX + players[i].radius*2 > coinX &&
          playerY < coinY + grounds[i].coin.radius*3 &&
          playerY + players[i].radius*2 > coinY) {
          grounds[i].coin.crashed = true;
      }
    }
  }

  var players = [];
  var grounds = [];

  players.push(new Player("#141414", ctx1));
  players.push(new Player("#080808", ctx2));
  grounds.push(new Ground(ctx1));
  grounds.push(new Ground(ctx2));

  function draw() {
    ctx1.clearRect(0, 0, width, height);
    ctx2.clearRect(0, 0, width, height);
    winnerCheck();
    for (var i = 0; i < players.length; i++) {
      if(grounds[i].offset > 800) {
        grounds[i].offset = 0;
        grounds[i].coin.height = Math.random() * grounds[i].coin.maxHeight ;
        players[i].rounds += 1;
        if(grounds[i].coin.crashed === true) { players[i].speed += 0.5; }
        grounds[i].coin.crashed = false;
      }
      if(players[i].go) {
        grounds[i].offset += (players[i].speed * 2);
      }
      players[i].drawPlayer();
      grounds[i].drawGround();
      grounds[i].drawText(players[i].wins, players[i].speed);
      grounds[i].drawCoin();
    }
  }

  function start() {
    if(!paused && !stop) {
      draw();
    }
    window.requestAnimationFrame(start);
  }
  start();
});
