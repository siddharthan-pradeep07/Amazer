# Hello!
# Welcome to the instruction guide for using Amazer. #

## About: Amazer is a web platfrom, for analizing the mazes for micro-mouse competion. ##

### Micro-mouse: It is a robotic mouse that solves a maze. (Reference: Take a look at the video by veritasium in youtube) [View video](https://youtu.be/ZMQbHMgK2rw?si=y8FAdEtewEqJMsnd) ###

## Website Usage instructions: ##
  1. generate a maze, by clicking the generate maze button. 
  2. If you have a custom maze, You can click the "clear walls" button and start making a maze from scratch by clicking the wall/way. 
  3. After you have a proper maze, you can click the "find path(shortest)" button to find the shortest path denoted using (yellow)
  4. Then the program draws the shortest possible line from the start(green) to finish(4x red)
  5. you can click the "generate raw code" button to generate a raw direction info. and a piece of       micro-mouse code.

   Raw file Example: 
     ``` 1. Straight
         2. Right
         3. Straight
         4. Straight
         5. Left
            ........ ```

    Code file: The code file is written in C++, Custom genearted based on the path.
               Code(piece) works for micromouses made using esps, and arduinos.
    
  6. Toggle between Code / Raw. to view files.
  7. Click the "copy" button to copy the Code / Raw file. 
  8. Add it in your micromouse code to make it follow the exact path to finish.
  9. View the Data:
       
    ```1. total number of cells covered by the path.
       2. no. of right turns
       3. no. of left turns
       4. no. of strights ```

## Sample micromouse code: ##

```//                                             CODE BY SIDDHARTHAN
const int trigLeft  = 4,  echoLeft  = 2;
const int trigFront = 5,  echoFront = 18;
const int trigRight = 19, echoRight = 21;
const int STBY = 15;
const int AIN1 = 22, AIN2 = 23, PWMA = 27;
const int BIN1 = 33, BIN2 = 32, PWMB = 14;

const int WALL_THRESHOLD    = 14;
const int FRONT_STOP        = 12;
const int FRONT_SATURATED   = 4;

const int BASE_SPEED        = 240;
const int TURN_TRIGGER_DIST = 3;

const int TURN_SPEED        = 240;
const int POST_TURN_NUDGE   = 900;
const int PRE_TURN_NUDGE    = 1050;
const int SPIN_90_MS        = 690;
const int SPIN_180_MS       = 1380;
const int POST_UTURN_BACK   = 1000;

const int KP             = 6;
const int MAX_CORRECTION = 60;
const int LEFT_TARGET    = 7;
const int RIGHT_TARGET   = 7;

const int LEFT_LOCKOUT_CYCLES = 6;
int leftLockout = 0;

// ---------------------------------------------------------------
// Median filter ultrasonic read
// ---------------------------------------------------------------
long getDistance(int trigPin, int echoPin) {
  long readings[5];
  for (int i = 0; i < 5; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    long duration = pulseIn(echoPin, HIGH, 30000);
    readings[i] = (duration == 0) ? 999 : duration * 0.034 / 2;
    delay(5);
  }
  for (int i = 0; i < 4; i++)
    for (int j = i + 1; j < 5; j++)
      if (readings[j] < readings[i]) {
        long tmp = readings[i];
        readings[i] = readings[j];
        readings[j] = tmp;
      }
  return readings[2];
}

// ---------------------------------------------------------------
// Motor control
// ---------------------------------------------------------------
void motorA(int speed) {
  digitalWrite(AIN1, speed > 0 ? HIGH : LOW);
  digitalWrite(AIN2, speed > 0 ? LOW : HIGH);
  analogWrite(PWMA, abs(speed));
}
void motorB(int speed) {
  digitalWrite(BIN1, speed > 0 ? HIGH : LOW);
  digitalWrite(BIN2, speed > 0 ? LOW : HIGH);
  analogWrite(PWMB, abs(speed));
}
void stopMotors() { motorA(0); motorB(0); }

void driveForward() {
  motorA(BASE_SPEED);
  motorB(BASE_SPEED);
}

void moveForwardSelfStabilize(long distLeft, long distRight) {
  int error = 0;
  bool hasLeft  = (distLeft  < WALL_THRESHOLD);
  bool hasRight = (distRight < WALL_THRESHOLD);
  if (hasLeft && hasRight)   error = (int)(distRight - distLeft);
  else if (hasLeft)          error = LEFT_TARGET  - (int)distLeft;
  else if (hasRight)         error = (int)distRight - RIGHT_TARGET;
  int correction = constrain(error * KP, -MAX_CORRECTION, MAX_CORRECTION);
  motorA(BASE_SPEED - correction);
  motorB(BASE_SPEED + correction);
}

void nudge(int ms) {
  driveForward();
  delay(ms);
  stopMotors();
  delay(80);
}

void nudgeBack(int ms) {
  motorA(-BASE_SPEED);
  motorB(-BASE_SPEED);
  delay(ms);
  stopMotors();
  delay(80);
}

void spinLeft(int ms) {
  motorA(-TURN_SPEED);
  motorB(TURN_SPEED);
  delay(ms);
  stopMotors();
  delay(100);
}
void spinRight(int ms) {
  motorA(TURN_SPEED);
  motorB(-TURN_SPEED);
  delay(ms);
  stopMotors();
  delay(100);
}

bool isFrontBlocked(long d) {
  return (d <= FRONT_STOP) || (d <= FRONT_SATURATED);
}

// ---------------------------------------------------------------
// Single fast read — no median, used only for turn decisions
// where we need a quick fresh sample
// ---------------------------------------------------------------
long quickDist(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long dur = pulseIn(echoPin, HIGH, 30000);
  return (dur == 0) ? 999 : dur * 0.034 / 2;
}

// ---------------------------------------------------------------
// At a junction, take 5 quick reads and return true if
// the majority (3+) show open. Fast but noise-resistant.
// ---------------------------------------------------------------
bool isOpenMajority(int trigPin, int echoPin) {
  int openCount = 0;
  for (int i = 0; i < 5; i++) {
    if (quickDist(trigPin, echoPin) >= WALL_THRESHOLD) openCount++;
    delay(8);
  }
  return openCount >= 3;
}

// ---------------------------------------------------------------
// Turn routines — nudge is done BEFORE calling these
// ---------------------------------------------------------------
void turnLeft() {
  spinLeft(SPIN_90_MS);
  nudge(POST_TURN_NUDGE);
  leftLockout = LEFT_LOCKOUT_CYCLES;
}

void turnRight() {
  spinRight(SPIN_90_MS);
  nudge(POST_TURN_NUDGE);
  leftLockout = LEFT_LOCKOUT_CYCLES;
}

void turnAround() {
  spinRight(SPIN_180_MS);
  nudgeBack(POST_UTURN_BACK);
  nudge(POST_TURN_NUDGE);
  leftLockout = LEFT_LOCKOUT_CYCLES;
}

// ---------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  pinMode(trigLeft,  OUTPUT); pinMode(echoLeft,  INPUT);
  pinMode(trigFront, OUTPUT); pinMode(echoFront, INPUT);
  pinMode(trigRight, OUTPUT); pinMode(echoRight, INPUT);
  pinMode(STBY, OUTPUT);
  pinMode(AIN1, OUTPUT); pinMode(AIN2, OUTPUT); pinMode(PWMA, OUTPUT);
  pinMode(BIN1, OUTPUT); pinMode(BIN2, OUTPUT); pinMode(PWMB, OUTPUT);
  pinMode(13, OUTPUT);
  digitalWrite(STBY, HIGH);
  delay(2000);
  digitalWrite(13, HIGH); delay(500);
  digitalWrite(13, LOW);  delay(500);
}

// ---------------------------------------------------------------
// LOOP — strict left-hand wall following
//
// IMPORTANT: turnAround() is only called after the robot has
// physically stopped at the front wall AND re-confirmed with
// isOpenMajority() that BOTH left and right are truly closed.
// ---------------------------------------------------------------
void loop() {
  long distLeft  = getDistance(trigLeft,  echoLeft);
  long distFront = getDistance(trigFront, echoFront);
  long distRight = getDistance(trigRight, echoRight);

  Serial.printf("L:%ld F:%ld R:%ld Lock:%d\n", distLeft, distFront, distRight, leftLockout);

  bool frontWall = isFrontBlocked(distFront);
  bool leftWall  = (distLeft  < WALL_THRESHOLD);
  bool rightWall = (distRight < WALL_THRESHOLD);

  if (leftLockout > 0) leftLockout--;

  // -------------------------------------------------------
  // 1. LEFT OPEN — highest priority (left-hand rule)
  //    Only fires when lockout has fully expired
  // -------------------------------------------------------
  if (!leftWall && leftLockout == 0) {
    if (isOpenMajority(trigLeft, echoLeft)) {
      nudge(PRE_TURN_NUDGE);
      turnLeft();
    } else {
      moveForwardSelfStabilize(distLeft, distRight);
    }
  }

  // -------------------------------------------------------
  // 2. FRONT CLEAR — go straight
  // -------------------------------------------------------
  else if (!frontWall) {
    moveForwardSelfStabilize(distLeft, distRight);
  }

  // -------------------------------------------------------
  // 3. FRONT BLOCKED — stop, nudge to junction centre,
  //    then do a FRESH majority read on ALL three sensors
  //    before deciding. U-turn is absolute last resort.
  // -------------------------------------------------------
  else {
    stopMotors();
    delay(100);
    nudge(PRE_TURN_NUDGE);
    stopMotors();
    delay(150); // settle before reading

    // Fresh majority reads on all sides
    bool leftOpen  = isOpenMajority(trigLeft,  echoLeft);
    bool rightOpen = isOpenMajority(trigRight, echoRight);
    bool frontOpen = !isFrontBlocked(getDistance(trigFront, echoFront));

    Serial.printf("  Junction: L=%d F=%d R=%d\n", leftOpen, frontOpen, rightOpen);

    if (leftOpen) {
      // Left available — always prefer left (left-hand rule)
      turnLeft();
    } else if (frontOpen) {
      // Front somehow cleared after nudge — go straight
      leftLockout = LEFT_LOCKOUT_CYCLES;
      nudge(POST_TURN_NUDGE);
    } else if (rightOpen) {
      // Right available
      turnRight();
    } else {
      // All three sides confirmed closed by majority vote — true dead end
      turnAround();
    }
  }

  delay(50);
}
