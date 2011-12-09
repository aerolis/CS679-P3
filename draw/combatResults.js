function combatResults(){
	this.active = false;
	this.buttons = new buttonset();
	this.x = canvas.width /2 - 200;
	this.y = canvas.height/2 - 200;
	
			
}

combatResults.prototype.draw = function(){
	ctx.drawImage(img.combat_background,this.x,this.y);
	
	//draw title
	ctx.fillStyle = 'white';
	ctx.font = "16pt Calibri";	
	ctx.fillText("Combat Results",this.x+135,this.y+40);	
	
	//fill in other combat results here
	
	
	this.buttons.draw();
}

combatResults.prototype.show = function(){
	this.buttons.addButton(this.x + 100, this.y + 300, 200, 50, '#657383', "OK", buttonType.RemoveCR);	
	this.active = true;	
}

combatResults.prototype.hide = function(){
	this.active = false;
	this.buttons.clear();
}