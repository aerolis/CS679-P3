function combatResults(){
	this.active = false;
	this.buttons = new buttonset();
	this.x = canvas.width /2 - 200;
	this.y = canvas.height/2 - 200;
	
	this.attacker = 0;
	this.defender = 0;
	this.winner = 0;
	this.startFleetA = 0;
	this.startFleetD = 0;
	this.winFleet = 0;
	
	
	this.buttons.addButton(this.x + 100, this.y + 300, 200, 50, '#657383', "OK", buttonType.RemoveCR);	
			
}

combatResults.prototype.draw = function(){
	ctx.drawImage(img.combat_background,this.x,this.y);
	
	//draw title
	ctx.fillStyle = 'white';
	ctx.font = "16pt Calibri";	
	ctx.fillText("Combat Results",this.x+135,this.y+40);	
	
	//fill in other combat results here
	ctx.font = "12pt Calibri";	
	ctx.fillText("Player " + this.attacker + " attacked player " + this.defender + ".", this.x+20, this.y+80);
	ctx.fillText("Player " + this.winner + " won!", this.x+20, this.y+100);
	
	ctx.fillText("Player " + this.attacker + " losses:", this.x + 20, this.y + 140);
	if (this.attacker == this.winner){
		//calc losses.
		var lines = createStringsFromTwoFleets(this.startFleetA, this.winFleet);
		var xLoc = this.x + 20;
		var yLoc = this.y + 160;
		for (var i = 0; i < lines.length; i++){
			ctx.fillText(lines[i], xLoc, yLoc);
			yLoc += 20;	
		}
	}
	else{
		//it's everything.	
		var lines = createStringsFromFleet(this.startFleetA);
		var xLoc = this.x + 20;
		var yLoc = this.y + 170;
		for (var i = 0; i < lines.length; i++){
			ctx.fillText(lines[i], xLoc, yLoc);
			yLoc += 20;	
		}
	}
	
	ctx.fillText("Player " + this.defender + " losses:", this.x + 220, this.y + 140);
	if (this.defender == this.winner){
		//calc losses.
		var lines = createStringsFromTwoFleets(this.startFleetA, this.winFleet);
		var xLoc = this.x + 220;
		var yLoc = this.y + 170;
		for (var i = 0; i < lines.length; i++){
			ctx.fillText(lines[i], xLoc, yLoc);
			yLoc += 20;	
		}
	}
	else{
		//it's everything.	
		var lines = createStringsFromFleet(this.startFleetD);
		var xLoc = this.x + 220;
		var yLoc = this.y + 160;
		for (var i = 0; i < lines.length; i++){
			ctx.fillText(lines[i], xLoc, yLoc);
			yLoc += 20;	
		}
	}	
	
	this.buttons.draw();
}

combatResults.prototype.show = function(attacker, defender, winner, startFleetA, startFleetD, winFleet){
	this.attacker = attacker;
	this.defender = defender;
	this.winner = winner;
	this.startFleetA = startFleetA;
	this.startFleetD = startFleetD;
	this.winFleet = winFleet;
	
	this.active = true;	
}

combatResults.prototype.hide = function(){
	this.active = false;
	//this.buttons.clear();
}

function createStringsFromFleet(fleet){
	lines = [];
	var number;
	var text;
	if (fleet.Frigates.length + fleet.FrigatesMoved.length > 0){
		number = fleet.Frigates.length + fleet.FrigatesMoved.length;
		text = "Frigates: " + number;
		lines.push(text); 	
	}
	if (fleet.Cruisers.length + fleet.CruisersMoved.length > 0){
		number = fleet.Cruisers.length + fleet.CruisersMoved.length;
		text = "Cruisers: " + number;
		lines.push(text); 	
	}
	if (fleet.Capitals.length + fleet.CapitalsMoved.length > 0){
		number = fleet.Capitals.length + fleet.CapitalsMoved.length;
		text = "Capitals: " + number;
		lines.push(text); 	
	}
	return lines;	
}

function createStringsFromTwoFleets(startFleet, endFleet){
	lines = [];
	var number;
	var text;
	if ((startFleet.Frigates.length + startFleet.FrigatesMoved.length) > (endFleet.Frigates.length + endFleet.FrigatesMoved.length)){
		number = startFleet.Frigates.length + startFleet.FrigatesMoved.length - endFleet.Frigates.length + endFleet.FrigatesMoved.length;
		text = "Frigates: " + number;
		lines.push(text); 	
	}	
	if ((startFleet.Cruisers.length + startFleet.CruisersMoved.length) > (endFleet.Cruisers.length + endFleet.CruisersMoved.length)){
		number = startFleet.Cruisers.length + startFleet.CruisersMoved.length - endFleet.Cruisers.length + endFleet.CruisersMoved.length;
		text = "Cruisers: " + number;
		lines.push(text); 	
	}
	if ((startFleet.Capitals.length + startFleet.CapitalsMoved.length) > (endFleet.Capitals.length + endFleet.CapitalsMoved.length)){
		number = startFleet.Capitals.length + startFleet.CapitalsMoved.length - endFleet.Capitals.length + endFleet.CapitalsMoved.length;
		text = "Capitals: " + number;
		lines.push(text); 	
	}
	return lines;
}