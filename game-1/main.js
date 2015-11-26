// wait for DOM to load before running JS
console.log("Loaded!");

var img1 = '<img class="car1 img-responsive" src="./img/car1.png">';
var img2 = '<img class="car2 img-responsive" src="./img/car2.png">';
var positionOne = 1;
var positionTwo = 1;
var paused = false;

$(function() {
  // inital
  $('.box:eq('+ 0 +')').append(img1);
  $('.box:eq('+ 0 +')').append(img2);
  $('.fa').hide();

  $('.reset').on("click", function handleButton() {
    reset();
  });
});

$(document).keypress(function (ele) {
  if(ele.keyCode === 113) { // if Q pressed
    draw(1, positionOne);
  } else if(ele.keyCode === 112) { // if P pressed
    draw(2, positionTwo);
  } else if(ele.keyCode === 32) { //if space pressed
    pausedCheck();
  }
  winnerCheck();
});


function draw(player, position) {
  if(paused) {
    // do nothing
  } else if(player === 1 && position < 36) {
    positionOne += 1;
    $('img').remove('.car1');
    $('.box:eq('+ position +')').append(img1);
    winnerCheck();
  } else if(player === 2 && position < 36) {
    positionTwo += 1;
    $('img').remove('.car2');
    $('.box:eq('+ position +')').append(img2);
    winnerCheck();
  }
}

function winnerCheck() {
  if(positionOne === 36) {
    $('.winner').text("The winner is Car1");
  } else if(positionTwo === 36) {
    $('.winner').text("The winner is Car2");
  }
}

function pausedCheck() {
  paused = !paused;
  $(".fa").toggle();
}


function reset() {
  $('img').remove();
  $('.box:eq('+ 0 +')').append(img1);
  $('.box:eq('+ 0 +')').append(img2);
  paused = false;
  $('.fa').hide();
  positionOne = 1;
  positionTwo = 1;
}
