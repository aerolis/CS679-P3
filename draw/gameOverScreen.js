// JavaScript Document

function GameOverScreen(){
	this.active = false;
	this.buttons = new buttonset();
	this.x = canvas.width /2 - 200;
	this.y = canvas.height/2 - 200;
	
	
	this.buttons.addButton(this.x + 100, this.y + 300, 200, 50, '#657383', "OK", buttonType.RemoveGO);
	
}

GameOverScreen.prototype.draw = function(){
	ctx.drawImage(img.combat_background,this.x,this.y);
	
	//draw title
	ctx.fillStyle = 'white';
	ctx.font = "16pt Calibri";	
	ctx.fillText("A player died...", this.x+135,this.y+40);	
	
	//fill in other combat results here
	ctx.font = "12pt Calibri";	
	ctx.fillText("Someone sadly perished.", this.x+20, this.y+80);
	ctx.fillText("That means the following players are now dead: ", this.x+20, this.y+100);
	var yLoc = this.y + 130;
	
	var notDead;
	for(i = 0; i < players.length; i++) {
		if (players[i].gameOver){
			ctx.fillText(findName(i), this.x + 20, yLoc);
			yLoc += 20;	
		}
		else {
			notDead = i;	
		}
	}
	
	if (gameFinished){
		ctx.fillText("That means " + findName(i) + " won! Congratulations!", this.x + 20, this.y + 250);
	}
	else{
		yLoc += 20;
		ctx.fillText("These players are still in the race: ", this.x+20, yLoc);
		for(i = 0; i < players.length; i++) {
			if (!players[i].gameOver){
				ctx.fillText(findName(i), this.x + 20, yLoc);
				yLoc += 20;	
			}
		}
	}
	
	this.buttons.draw();
}