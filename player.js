function player (i, isAI)
{
	this.id = i;
	this.ai = isAI;
	
	this.color = new v3(1.0,1.0,1.0);
	
	this.credits = 200;
	this.plasma = 0;
	this.steel = 0;
	this.antimatter = 0;
	
	//saving their camera vars
	this.cPos = new v3(0,0,0);
	this.cRot = new v3(0,0,0);
	this.cDist = 0;
	
	this.catalog = new shipCatalog(this.id);
	
	this.planets = [];
}

player.prototype.restart = function()
{
}

player.prototype.update = function()
{
}

player.prototype.addCredits = function(amount){
	this.credits += amount;
}

player.prototype.addPlasma = function(amount){
	this.plasma += amount;
}

player.prototype.addSteel = function(amount){
	this.steel += amount;
}
player.prototype.addAntimatter = function(amount){
	this.antimatter += amount;
}
player.prototype.saveCameraPosition = function()
{
	this.cPos = new v3(cam.lookat.x,cam.lookat.y,cam.lookat.z);
	this.cRot = new v3(cam.yaw,cam.pitch,cam.roll);
	this.cDist = cam.distance;
}
player.prototype.initializeCameraPos = function()
{
	var i,j;
	var pos = new v3(0,0,0);
	this.cRot = new v3(cam.flyingFinalYaw,cam.flyingFinalPitch,0);
	this.cDist = cam.flyToDistance;
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			if (mp.systems[i].planets[j].player == this.id)
			{
				pos.x = mp.systems[i].pos.x + mp.systems[i].planets[j].pos.x;
				pos.y = mp.systems[i].pos.y + mp.systems[i].planets[j].pos.y;
				pos.z = mp.systems[i].pos.z + mp.systems[i].planets[j].pos.z;
				this.cPos = new v3(pos.x,pos.y,pos.z);
				return;
			}
		}
	}
	this.cPos = new v3(pos.x,pos.y,pos.z);
}

//Add a planet to the list of planets this player owns
player.prototype.addPlanet = function(planet)
{
	if (this.planets.indexOf(planet) == -1)
		this.planets.push(planet);
}

//Remove a planet from the list of planets this player owns
player.prototype.removePlanet = function(planet)
{
	var index = this.planets.indexOf(planet);
	if (index != -1)
	{
		this.planets.splice(index,1);
	}
}

//SHOULD ONLY BE CALLED IF PLAYER IS AN AI
player.prototype.doTurn = function()
{
	if (!this.ai) return;
	
	console.log("Doing AI turn");
	
	//first attempt to build ships
	for (var i = 0; i < this.planets.length; i++) {
		//console.log("I own planet " + this.planets[i].id);
		console.log(this.planets[i].type);
		if (this.planets[i].type == "factory")
		{
			//this.planets[i].buildShip("Frigate");
			//TODO: attempt to build a ship
			//Add ship to production
			console.log("AI wants to build");
			var status = this.planets[i].buildShip("Frigate",1);
			if (status == "RESNOTENOUGH") {// resources not enough, show some message
			}
			//receive newly built ships 
			this.planets[i].getNewShips();			
		}
	}
	
	//now do any attacking that we can
	for (var i = 0; i < this.planets.length; i++) {
		var currPlanet = this.planets[i];
		console.log(currPlanet.ships);
		for (var j = 0; j < currPlanet.linkedPlanets.length; j++)
		{
			var linkedPlanet = currPlanet.linkedPlanets[j];
			
			if(linkedPlanet.player != this.id) {
				//TODO: add better checks here besides just do we
			    //have more ships than them...
			    var ourShips = currPlanet.myFleet.Frigates.length +
			    			   currPlanet.myFleet.Capitals.length +
			    			   currPlanet.myFleet.Cruisers.length;
			    
			    var enemyShips = linkedPlanet.myFleet.Frigates.length +
			    			   linkedPlanet.myFleet.Capitals.length +
			    			   linkedPlanet.myFleet.Cruisers.length;
				if(ourShips >= enemyShips)
				{
					//linkedPlanet.recieveHostileFleet(currPlanet.myFleet);
					selectedPlanet = currPlanet;
					selectedPlanet.selectedFleet = currPlanet.myFleet;
					targetPlanet = linkedPlanet;
					linkedPlanet.tryReceiveFleet(selectedPlanet);
				}
			}
		}
	}
	
	//look for planets to reinforce
	var dangerPlanets = [];
	
	for (var i = 0; i < this.planets.length; i++) {
		var currPlanet = this.planets[i];
		for (var j = 0; j < currPlanet.linkedPlanets.length; j++)
		{
			var linkedPlanet = currPlanet.linkedPlanets[j];
			
			if(linkedPlanet.player != this.id) {
				dangerPlanets.push(currPlanet);
				break;
			}
		}
	}
	
	//Move ships to outlying planets
	for (var i = 0; i < this.planets.length; i++) {
		var currPlanet = this.planets[i];
		if(dangerPlanets.indexOf(currPlanet) == -1)
		{
			var sendPlanet = null;
			for (var j = 0; j < currPlanet.linkedPlanets.length; j++)
			{
				var childPlanet = currPlanet.linkedPlanets[j];
				if (dangerPlanets.indexOf(childPlanet) != -1)
				{
					sendPlanet = childPlanet;
					break;
				}
			}
			if (sendPlanet == null)
			{
				//TODO: Find nearest danger planet, send
				//ships out on a path to it...
				//for now, send them out to random linked planet
				var rand = Math.floor(Math.random()*currPlanet.linkedPlanets.length);
				sendPlanet = currPlanet.linkedPlanets[rand];
			}
			selectedPlanet = currPlanet;
			selectedPlanet.selectedFleet = currPlanet.myFleet;
			targetPlanet = sendPlanet;
			sendPlanet.tryReceiveFleet(selectedPlanet);
		}
	}
}
