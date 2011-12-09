/**
 * @author Dan
 */
function Planet(planetPosition, planetType, planetSize, planetOwner,
				connectedPlanets, shipsGarrisoned, mySys) {
	//console.log("Planet constructor. planetType = " + planetType);
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
	
	
	this.model = 0; //will store a ref id for the model that displays it
	this.selected = false;
	
	
	//this.fl_showOptions = false;
	this.optionButtons = new buttonset();
	//this.fl_showShips = false;
	this.shipButtons = new unitButtonSet();
	
	this.upgradeLevel = 1;	
	this.amtResourcesToAdd = 0;
	this.amtCreditsToAdd = 6;
	// !!! TODO: Find out where this should go...
	this.upgradeStats = new upgradeData(this);	
	
	// !!! I don't think this should be stored here. I think we want a general place that stores what planet types are unlocked. (and possibly other techs).
	this.buildableShips = []; //only used if factory planet
	
	//keep track of ships in production,Xixi 
	//this.draftPlan = new draftPlan();
	this.productionPlan = new productionPlan();
	//this.shipCatalog = new shipCatalog(); //catalog for lookup purpose
	
	//this.specifyPlanetType();
}

Planet.prototype.buildShip = function(type,amt)
{
	//for now, just builds Frigates and doesn't take any resources
	//this.myFleet.addNewShip(new ship(this.player, type));
	//this.showShips();
	
	//add new item to production plan, need to specify amt of each order
	var status = this.productionPlan.addOrder(this.player,type,amt);
	return status;
}

Planet.prototype.populateOptionButtons = function(){
	this.optionButtons.addButton(OptionBarX + OptionBarSidesWidth + 20 + 10, OptionBarY + OptionBarHeight - 50, (OptionBarWidth - 2 * OptionBarSidesWidth - 60), 40, '#657383', "Upgrade", buttonType.Upgrade);
	
	switch (this.type)
	{
		case "factory":
			this.optionButtons.addButton(OptionBarWidth - OptionBarSidesWidth + 10, 				 OptionBarY + 10, ShipButtonWidth, ShipButtonHeight, '#4C7D7E', "Build Frigate", buttonType.BuildFrigate);	
			this.optionButtons.addButton(OptionBarWidth - OptionBarSidesWidth + ShipButtonWidth + 10,     OptionBarY + 10, ShipButtonWidth, ShipButtonHeight, '#4C7D7E', "Build Cruiser", buttonType.BuildCruiser);
			this.optionButtons.addButton(OptionBarWidth - OptionBarSidesWidth + 2 * ShipButtonWidth + 10, OptionBarY + 10, ShipButtonWidth, ShipButtonHeight, '#4C7D7E', "Build Capital", buttonType.BuildCapital);				
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
		break;
		case "default":
		break;
	}	
}


Planet.prototype.emptySelection = function(){
	this.myFleet.addFleet(this.selectedFleet);
	this.selectedFleet.empty();
	//this.optionButtons.clear();
	//this.fl_showOptions = false;
}

Planet.prototype.populateShipButtons = function(){
	
	this.shipButtons.clear();
	//Movable ships
	if (this.myFleet.Frigates.length + this.selectedFleet.Frigates.length > 0){
		this.shipButtons.addUnitButton('#4C7D7E', "Frigates: ", buttonType.Frigates, "Frigates");	
	}
	if (this.myFleet.Cruisers.length + this.selectedFleet.Cruisers.length  > 0){
		this.shipButtons.addUnitButton('#4C7D7E', "Cruisers: " , buttonType.Cruisers, "Cruisers");	
	}
	if (this.myFleet.Capitals.length + this.selectedFleet.Capitals.length  > 0){
		this.shipButtons.addUnitButton('#4C7D7E', "Capitals: ", buttonType.Capitals, "Capitals");	
	}	
	
	//Non-movable ships
	if (this.myFleet.FrigatesMoved.length + this.selectedFleet.FrigatesMoved.length > 0){
		this.shipButtons.addUnitButton('#806D7E', "FrigatesMoved: ", buttonType.Empty, "FrigatesMoved");	
	}
	if (this.myFleet.CruisersMoved.length + this.selectedFleet.CruisersMoved.length  > 0){
		this.shipButtons.addUnitButton('#806D7E', "CruisersMoved: ", buttonType.Empty, "CruisersMoved");	
	}
	if (this.myFleet.CapitalsMoved.length + this.selectedFleet.CapitalsMoved.length  > 0){
		this.shipButtons.addUnitButton( '#806D7E', "CapitalsMoved: ", buttonType.Empty,"CapitalsMoved");	
	}	
	
	
	//Give them all a location
	this.shipButtons.layOutButtons();
	
	// !!! if more than so many, add arrows.
	//this.fl_showShips = true;
}
/*
Planet.prototype.hideShips = function(){
	//this.fl_showShips = false;
	
	this.shipButtons.clear();
}
*/
Planet.prototype.selectFrigate = function(){
	if (this.myFleet.Frigates.length > 0){
		this.selectedFleet.Frigates.push(this.myFleet.Frigates.pop());
	}
}

Planet.prototype.selectCruiser = function(){
	if (this.myFleet.Cruisers.length > 0){
		this.selectedFleet.Cruisers.push(this.myFleet.Cruisers.pop());
	}
}

Planet.prototype.selectCapital = function(){
	if (this.myFleet.Capitals.length > 0){
		this.selectedFleet.Capitals.push(this.myFleet.Capitals.pop());
	}
}
Planet.prototype.specifyPlanetType = function()
{
	switch (this.type)
	{
		case "factory":
			this.model = 0;		
		break;
		case "credit":
			this.model = 6;
			this.amtResourcesToAdd = 40;
		break;
		case "steel":
			this.model = 3;
			this.amtResourcesToAdd = 12;
		break;
		case "plasma":
			this.model = 1;
			this.amtResourcesToAdd = 10;
		break;
		case "antimatter":
			this.model = 2;			
			this.amtResourcesToAdd = 8;
		break;
		case "warp":
			this.model = 8;
		break;
		case "academy":
			this.model = 0;
		break;
		case "default":
			this.model = 0;
		break;
	}
	//Apparently, after this the planet type is properly set...
	// !!! Could probably use a better location.
	this.upgradeStats = new upgradeData(this);	
		
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
	if (this.upgradeLevel < this.upgradeStats.maxUpgradeLevel){
		//If you own enough resources
		if (	players[this.player].credits >= this.upgradeStats.credits &&
				players[this.player].steel >= this.upgradeStats.steel &&
				players[this.player].plasma >= this.upgradeStats.plasma &&
				players[this.player].antimatter >= this.upgradeStats.antimatter){
					
			//Pay resources.
			players[this.player].credits -= this.upgradeStats.credits;
			players[this.player].steel -= this.upgradeStats.steel;
			players[this.player].plasma -= this.upgradeStats.plasma;
			players[this.player].antimatter -= this.upgradeStats.antimatter;
			
			//Upgrade the planet
			this.upgradeLevel++;
			this.amtCreditsToAdd += 5;
			this.amtResourcesToAdd = this.upgradeStats.newResources;				
			// !!! Change things for non-resource planets.
			this.upgradeStats = new upgradeData(this);
		}
	}
}

Planet.prototype.deselect = function() {
	this.selected = false;	
	selectedPlanet = null;
	selectedPlanetIndices = null;
}

Planet.prototype.onTurn = function() {
	players[this.player].addCredits(this.amtCreditsToAdd);
	
	switch (this.type)
	{	
		case "credit":
			players[this.player].addCredits(this.amtResourcesToAdd);
			break;
		case "steel":
			players[this.player].addSteel(this.amtResourcesToAdd);
			break;		
		case "plasma":
			players[this.player].addPlasma(this.amtResourcesToAdd);
			break;
		case "antimatter":
			players[this.player].addAntimatter(this.amtResourcesToAdd);
			break;
		case "factory":
			this.getNewShips();
			break;
		default:
		break;
	}	
	this.myFleet.addFleet(this.selectedFleet);
	this.selectedFleet.empty();
	this.myFleet.setUnMoved();
}

Planet.prototype.tryReceiveFleet = function(newFleet){
	//See if it's possible to fly here.
	if (this.linkedTo(selectedPlanet)){
		//Do this stuff
		
		//If it were your ships, just add the fleet.
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
		selectedPlanet.populateShipButtons();						
	}
	else{
		console.log("The fleet didn't reach me");
		//You tried to send something to a planet that is not connected.
		// !!! Does anything happen? Deselection?
	}
}

Planet.prototype.receiveHostileFleet = function(enemyFleet){
	//Needed to show combat results
   	var attacker = selectedPlanet.player;
	var defender = this.player; //Don't know if this will work?
	var startFleetA = enemyFleet.clone();
	var startFleetD = this.myFleet.clone();
	
	 //Get a winner first.
    var winner = battle(enemyFleet, this.myFleet);
	
    //after we got winner,assign value to planet.player
    if (winner.length > 0){
		//If you lost
		//console.log("I am: " + this.player + ", winner is " + winner[0].owner);
        if (this.player == winner[0].owner){
			//Defender won.
			this.myFleet = makeFleetNotMoved(winner);    
		}
		//If you won
		else{
			//Attacker won.
			this.myFleet = makeFleetMoved(winner);
			var oldPlayer = this.player;
			this.player = winner[0].owner;	
			players[this.player].addPlanet(this);
			if (oldPlayer >= 0 && oldPlayer < players.length)
			{
				players[oldPlayer].removePlanet(this);
			}	
		}
    }
    else{
        console.log("Everything died. This shouldn't be able to happen.");    
    }
    mp.bindColors();
	
	var winner = this.player; 
	//attacker, defender, winner, startFleetA, startFleetB, winFleet
    combatResultScreen.show(attacker, defender, winner, startFleetA, startFleetD, this.myFleet.clone());
}

Planet.prototype.getNewShips = function(){ //Add new ships released from production and put them into fleet
	var newShipArray = [];
	newShipArray = newShipArray.concat(this.productionPlan.release());
	for(var i=0; i < newShipArray.length; i++){
		this.myFleet.addNewShip(newShipArray[i]);
	}
}

Planet.prototype.initFleetOwner = function()
{
	var i;
	for (i=0;i<this.myFleet.Frigates.length;i++)
	{
		this.myFleet.Frigates[i].owner = this.player;
	}
	for (i=0;i<this.myFleet.Cruisers.length;i++)
	{
		this.myFleet.Cruisers[i].owner = this.player;
	}
	for (i=0;i<this.myFleet.Capitals.length;i++)
	{
		this.myFleet.Capitals[i].owner = this.player;
	}
}

Planet.prototype.getPlanetXY = function()
{
	var x,y;
	var v = vec3.create([0,0,0]);
	var ax = this.pos.x+mp.systems[this.mySystem].pos.x;
	var ay = this.pos.y+mp.systems[this.mySystem].pos.y;
	var az = this.pos.z+mp.systems[this.mySystem].pos.z;
	mat4.identity(mvtmpMatrix);
	mat4.translate(mvtmpMatrix,[ax,ay,az]);
	mat4.multiply(mvtmpMatrix,cMatrix);
	mat4.multiplyVec3(mvtmpMatrix, v, v);
	x = v[0];
	y = v[1];
	return new v2(x,y);
}