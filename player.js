function player (i, isAI)
{
	this.id = i;
	this.ai = isAI;
	
	this.color = new v3(1.0,1.0,1.0);
	
	this.credits = 0;
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
		if (this.planets[i].type == "factory")
		{
			this.planets[i].buildShip("Frigate");
			//TODO: attempt to build a ship
			//Xixi, update plans for this planet
			//make a Frigate ship
			//currPlanet.productionPlan.release(); //release finished ships and add them to fleet
		}
	}
	
	//now look for possible target planets
	for (var i = 0; i < this.planets.length; i++) {
		var currPlanet = this.planets[i];
		console.log(currPlanet.ships);
		for (var j = 0; j < currPlanet.linkedPlanets.length; j++)
		{
			var linkedPlanet = currPlanet.linkedPlanets[j];
			
			//TODO: add better checks here besides just do we
			//have more ships than them...
			if (linkedPlanet.player != this.id &&
				linkedPlanet.myFleet.Frigates.length <
				currPlanet.myFleet.Frigates.length)
				//linkedPlanet.ships.length < currPlanet.ships.length)
			{
				linkedPlanet.recieveHostileFleet(currPlanet.myFleet);
				//TODO: send ships out to take over linkedPlanet
			}
		}
	}
	
}
