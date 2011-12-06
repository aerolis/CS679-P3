/**
 * @author Dan
 */
function Planet(planetPosition, planetType, planetSize, planetOwner,
				connectedPlanets, shipsGarrisoned, mySys) {
	if (createdViaMap)
		this.id = globalPlanetID;
	else
		this.id = mp.systems[mySys].numOfPlanets;
	this.mySystem = mySys;
	this.pos = planetPosition;
	this.rot_rate = new v3(0,Math.random()*0.1,0);
	this.rot = new v3(0,0,0);
	this.scale = 0.6+Math.random()*0.8;
	this.type = planetType;
	this.size = planetSize;
	this.player = planetOwner; 	// !! should we just keep an global array of players and then we can just keep an int here reflecting
								// which player in the array owns it?
	this.linkedPlanets = connectedPlanets;
	//this.ships = shipsGarrisoned;
	this.ships = [];
	this.model = 0; //will store a ref id for the model that displays it
	this.selected = false;
	
	this.showOptions = false;
	this.optionButtons = new buttonset();
	
	// !!! I don't think this should be stored here. I think we want a general place that stores what planet types are unlocked. (and possibly other techs).
	this.buildableShips = []; //only used if factory planet
}

// Check which buttons are necessary everytime the buttons get shown.
Planet.prototype.showoptions = function(){
	console.log("showOptions gets called");
	this.optionButtons.addButton(OptionBarX + 420, OptionBarY + 20, 90, OptionBarHeight - 40, '#657383', "Send out army", buttonType.Send);
	//if (planet.upgradeLevel < planet.upgradeLimit)
	this.optionButtons.addButton(OptionBarX + 520, OptionBarY + 20, 90, OptionBarHeight - 40, '#657383', "Upgrade Planet", buttonType.Upgrade);
	
	switch (this.type)
	{
		case "factory":
			this.model = 0;
			this.optionButtons.addButton(OptionBarX + 620, OptionBarY + 20, 90, 25, '#657383', "Built Ship Type 1", buttonType.BuildUnit1);	
			this.optionButtons.addButton(OptionBarX + 620, OptionBarY + 55, 90, 25, '#657383', "Built Ship Type 2", buttonType.BuildUnit2);
			//TODO: add buildable ship to list				
		break;
		case "plasma":
			this.model = 1;
		break;
		case "antimatter":
			this.model = 2;
		break;
		case "steel":
			this.model = 3;
		break;
		case "credit":
			this.model = 6;
		break;
	}
	this.showOptions = true;
}

Planet.prototype.hideoptions = function(){
	this.optionButtons.clear();
	this.showOptions = false;
}


Planet.prototype.linkPlanet = function(toPlanet) {
	this.linkedPlanets.push(toPlanet);
	//var lnk = toPlanet.split('-');
	//var lnk_sys = lnk[0];
	//var lnk_planet = lnk[1];
	var lnk_sys = toPlanet.mySystem;
	var lnk_planet = toPlanet.id;
	//mp.systems[lnk_sys].planets[lnk_planet].linkedPlanets.push(this.mySystem+"-"+this.id);
	mp.systems[lnk_sys].planets[lnk_planet].linkedPlanets.push(this);
	
}
Planet.prototype.linkedTo = function(toPlanet)
{
	var lnk_sys = toPlanet.a;
	var lnk_planet = toPlanet.b;
	var lnk = lnk_sys + "-" + lnk_planet;
	if (this.linkedPlanets.indexOf(lnk) != -1)
		return true;
	return false;
}
Planet.prototype.garrisonShip = function(ship) {
	this.ships.push(ship);
}
Planet.prototype.update = function() {
	//update rotation
	this.rot.x += this.rot_rate.x % 360;
	this.rot.y += this.rot_rate.y % 360;
	this.rot.z += this.rot_rate.z % 360;
}
Planet.prototype.onTurn = function() {
	switch (this.type)
	{
		case "plasma":
			players[this.player].addPlasma(8);
			break;
		case "antimatter":
			players[this.player].addAntimatter(5);
			break;
		case "steel":
			players[this.player].addSteel(10);
			break;
		case "credit":
			players[this.player].addCredits(50);
			break;
		default:
		break;
	}	
}
