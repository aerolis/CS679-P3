function combatResults(){
	this.active = false;
	this.buttons = new buttonset();
	this.x = canvas.width /2 - 200;
	this.y = canvas.height/2 - 200;
	
			
}

combatResults.prototype.draw = function(){
	ctx.fillStyle = '#34282C';
	ctx.fillRect(this.x, this.y, 400, 350);
	//ctx.fillStyle = 'red';
	//ctx.fillRect(0,0,700,700);
	
	this.buttons.draw();
}

combatResults.prototype.show = function(){
	this.buttons.addButton(this.x + 100, this.y + 250, 200, 50, '#657383', "OK", buttonType.RemoveCR);	
	this.active = true;	
}

combatResults.prototype.hide = function(){
	this.active = false;
	this.buttons.clear();
}