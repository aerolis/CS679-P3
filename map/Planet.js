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
	this.haloRot = new v3(0,0,0);
	this.scale = 0.6+Math.random()*0.8;
	this.type = planetType;
	this.size = planetSize;
	this.player = planetOwner; 	// !! should we just keep an global array of players and then we can just keep an int here reflecting
								// which player in the array owns it?
	//console.log("this new PLANET's owner is: " + planetOwner); 
	this.linkedPlanets = connectedPlanets;
	
	//this.ships = shipsGarrisoned;
	this.ships = [];
	
	this.myFleet = new fleet();	
	this.selectedFleet = new fleet();
	
	// !!! ==== For testing only, should be removed! ===========
	this.myFleet.Frigates.push(new ship(this.player, "Frigate"));	
	this.myFleet.Cruisers.push(new ship(this.player, "Cruiser"));
	this.myFleet.Capitals.push(new ship(this.player, "Capital"));

	//this.myFleet.addCruisers(3);
	//this.myFleet.addCapitals(4);
	// !!! ==== End of testing purposes :) =====================
	
	this.model = 0; //will store a ref id for the model that displays it
	this.selected = false;
	
	this.fl_showOptions = false;
	this.optionButtons = new buttonset();
	this.fl_showShips = false;
	this.shipButtons = new buttonset();
	
	this.upgradeLevel = 1;
	this.maxUpgradeLevel = 3; // Probably dependant on planet type.
	this.upgradeCost = [];
	
	// !!! I don't think this should be stored here. I think we want a general place that stores what planet types are unlocked. (and possibly other techs).
	this.buildableShips = []; //only used if factory planet
	
	//keep track of ships in production,Xixi 
	//this.draftPlan = new draftPlan();
	this.productionPlan = new productionPlan();
	this.shipCatalog = new shipCatalog(); //catalog for lookup purpose
	
	this.specifyPlanetType();
}

// Check which buttons are necessary everytime the buttons get shown.
Planet.prototype.showOptions = function(){
	//this.optionButtons.addButton(OptionBarX + 420, OptionBarY + 20, 90, OptionBarHeight - 40, '#657383', "Send out army", buttonType.Send);
	//if (planet.upgradeLevel < planet.upgradeLimit)
	this.optionButtons.addButton(OptionBarX + 520, OptionBarY + 20, 90, OptionBarHeight - 40, '#657383', "Upgrade Planet", buttonType.Upgrade);
	
	//This gets called regularly. DO NOT move it to specifyPlanetType.
	switch (this.type)
	{
		case "factory":
			this.optionButtons.addButton(OptionBarX + 620, OptionBarY + 20, 90, 25, '#657383', "Built Ship Type 1", buttonType.BuildUnit1);	
			this.optionButtons.addButton(OptionBarX + 620, OptionBarY + 55, 90, 25, '#657383', "Built Ship Type 2", buttonType.BuildUnit2);
			//TODO: add buildable ship to list				
		break;
		case "plasma":
		break;
		case "antimatter":
		break;
		case "steel":
		break;
		case "credit":
		break;
		case "warp":
		break;
		case "academy":
			this.model = 0;
		break;
		case "default":
		break;
	}
	
	this.fl_showOptions = true;
}


Planet.prototype.hideOptions = function(){
	this.myFleet.addFleet(this.selectedFleet);
	this.selectedFleet.empty();
	this.optionButtons.clear();
	this.fl_showOptions = false;
}

Planet.prototype.showShips = function(){
	//populate shipButtons;
	// !!! buttonTypes
	//Movable ships
	if (this.myFleet.Frigates.length + this.selectedFleet.Frigates.length > 0){
		this.shipButtons.addButton(unitsStart, OptionBarY + 10, (OptionBarSidesWidth - 40)/3, (OptionBarHeight - 30)/2, '#4C7D7E', "Frigates: " + this.myFleet.Frigates.length + ", " + this.selectedFleet.Frigates.length, buttonType.Frigates);	
	}
	if (this.myFleet.Cruisers.length + this.selectedFleet.Cruisers.length  > 0){
		this.shipButtons.addButton(unitsStart + (OptionBarSidesWidth - 40)/3 + 10, OptionBarY + 10, (OptionBarSidesWidth - 40)/3, (OptionBarHeight - 30)/2, '#4C7D7E', "Cruisers: " + this.myFleet.Cruisers.length + ", " + this.selectedFleet.Cruisers.length, buttonType.Cruisers);	
	}
	if (this.myFleet.Capitals.length + this.selectedFleet.Capitals.length  > 0){
		this.shipButtons.addButton(unitsStart + 2*(OptionBarSidesWidth - 40)/3 + 20, OptionBarY + 10, (OptionBarSidesWidth - 40)/3, (OptionBarHeight - 30)/2, '#4C7D7E', "Capitals: " + this.myFleet.Capitals.length + ", " + this.selectedFleet.Capitals.length, buttonType.Capitals);	
	}	
	//These don't actually need to be buttons
	//Non-movable ships
	if (this.myFleet.FrigatesMoved.length + this.selectedFleet.FrigatesMoved.length > 0){
		this.shipButtons.addButton(unitsStart                                      , OptionBarY + (OptionBarHeight - 30)/2 + 20, (OptionBarSidesWidth - 40)/3, (OptionBarHeight - 30)/2, '#806D7E', "FrigatesMoved: " + this.myFleet.FrigatesMoved.length + ", " + this.selectedFleet.FrigatesMoved.length, buttonType.Empty);	
	}
	if (this.myFleet.CruisersMoved.length + this.selectedFleet.CruisersMoved.length  > 0){
		this.shipButtons.addButton(unitsStart + (OptionBarSidesWidth - 40)/3 + 10  , OptionBarY + (OptionBarHeight - 30)/2 + 20, (OptionBarSidesWidth - 40)/3, (OptionBarHeight - 30)/2, '#806D7E', "CruisersMoved: " + this.myFleet.CruisersMoved.length + ", " + this.selectedFleet.CruisersMoved.length, buttonType.Empty);	
	}
	if (this.myFleet.CapitalsMoved.length + this.selectedFleet.CapitalsMoved.length  > 0){
		this.shipButtons.addButton(unitsStart + 2*(OptionBarSidesWidth - 40)/3 + 20, OptionBarY + (OptionBarHeight - 30)/2 + 20, (OptionBarSidesWidth - 40)/3, (OptionBarHeight - 30)/2, '#806D7E', "CapitalsMoved: " + this.myFleet.CapitalsMoved.length + ", " + this.selectedFleet.CapitalsMoved.length, buttonType.Empty);	
	}	
	this.fl_showShips = true;
}

Planet.prototype.hideShips = function(){
	this.shipButtons.clear();
	this.fl_showShips = false;
}

Planet.prototype.selectFrigate = function(){
	this.hideShips();
	if (this.myFleet.Frigates.length > 0){
		this.selectedFleet.Frigates.push(this.myFleet.Frigates.pop());
		//this.selectedFleet.addFrigates(1);
	}
	// !!! Buttons need to be refactored. I really don't want to do this this way.
	this.showShips();
}

Planet.prototype.selectCruiser = function(){
	this.hideShips();
	if (this.myFleet.Cruisers.length > 0){
		this.selectedFleet.Cruisers.push(this.myFleet.Cruisers.pop());
		//this.selectedFleet.addFrigates(1);
	}
	// !!! Buttons need to be refactored. I really don't want to do this this way.
	this.showShips();
}

Planet.prototype.selectCapital = function(){
	this.hideShips();
	if (this.myFleet.Capitals.length > 0){
		this.selectedFleet.Capitals.push(this.myFleet.Capitals.pop());
		//this.selectedFleet.addFrigates(1);
	}
	// !!! Buttons need to be refactored. I really don't want to do this this way.
	this.showShips();
}


Planet.prototype.specifyPlanetType = function()
{
	switch (this.type)
	{
		case "factory":
			this.model = 0;
			//TODO: add buildable ship to list
			this.upgradeCost.push(new cost("antimatter", 100));			
		break;
		case "plasma":
			this.model = 1;
			this.upgradeCost.push(new cost("antimatter", 100));
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
		case "warp":
			this.model = 8;
		break;
		case "default":
			this.model = 0;
		break;
	}
}

//Receives the actual planet object
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

//Check if it's linked to another planet. toPlanet is the actual Planet object.
Planet.prototype.linkedTo = function(toPlanet)
{
	if (this.linkedPlanets.indexOf(toPlanet) != -1)
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
	
	//calculate the billboard rotations
	var dx = cam.pos.x-(this.pos.x+mp.systems[this.mySystem].pos.x);
	var dy = cam.pos.y-(this.pos.y+mp.systems[this.mySystem].pos.y);
	var dz = cam.pos.z-(this.pos.z+mp.systems[this.mySystem].pos.z);
	var dh = Math.sqrt(dx*dx+dz*dz);
	this.haloRot.y = Math.atan2(dz,dx);
	this.haloRot.x = Math.atan2(dy,dh);
	this.haloRot.z += 0.001%(2*Math.PI);
}

Planet.prototype.tryUpgrade = function() {
	if (this.upgradeLevel < this.maxUpgradeLevel){
		var gotEnough = true;
		for (var i = 0; i < this.upgradeCost.length; i++){
			//Check if you have it
			var current = this.upgradeCost[i];
			if (current.type == "credits"){
				if (current.amount > this.player.credits){
					gotEnough = false;
				}
			}
			// !!! Do for all other types
		}
		if(gotEnough){
			this.upgradeLevel++;
			//Pay resources;
		}
	}
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
	
	this.myFleet.addFleet(this.selectedFleet);
	this.selectedFleet.empty();
	this.myFleet.setUnMoved();
}

Planet.prototype.tryReceiveFleet = function(newFleet){
	console.log("A fleet tried to reach me");
	//See if it's possible to fly here.
	console.log("selectedPlanetIndices:" + selectedPlanetIndices);
	if (this.linkedTo(selectedPlanet)){
		console.log("A fleet reached me");
		//Do this stuff
		// !!! Button things that need refactoring again
		selectedPlanet.hideShips();
		
		//If it were your players, just add the fleet.
		if (this.player == currentPlayer){
			selectedPlanet.selectedFleet.setMoved();
			this.myFleet.addFleet(selectedPlanet.selectedFleet);
			selectedPlanet.selectedFleet.empty();
		}
		//If it's an enemy planet, call receiveHostileFleet on it.
		else if (targetPlanet.player != currentPlayer){
			this.receiveHostileFleet(selectedPlanet.selectedFleet);
			selectedPlanet.selectedFleet.empty();
		}
		selectedPlanet.showShips();			
	}
	else{
		console.log("The fleet didn't reach me");
		//You tried to send something to a planet that is not connected.
		// !!! Does anything happen? Deselection?
	}
}

Planet.prototype.receiveHostileFleet = function(enemyFleet){
	//Do battle stuff. The enemy that send it to you can be gotten from players[currentPlayer].
	//Get a winner first.
	//after we got winner,assign value to planet.player
	var winner = battle(enemyFleet, this.myFleet);
	if (winner.length > 0){
		this.player = winner[0].owner;
	}
	this.myFleet = winner;
	
	combatResultScreen.show();
}
