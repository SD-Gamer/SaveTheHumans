const LEVEL1 = 1;
const LEVEL2 = 2;
const LEVEL3 = 3;
const START = 0;
const END = 100;

var score = 0;
var boy , tower;
var boyImg,towerImg,zombieImg;
var lifes = 3;
var gameState = START;
var spearMoving = false;
var savedHumans = 0;
var database,form,playerName;
var boyImg,towerImg,zombieImg,spearImg,bgImg,goal1Img,ledgeImg;

function preload(){
  boyImg = loadImage("boy.png");
  towerImg = loadImage("tower.png");
  zombieImg = loadImage("Zombie.png");
  spearImg = loadImage("spear.png");
  bgImg = loadImage("jungle.jpg");
  goal1Img = loadImage("goal1.png");
  ledgeImg = loadImage("ledge.png");
  walkingMan = loadImage("walkingMan.png");
}

function setup() {
  createCanvas(800,800);

  score = 0;

  database = firebase.database();

  tower = createSprite(400,400,1200,1200);
  tower.addImage(towerImg);
  tower.scale = 1.4;

  boy = createSprite(400,400);
  boy.addImage("boy",boyImg);
  boy.scale = 0.7;
  boy.debug = true;

  form = new Form();

  spear = createSprite(boy.x + 10,boy.y-5,20,10);
  spear.velocityY = 0;  
  spear.shapeColor = "red";
  spear.addImage(spearImg)

  startingLedge = createSprite(400,500,100,20);
  startingLedge.addImage(ledgeImg);

  zombieG = createGroup();
  stonesG = createGroup();
  ledgeG = createGroup();
  movingStonesG = createGroup();

  goal1 = createSprite(400,50,200,200);
  goal1.addImage(goal1Img);
  goal1.velocityX = 10;
  goal1.visible = false;

  edges = createEdgeSprites();

  createObjectsForLevel2();
}

function draw() {
  background("blue");
  if(gameState === START){
     boy.velocityY = 0;
     form.display();
     //  text("write about the game");
     drawSprites();
     text("Press space to start",300,400);
     if(keyDown("space")){
        gameState = LEVEL2;
        startingLedge.destroy();
      }
   }
  if(gameState === LEVEL1){
     if(frameCount > 1000){
        goal1.visible = true;
        goal1.x = 300;
        goal1.y = 50;
        console.log(frameCount);
      }
     tower.velocityY = 1;
     goal1.bounceOff(edges);
     if(tower.y > 500) 
        tower.y = 400;

     if(keyDown(LEFT_ARROW)){
        boy.x -= 5;
        spear.x = boy.x + 10;
       }
     if(keyDown(RIGHT_ARROW)){
        boy.x += 5;
        spear.x = boy.x + 10;
      }
      if(keyDown("space") && boy.y >= 100){
         boy.velocityY =- 10;
         spear.y = boy.y - 5;
      }
      boy.velocityY += 2;
      
      spawnZombiesAndStones();
      spawnLedges();

      if(stonesG.isTouching(boy)){
         for(var i = 0; i < stonesG.length; i++){
             if (stonesG[i].isTouching(boy)){
                 stonesG[i].velocityY = 5;
                 movingStonesG.add(stonesG[i]);
             }
         }
      }
      if(boy.isTouching(movingStonesG)){
         score = score - 5;
      }
      if(keyDown("s") && spear.velocityY === 0){
         spear.velocityY = -15;
         spearMoving = true;
      }
      if(spear.y < 0){
         spear.x = boy.x + 10;
         spear.y = boy.y - 5;
         spear.velocityY = 0;
      }
      if(spear.isTouching(zombieG) && spearMoving){
         score += 10; 
         for(var i = 0; i < zombieG.length;i++){
             if(spear.isTouching(zombieG[i])){
                zombieG[i].destroy();
             }
         }
      }
      boy.bounceOff(zombieG);

      if(spear.isTouching(stonesG) && spearMoving){
         score += 5;
         for(var i = 0;i < stonesG.length;i++){
             if(spear.isTouching(stonesG[i])){
                stonesG[i].destroy();
             }
         }
      }
      if(boy.isTouching(ledgeG)){
         boy.velocityY = 0;
      }
      if(boy.isTouching(goal1) && goal1.visible){
         gameState = LEVEL2;
         stopEverything1();
         boy.velocityY = 0;
         boy.velocityX = 0;
         goal1.velocityX = 0;
         drawSprites();
         text("Congratulations! You passed Level 1",300,400);
         zombieG.destroyEach();
         stonesG.destroyEach();
         ledgeG.destroyEach();
         movingStonesG.destroyEach();
         spear.destroy();
         goal1.destroy();
         tower.visible = false;
         savedHumans = 0;
      }
      if(boy.y > 800){
         gameState = END;
      }
  }  
  else if(gameState === LEVEL2){
          bg.visible = true;
          bg.velocityX = -4;
          boy.depth = bg.depth + 1;
          boy.x = 100;
          boy.y = 700;

          ground.velocityX = -4;
          if(bg.x < 0){
             bg.x = bg.width/2;
          }
          if(ground.x < 0){
             ground.x = ground.width/2;
         }
         if(keyDown("space")){
            boy.velocityY = -5;
         }
         boy.velocityY += 1;
         boy.collide(ground);

         spawnZombiesOnly();
         spawnHumans();
         if(boy.isTouching(humansG)){
            savedHumans += 1;
            score += 50;
            for(var i = 0;i < humansG.length;i++){
                if(boy.isTouching(humansG[i])){
                   humansG[i].destroy();
               }
            }
         }
         if(zombieG.isTouching(humansG)){
            for(var i = 0;i < humansG.length; i++){
                if(zombieG.isTouching(humansG[i])){
                   humanToZombie = createSprite(humansG[i].x,humansG[i].y)
                   humanToZombie.addImage(zombieImg);
                   humanToZombie.scale = 0.5;
                   humanToZombie.velocityX = -4;
                   humanToZombie.lifetime = 800;
                   zombieG.add(humanToZombie);
                 }
            }
         }
         if(boy.isTouching(zombieG)){
            gameState = END;
         }
  }
  else if(gameState === END){
     tower.velocityY = 0;
     stopEverything1();
     drawSprites();
     textSize(50);
     fill("yellow");
     text("Game Over",300,400);
     form.updateScore(score);
  }
  drawSprites();

  fill("yellow")
  textSize(20);
  text("LEVEL: " + gameState,650,50);
  text("Score: " + score,650,80);
  if(savedHumans > 0){
     fill("yellow")
     textSize(20);
     text("Humans Saved: " + savedHumans,600,110);
  }
}

function spawnZombiesAndStones(){
  if(frameCount % 200 === 0){
     var zombie = createSprite(random(50,750),0,25,50);
     zombie.addImage(zombieImg)
     zombie.scale = 1;
     zombie.velocityY  = 1;
     zombie.lifeTime = 800;
     zombieG.add(zombie)
     var stone = createSprite(zombie.x + 10,zombie.y,25,50);
     //add image and scale
     stone.velocityY  = 1;
     stone.lifeTime = 800;
     stone.setCollider("rectangle",0,0,100,200);
     stonesG.shapeColor = "yellow";
     stonesG.add(stone)
  }
}

function spawnLedges(){
   if(frameCount % 300 === 0){
      var ledge = createSprite(random(100,700),0,100,20);
      ledge.addImage(ledgeImg);
      ledge.velocityY = 1;
      ledge.lifetime = 800;
      ledge.shapeColor = "black";
      ledgeG.add(ledge);
   }
}

function stopEverything1(){
   ledgeG.setVelocityYEach(0);
   stonesG.setVelocityYEach(0);
   zombieG.setVelocityYEach(0);
   boy.setVelocity(0,0);
   tower.velocityY = 0;

   ledgeG.setLifetimeEach (-1);
   stonesG.setLifetimeEach (-1);
   zombieG.setLifetimeEach (-1);
   humansG.setLifetimeEach(-1);
}

function createObjectsForLevel2(){
    bg = createSprite(400,400);
    bg.x = bg.width/2;
    bg.visible = false;
    bg.addImage(bgImg);
    bg.scale = 1.5;

    ground = createSprite(400,700,800,20);
    ground.x = ground.width/2;
    ground.visible = false;

    savedHumans = 0;
    humansG = createGroup();

}
function spawnZombiesOnly(){
   if(frameCount % 200 === 0){
      var zombie = createSprite(random(50,750),0,25,50);
      zombie.addImage(zombieImg)
      zombie.scale = 1;
      zombie.velocityY  = 2;
      zombie.lifeTime = 800;
      zombieG.add(zombie)
   }
}

function spawnHumans(){
   if(frameCount % 200 === 0){
      var human = createSprite(800,700,25,50);
      human.addImage(walkingMan);
      human.scale = 1;
      human.velocityX  = -6;
      human.lifeTime = 800;
      human.shapeColor = "blue";
      humansG.add(human)
   }
}