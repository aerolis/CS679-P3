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
	
	this.planets = [];
	this.factories = [];

	this.fighter = false;
	this.dreadnaught = false;
	this.cruiser = false;
	this.capital = false;
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
	if (this.planets.indexOf(planet) == -1 && planet.player == this.id)
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

player.prototype.hasResources = function(c,s,p,a)
{
	var check = true;
	if (this.credits < c)
		check = false;
	if (this.steel < s)
		check = false;
	if (this.plasma < p)
		check = false;
	if (this.antimatter < a)
		check = false;
	return check;
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
			selectedPlanet = this.planets[i];
			status = this.planets[i].buildShip("frigate", 1);
			if (!status) break;
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
			    var ourShips = 	currPlanet.myFleet.getWeightedMovableLength();
			    
			    var enemyShips = linkedPlanet.myFleet.getWeightedMovableLength();
				if(ourShips >= enemyShips)
				{
					//console.log("AI wants to attack!");
					//linkedPlanet.recieveHostileFleet(currPlanet.myFleet);
					selectedPlanet = currPlanet;
					
					//selected everything
					selectedPlanet.selectScouts();
					selectedPlanet.selectFrigates();
					selectedPlanet.selectFighters();
					selectedPlanet.selectDreadnaughts();
					selectedPlanet.selectCruisers();
					selectedPlanet.selectcapitals();
					
					targetPlanet = linkedPlanet;
					targetPlanet.tryReceiveFleet();
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
		var numShips = 	currPlanet.myFleet.getTotal();
		if(numShips > 0 && dangerPlanets.indexOf(currPlanet) == -1)
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
				
				sendPlanet = this.findPlanetToReinforce(currPlanet);
				if (sendPlanet == null) {
					//var rand = Math.floor(Math.random()*currPlanet.linkedPlanets.length);
					//sendPlanet = currPlanet.linkedPlanets[rand];
					sendPlanet = this.findPlanetToReinforce(currPlanet);
				}
			}
			selectedPlanet = currPlanet;
			selectedPlanet.selectScouts();
			selectedPlanet.selectFrigates();
			selectedPlanet.selectFighters();
			selectedPlanet.selectDreadnaughts();
			selectedPlanet.selectCruisers();
			selectedPlanet.selectcapitals();
			targetPlanet = sendPlanet;
			targetPlanet.tryReceiveFleet();
		}
	}	
}

player.prototype.findPlanetToReinforce = function(planet)
{
	var clearPlanets = function() {
		for( i = 0; i < mp.systems.length; i++) {
			for( j = 0; j < mp.systems[i].planets.length; j++) {
				mp.systems[i].planets[j].visited = false;
				mp.systems[i].planets[j].parent = null;
			}
		}
	}
	
	clearPlanets();

	var LinkedList = function() {
		this.firstNode = null;
		this.lastNode = null;
		this.size = 0;
		this.add = function(planet) {
			if(this.firstNode == null) {
				this.firstNode = planet;
				this.lastNode = planet;
			} else {
				this.lastNode.next = planet;
				this.lastNode = planet;
			}

			this.size++;
		}
		this.remove = function() {
			if (this.size == 0) return;
			var n = this.firstNode;
			this.firstNode = this.firstNode.next;
			this.size--;
			return n;
		}
	}

	var enemyFound = false;
	var planetToReinforce = null;
	var queue = new LinkedList();
	var root = planet;
	root.visited = true;
	queue.add(root);
	while(queue.size != 0)
	{
		var n = queue.remove();
		for(var i = 0; i < n.linkedPlanets.length; i++) {
			var childPlanet = n.linkedPlanets[i];
			if (childPlanet.player != this.id) { //TODO: and enemy planet isn't neutral
					enemyFound = true;
					break;
			}
			if (!childPlanet.visited) {
				childPlanet.visited = true;
				childPlanet.parent = n;
				queue.add(childPlanet);
			}
		}
		if (enemyFound) {
			var parent = n.parent;
			if (parent == null) {
				planetToReinforce = root;
			} else  if (parent.parent == null){
				planetToReinforce = n;
			} else {
				while(parent.parent != null) {
					n = parent;
					parent = n.parent;
				}
				planetToReinforce = n;
			}
			break;
		}
	}
	
	clearPlanets();
	
	return planetToReinforce;
	
}

player.prototype.clearTech  = function(){
	this.fighter = false;
	this.dreadnaught = false;
	this.cruiser = false;
	this.capital = false;
}

