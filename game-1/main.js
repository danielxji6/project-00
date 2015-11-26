// wait for DOM to load before running JS
console.log("Loaded!");

var img1 = '<img class="car1 img-responsive" src="./img/car1.png">';
var img2 = '<img class="car2 img-responsive" src="./img/car2.png">';
var positionOne = 1;
var positionTwo = 1;
var paused = false;
var boxLoc = [];

$(function() {
  // inital
  $('.box:eq('+ 0 +')').append(img1);
  $('.box:eq('+ 0 +')').append(img2);
  $('.fa').hide();
  $('.reset').on("click", function handleButton() {
    reset();
  });
  for (var i = 0; i < $('.box').length; i++) {
    if (i > 12 && i < 23) {
      boxLoc[i] = '.box:eq('+ (35 - i) +')';
    } else {
      boxLoc[i] = '.box:eq('+ i +')';
    }
  }

  $(document).keypress(function (ele) {
    if(ele.keyCode === 113) { // if Q pressed
      draw(1, positionOne);
    } else if(ele.keyCode === 112) { // if P pressed
      draw(2, positionTwo);
    } else if(ele.keyCode === 98) { //if space pressed
      pausedCheck();
    }
  });
});



function draw(player, position) {
  if(paused) {
    // do nothing
  } else if(player === 1 && position < 36) {
    positionOne += 1;
    $('img').remove('.car1');
    $(boxLoc[position]).append(img1);
    winnerCheck();
  } else if(player === 2 && position < 36) {
    positionTwo += 1;
    $('img').remove('.car2');
    $(boxLoc[position]).append(img2);
    winnerCheck();
  }
  if (position > 10 && position < 23) {
    $('.car' + player).addClass('flipped');
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
  $('.winner').html('Let\'s race! <i class="fa fa-pause"></i>');
  $('.fa').hide();
  paused = false;
  positionOne = 1;
  positionTwo = 1;
}
