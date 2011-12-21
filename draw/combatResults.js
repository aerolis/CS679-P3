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
	this.planetName = 0;
	
	
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
	ctx.fillText(this.attacker + " attacked " + this.defender + " on planet " + this.planetName + ".", this.x+20, this.y+80);
	ctx.fillText(this.winner + " won!", this.x+20, this.y+100);
	
	var lines;
	if (this.attacker == this.winner){
		//calc losses.
		lines = createStringsFromTwoFleets(this.startFleetA, this.winFleet);
	}
	else{
		lines = createStringsFromFleet(this.startFleetA);
	}
	if (lines.length > 0){
		ctx.fillText("Attacker lost:", this.x + 20, this.y + 140);
		var xLoc = this.x + 20;
		var yLoc = this.y + 160;
		for (var i = 0; i < lines.length; i++){
			ctx.fillText(lines[i], xLoc, yLoc);
			yLoc += 20;	
		}
	}
	
	if (this.defender == this.winner){
		//calc losses.
		lines = createStringsFromTwoFleets(this.startFleetD, this.winFleet);		
	}
	else{
		//it's everything.	
		lines = createStringsFromFleet(this.startFleetD);		
	}
	if (lines.length > 0){
		ctx.fillText("Defender lost:", this.x + 220, this.y + 140);
	
		var xLoc = this.x + 220;
		var yLoc = this.y + 160;
		for (var i = 0; i < lines.length; i++){
			ctx.fillText(lines[i], xLoc, yLoc);
			yLoc += 20;	
		}
	}
	
	var ownerLine = "";
	if (this.winner == "You"){
		ownerLine = this.winner + " are ";	
	}
	else {
		ownerLine = this.winner + " is ";
	}
	if (this.attacker == this.winner){
		ownerLine = ownerLine + "now ";
	}
	else{
		ownerLine = ownerLine + "still ";
	}
			
	ctx.fillText(ownerLine + "the owner of " + this.planetName + ".", this.x+20, this.y+270);
		
	
	this.buttons.draw();
}

combatResults.prototype.show = function(attacker, defender, winner, startFleetA, startFleetD, winFleet, planetName){
	this.attacker = findName(attacker);
	this.defender = findName(defender);
	this.winner = findName(winner);
	this.startFleetA = startFleetA;
	this.startFleetD = startFleetD;
	this.winFleet = winFleet;
	this.planetName = planetName;
	
	this.active = true;	
}

function findName(number){
	var name;
	switch (number){
		case -1:
			name = "Neutral player";
			break;
		case 0:
			name = "You";
			break;
		default:
			name = "Enemy " + number;
			break;	
	}	
	return name;
}

combatResults.prototype.hide = function(){
	this.active = false;
	//this.buttons.clear();
}

function createStringsFromFleet(fleet){
	lines = [];
	var number;
	var text;
	if (fleet.Scouts.length + fleet.ScoutsMoved.length > 0){
		number = fleet.Scouts.length + fleet.ScoutsMoved.length;
		text = "Scouts: " + number;
		lines.push(text); 	
	}
	if (fleet.Frigates.length + fleet.FrigatesMoved.length > 0){
		number = fleet.Frigates.length + fleet.FrigatesMoved.length;
		text = "Frigates: " + number;
		lines.push(text); 	
	}
	if (fleet.Fighters.length + fleet.FightersMoved.length > 0){
		number = fleet.Fighters.length + fleet.FightersMoved.length;
		text = "Fighters: " + number;
		lines.push(text); 	
	}
	if (fleet.Dreadnaughts.length + fleet.DreadnaughtsMoved.length > 0){
		number = fleet.Dreadnaughts.length + fleet.DreadnaughtsMoved.length;
		text = "Dreadnaughts: " + number;
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
	if ((startFleet.Scouts.length + startFleet.ScoutsMoved.length) > (endFleet.Scouts.length + endFleet.ScoutsMoved.length)){
		number = startFleet.Scouts.length + startFleet.ScoutsMoved.length - endFleet.Scouts.length + endFleet.ScoutsMoved.length;
		text = "Scouts: " + number;
		lines.push(text); 	
	}
	if ((startFleet.Frigates.length + startFleet.FrigatesMoved.length) > (endFleet.Frigates.length + endFleet.FrigatesMoved.length)){
		number = startFleet.Frigates.length + startFleet.FrigatesMoved.length - endFleet.Frigates.length + endFleet.FrigatesMoved.length;
		text = "Frigates: " + number;
		lines.push(text); 	
	}	
	if ((startFleet.Fighters.length + startFleet.FightersMoved.length) > (endFleet.Fighters.length + endFleet.FightersMoved.length)){
		number = startFleet.Fighters.length + startFleet.FightersMoved.length - endFleet.Fighters.length + endFleet.FightersMoved.length;
		text = "Fighters: " + number;
		lines.push(text); 	
	}	
	if ((startFleet.Dreadnaughts.length + startFleet.DreadnaughtsMoved.length) > (endFleet.Dreadnaughts.length + endFleet.DreadnaughtsMoved.length)){
		number = startFleet.Dreadnaughts.length + startFleet.DreadnaughtsMoved.length - endFleet.Dreadnaughts.length + endFleet.DreadnaughtsMoved.length;
		text = "Dreadnaughts: " + number;
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