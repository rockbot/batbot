 var five = require('johnny-five'),
     dualshock = require('dualshock-controller');

var board, lServo, rServo, ds;

ds = dualshock({
  config: 'dualShock3'
});

ds.on('error', function (data) {
  console.log('ruh roh something broke');
});

board = new five.Board({
  port: '/dev/tty.usbserial-AH00156H'
});

board.on("ready", function () {
  rServo = new five.Servo({
    pin: 10,
    type: 'continuous'
  });
  lServo = new five.Servo({
    pin: 11,
    type: 'continuous'
  });

  lServo.stop();
  rServo.stop();

  var moveSpeed = 0.1;

  function stop() {
    lServo.stop();
    rServo.stop();
  }

  function turn (rightOn, leftOn, timeout) {
    if (rightOn) {
      rServo.cw(moveSpeed);
    } else {
      rServo.ccw(moveSpeed);
    }

    if (leftOn) {
      lServo.ccw(moveSpeed);
    } else {
      lServo.cw(moveSpeed);
    }

    if (timeout) {
      setTimeout(stop, timeout);
    }
  }

  function turnLeft (timeout) {
    console.log('turning left!');
    turn (false, true, timeout);
  }

  function turnRight (timeout) {
    console.log('turning right!');
    turn (true, false, timeout);
  }

  function goStraight (timeout) {
    console.log('going straight!');
    turn (true, true, timeout);
  }

  function goBack (timeout) {
    console.log('back it up!');
    turn (false, false, timeout);
  }

  ds.on('square:press', function () {
    turnLeft();
  });

  ds.on('square:release', function () {
    stop();
  });

  ds.on('circle:press', function () {
    turnRight();
  });

  ds.on('circle:release', function () {
    stop();
  });

  ds.on('triangle:press', function () {
    goStraight();
  });

  ds.on('triangle:release', function () {
    stop();
  });

  ds.on('x:press', function () {
    goBack();
  });

  ds.on('x:release', function () {
    stop();
  });

});

ds.connect();
