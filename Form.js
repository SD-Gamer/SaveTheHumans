class Form{
    constructor(){
         this.input = createInput("").attribute("placeholder","name");
         this.button = createButton("play");
         this.greeting = createElement("h3");
         this.title = createElement("h2");
         this.leaderBoard = createButton("leaderBoard");
    }
    display(){
        this.title.html("Save the Humans");
        this.title.position(width / 2 - 50,0);
        this.input.position(width /2 - 40,height /2 - 80);
        this.button.position(width /2 + 30,height /2);
        this.button.mousePressed(() => {
            this.input.hide();
            this.button.hide();
            playerName = this.input.value();
            var curDate = new Date();
            this.greeting.html("Hello " + playerName);
            this.greeting.position(width /2 - 70,height /4);
            var playerIndex = "players/player" + playerName;
            database.ref(playerIndex).set({
                name:playerName,
                date:curDate.getDate() + "/" + curDate.getMonth() + "/" + curDate.getFullYear(),
                score:0
            })
        })
        this.leaderBoard.position(width /2,20);
        this.leaderBoard.mousePressed(()=>{
        })
    }
    hide(){
        this.greeting.hide();
        this.button.hide();
        this.input.hide();
    }
    updateScore(finalScore){
        var playerIndex = "players/player" + playerName;
        database.ref(playerIndex).update({
            score:finalScore
        })
    }
}