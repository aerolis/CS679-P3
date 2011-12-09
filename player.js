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
	this.factories = [];
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
	{
		this.planets.push(planet);
		if (planet.type == "factory") {
			this.factories.push(planet);
		}
	}
}

//Remove a planet from the list of planets this player owns
player.prototype.removePlanet = function(planet)
{
	var index = this.planets.indexOf(planet);
	if (index != -1)
	{
		this.planets.splice(index,1);
		if (planet.type == "factory") {
			var factIndex = this.factories.indexOf(planet);
			this.factories.splice(factIndex, 1);
		}
	}
}

//SHOULD ONLY BE CALLED IF PLAYER IS AN AI
player.prototype.doTurn = function()
{
	if (!this.ai) return;
	
	console.log("Doing AI turn");
	
	//first attempt to build ships
	//TODO: Find closest Factory to enemies and build there...
	var status = true;
	while(status) {
		for(var i = 0; i < this.factories.length; i++) {
			//TODO: better logic in ship production
			//Add ship to production
			//console.log("AI wants to build a frigate");
			//console.log("AI Credits: " + this.credits);
			//console.log("currently has " + this.planets[i].myFleet.Frigates.length+  " frigates");
			selectedPlanet = this.planets[i];
			status = this.planets[i].buildShip("frigate", 1);
			if (!status) break;
			//console.log("AI built " + counter + " frigates!");
			//console.log(this.planets[i].productionPlan)
		}
	}


	//now do any attacking that we can
	for (var i = 0; i < this.planets.length; i++) {
		var currPlanet = this.planets[i];
		//console.log(currPlanet.ships);
		for (var j = 0; j < currPlanet.linkedPlanets.length; j++)
		{
			var linkedPlanet = currPlanet.linkedPlanets[j];
			
			if(linkedPlanet.player != this.id) {
				//TODO: add better checks here besides just do we
			    //have more ships than them...
			    var ourShips = currPlanet.myFleet.Frigates.length +
			    			   currPlanet.myFleet.Capitals.length*2 +
			    			   currPlanet.myFleet.Cruisers.length*4;
			    
			    var enemyShips = linkedPlanet.myFleet.Frigates.length +
			    			   linkedPlanet.myFleet.Capitals.length*2 +
			    			   linkedPlanet.myFleet.Cruisers.length*4;
				if(ourShips >= enemyShips)
				{
					//console.log("AI wants to attack!");
					//linkedPlanet.recieveHostileFleet(currPlanet.myFleet);
					selectedPlanet = currPlanet;
					//selectedPlanet.selectedFleet = currPlanet.myFleet;
					while(selectedPlanet.myFleet.Frigates.length > 0)
					{
						selectedPlanet.selectFrigate();
					}
					while(selectedPlanet.myFleet.Cruisers.length > 0)
					{
						selectedPlanet.selectCruiser();
					}
					while(selectedPlanet.myFleet.Capitals.length > 0)
					{
						selectedPlanet.selectCapital();
					}
					targetPlanet = linkedPlanet;
					targetPlanet.tryReceiveFleet(selectedPlanet);
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
			while(selectedPlanet.myFleet.Frigates.length > 0)
			{
				selectedPlanet.selectFrigate();
			}
			while(selectedPlanet.myFleet.Cruisers.length > 0)
			{
				selectedPlanet.selectCruiser();
			}
			while(selectedPlanet.myFleet.Capitals.length > 0)
			{
				selectedPlanet.selectCapital();
			}
			targetPlanet = sendPlanet;
			targetPlanet.tryReceiveFleet(selectedPlanet);
		}
	}
}
