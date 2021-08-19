var canvas = document.getElementById("myCanvas"); //Targets canvas
var context = canvas.getContext("2d"); //Allows you to draw on canvas

var x = canvas.width / 2; //Starting position of ball
var y = canvas.height - 30;
var dx = 3; //Distance ball moves each interval
var dy = -3;
var ballRadius = 25;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 3;
var paused = false;
var levelUp_Prob = 0.1;
var ball = new Image();
ball.src = "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png";
var brickImage = new Image();
brickImage.src = "assets/100USD.png";
var extraLifeImage = new Image();
extraLifeImage.src = "assets/plus-one.png";

var bricks = []; //Empty array to hold array of array with object --- ie, [col][row] {x: 0, y: 0, status: 1}
initBricks();
function initBricks() {
  for (col = 0; col < brickColumnCount; col++) {
    bricks[col] = []; //Loops through 5 columns
    for (row = 0; row < brickColumnCount; row++) {
      bricks[col][row] = { x: 0, y: 0, status: 1 }; //Loops through 3 rows for each column iteration
    }
  }
}

document.addEventListener("keydown", keyDownHandler); //keydown event fired when key pressed
document.addEventListener("keyup", keyUpHandler); //keyup event fired when key released

function drawBricks() {
  for (col = 0; col < brickColumnCount; col++) {
    for (row = 0; row < brickRowCount; row++) {
      if (bricks[col][row].status == 1) {
        var brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[col][row].x = brickX;
        bricks[col][row].y = brickY;
        context.drawImage(brickImage, brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function extraLifeBonus() {
  if (Math.random() <= levelUp_Prob) {
    lives += 1;
    context.drawImage(
      extraLifeImage,
      canvas.width / 2,
      canvas.height / 1.5,
      ballRadius * 2,
      ballRadius * 2
    );
    paused = true;
    setTimeout(function () {
      paused = false;
      draw();
    }, 500);
  }
}

//keyCode property holds keyboard key info. (ie, 39 is the Key Code for Right Arrow button)
function keyDownHandler(e) {
  switch (e.keyCode) {
    case 39:
      rightPressed = true;
    case 37:
      leftPressed = true;
  }
}

function keyUpHandler(e) {
  switch (e.keyCode) {
    case 39:
      rightPressed = false;
    case 37:
      leftPressed = false;
  }
}

function powerUp() {
  context.drawImage(plusOne, x, y, ballRadius, ballRadius);
}

function drawBall() {
  context.drawImage(ball, x, y, ballRadius, ballRadius); //Replaced values with variables, rather than hard code
}

function drawPaddle() {
  context.beginPath();
  context.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}

function collisionDetection() {
  for (col = 0; col < brickColumnCount; col++) {
    for (row = 0; row < brickRowCount; row++) {
      var b = bricks[col][row];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy; //Reverse coordinates if ball coordinates are inside of brick coordinates
          b.status = 0; //Changes brick status to 0 which will skip brick in draw()
          score++; //Adds point to score for each brick hit
          extraLifeBonus();
          if (score == brickRowCount * brickColumnCount) {
            if (level === maxLevel) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            } else {
              level++;
              //Initializes bricks for next level
              brickRowCount++; //Increase row count each level
              initBricks();
              score = 0;
              dx += 1; //Increases ball speed
              dy = -dy; //reverses ball direction for start of new round
              dy -= 1;
              x = canvas.width / 2;
              y = canvas.height - 30;
              paddleX = (canvas.width - paddleWidth) / 2;
              paused = true;
              context.beginPath();
              context.rect(0, 0, canvas.width, canvas.height);
              context.fillStyle = "#0095DD";
              context.fill();
              context.font = "16px Arial";
              context.fillStyle = "#FFFFFF";
              context.fillText(
                "Level " + (level - 1) + " completed, starting next level...",
                110,
                150
              );
              context.closePath();
              setTimeout(function () {
                paused = false;
                draw();
              }, 3000); // 3 sec
            }
          }
        }
      }
    }
  }
}

function drawScore() {
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel() {
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText("Level: " + level, 210, 20);
}

alert(
  "Use arrow keys to move paddle ⬅️ and ➡️." + "\n" + "\n" + "READY, SET GO!!!"
);

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height); //Clears canvas each interval
  drawBricks();
  drawBall(); //Draws ball
  drawPaddle(); //Draws paddle
  drawScore();
  drawLives();
  drawLevel();
  collisionDetection();

  if (y + dy < ballRadius) {
    dy = -dy; //Reverses ball Y coodinate direction, preventing leaving top of canvas
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      //🤯
      dy = -dy; //Reverses Y coordinate if paddle touched
    } else {
      lives--;
      if (!lives) {
        //lives at 0 equals 'false', ! operator changes to true
        alert("GAME OVER"); //Ends game if bottom of canvas touched
        document.location.reload(); //Reloads URL to reset ball
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2; //Resets ball and paddle position and direction b/c player has more lives remaining
      }
    }
  }

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  } //Revsers ball X coordinate direction, L & R

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  } //Moves paddle L & R as long as parameters met

  x += dx; //Moves ball
  y += dy;

  if (!paused) {
    requestAnimationFrame(draw); //executes draw again and again. This is called "RECURSION"  gives control of frame rate back to browser for smoother animation.
  }
}

draw();
