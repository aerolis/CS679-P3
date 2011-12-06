/**
 * @author Dan
 */

function SolarSystem() {
	this.planets = [];
	this.numOfPlanets = 0;
	this.sunRot_rate = new v3(0,Math.random()*0.1,0);
	this.rot = new v3(0,0,0);
	this.sunColor = new v3(0.90,0.32,0.11);
	//this.sunColor = new v3(0.31,0.81,0.94);
	this.sunScale = 0.9+Math.random()*0.2;
	this.sunModel = 5;
	this.sunHaloModel = 7;
	this.sunHaloRot = new v3(0,0,0);
	this.pos = new v3(0,0,0); //just assigning them a random position for now
}
SolarSystem.prototype.addPlanet = function(planet)
{
	this.planets.push(planet);
	this.numOfPlanets++;
	return this.planets.indexOf(planet);
}
SolarSystem.prototype.update = function()
{
	for(var i = 0; i < this.planets.length; i++) {
		this.planets[i].update();
	}
	//update sun rotation
	this.rot.x += this.sunRot_rate.x % 360;
	this.rot.y += this.sunRot_rate.y % 360;
	this.rot.z += this.sunRot_rate.z % 360;
	
	//calculate the billboard rotations
	var dx = cam.pos.x-this.pos.x;
	var dy = cam.pos.y-this.pos.y;
	var dz = cam.pos.z-this.pos.z;
	var dh = Math.sqrt(dx*dx+dz*dz);
	this.sunHaloRot.y = Math.atan2(dz,dx);
	this.sunHaloRot.x = Math.atan2(dy,dh);
	this.sunHaloRot.z += 0.001%(2*Math.PI);
}
SolarSystem.prototype.init = function()
{
		//presumably we can just pass an argument to this
		//function that will determine what system to create
		//this.createSystem1();
		//this.createSystem2();
		this.createSystem3();
}
SolarSystem.prototype.randomizeColor = function()
{
	this.sunColor = new v3(Math.random(),Math.random(),Math.random());
}
SolarSystem.prototype.setPos = function(pos)
{
	this.pos.x = pos.x;
	this.pos.y = pos.y;
	this.pos.z = pos.z;
}


SolarSystem.prototype.createSystem1 = function()
{
	//create some hardcoded planets for now...dw
	//args are position, type, size, owner, connected planets, 
	//ships garrisoned
	this.addPlanet(new Planet({x:0,y:0,z:0}, "factory", 30, 
							   0, [], [], 0));
	
	this.addPlanet(new Planet({x:500,y:60,z:0}, "plasma", 30, 
							  0, [], [], 0));
	
	this.addPlanet(new Planet({x:-500,y:0,z:500}, "steel", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:-500,y:-20,z:-200}, "antimatter", 30, 
							  1, [], [], 0));

	this.planets[0].linkPlanet("0-1");
	this.planets[0].linkPlanet("0-2");
	this.planets[2].linkPlanet("0-3");
}
SolarSystem.prototype.createSystem2 = function()
{
	//This could serve as a tutorial system where the player starts
	//with 1 factory and 1 only credit producing planet and can
	//only build a simple ship to start that only requires credits
	
	//For the tutorial, the user has to conquer each type of 
	//resource gathering planet (each of which presumably
	//unlocks a new ship) and then the research planet
	
	this.addPlanet(new Planet({x:0,y:0,z:0}, "factory", 30, 
							   0, [], [], 0));
							
	//this should be a "gold" planet that produces only credits...
	this.addPlanet(new Planet({x:0,y:0,z:400}, "credit", 30,
				   			  0, [], [], 0));
	
	this.addPlanet(new Planet({x:500,y:0,z:0}, "plasma", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:-500,y:0,z:0}, "steel", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:0,y:0,z:-400}, "antimatter", 30, 
							  -1, [], [], 0));

	//this should really be a "research" planet...
	this.addPlanet(new Planet({x:-750,y:0,z:-500}, "factory", 30,
				   			  -1, [], [], 0));
				   			  			   			  
	this.planets[0].linkPlanet("0-1");
	this.planets[0].linkPlanet("0-2");
	this.planets[0].linkPlanet("0-3");
	this.planets[0].linkPlanet("0-4");
	this.planets[2].linkPlanet("0-4");
	this.planets[3].linkPlanet("0-5");
}
SolarSystem.prototype.createSystem3 = function()
{
	//This could serve as a larger game map where the player
	//plays against the computer
	
	//THOUGHT: this is built as one solar system... shouldn't we build individual systems
	//and link those together? 
	
	//---------------PLAYER ZONE-----------------------------//
	this.addPlanet(new Planet({x:475,y:50,z:400}, "factory", 30, 
							   0, [], [], 0));
							
	//this should be a "gold" planet that produces only credits...
	this.addPlanet(new Planet({x:0,y:0,z:400}, "credit", 30,
				   			  0, [], [], 0));
	
	this.addPlanet(new Planet({x:500,y:0,z:0}, "plasma", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:-500,y:-20,z:0}, "steel", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:0,y:0,z:-400}, "antimatter", 30, 
							  -1, [], [], 0));

	//this should really be a "research" planet...
	this.addPlanet(new Planet({x:-750,y:0,z:-500}, "factory", 30,
				   			  -1, [], [], 0));
	
	//this should be a "gateway planet" if we end up having those...			   			  
	this.addPlanet(new Planet({x:750,y:0,z:-600}, "steel", 30,
				   			  -1, [], [], 0));			   			 
				   			  			   			  
	this.planets[0].linkPlanet("0-1");
	this.planets[0].linkPlanet("0-2");
	this.planets[0].linkPlanet("0-4");
	this.planets[3].linkPlanet("0-1");
	this.planets[3].linkPlanet("0-4");
	this.planets[2].linkPlanet("0-4");
	this.planets[3].linkPlanet("0-5");
	this.planets[4].linkPlanet("0-5");
	this.planets[6].linkPlanet("0-2");
	this.planets[6].linkPlanet("0-4");
	
	//---------LAND OF THE NEUTRALS (center of map)------------///
	
	//should be a "gateway planet"...
	this.addPlanet(new Planet({x:1750,y:0,z:-1500}, "steel", 30,
				   			  -1, [], [], 0));
				   			  
	this.planets[6].linkPlanet("0-7");
	
	this.addPlanet(new Planet({x:1550,y:0,z:-1700}, "factory", 30,
				   			  -1, [], [], 0));
	this.planets[7].linkPlanet("0-8");
	
	this.addPlanet(new Planet({x:2300,y:0,z:-1700}, "plasma", 30,
				   			  -1, [], [], 0));
	this.planets[7].linkPlanet("0-9");
	
	this.addPlanet(new Planet({x:2300,y:0,z:-2000}, "antimatter", 30,
				   			  -1, [], [], 0));
	this.planets[7].linkPlanet("0-10");
	
	this.planets[8].linkPlanet("0-10");
	this.planets[9].linkPlanet("0-10");
	
	this.addPlanet(new Planet({x:2700,y:0,z:-2400}, "factory", 30,
				   			  -1, [], [], 0));
	this.planets[10].linkPlanet("0-11");
	
	this.addPlanet(new Planet({x:3400,y:0,z:-2400}, "antimatter", 30,
				   			  -1, [], [], 0));
	this.planets[11].linkPlanet("0-12");
	
	this.addPlanet(new Planet({x:3700,y:0,z:-2300}, "factory", 30,
				   			  -1, [], [], 0));
	this.planets[12].linkPlanet("0-13");
	
	this.addPlanet(new Planet({x:3000,y:0,z:-2000}, "plasma", 30,
				   			  -1, [], [], 0));
	this.planets[12].linkPlanet("0-14");
	this.planets[14].linkPlanet("0-9");
	
	//a "gateway planet"...
	this.addPlanet(new Planet({x:4000,y:0,z:-1900}, "steel", 30,
				   			  -1, [], [], 0));
	this.planets[15].linkPlanet("0-12");
	this.planets[15].linkPlanet("0-13");
	this.planets[15].linkPlanet("0-14");
	
	//-----------------ENEMY ZONE--------------------------//
	this.addPlanet(new Planet({x:5000,y:0,z:-500}, "factory", 30, 
							   1, [], [], 0));
							
	//this should be a "gold" planet that produces only credits...
	this.addPlanet(new Planet({x:5000,y:0,z:-100}, "credit", 30,
				   			  1, [], [], 0));
	
	this.addPlanet(new Planet({x:4500,y:0,z:-500}, "plasma", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:5500,y:0,z:-500}, "steel", 30, 
							  -1, [], [], 0));
	
	this.addPlanet(new Planet({x:5000,y:0,z:-1200}, "antimatter", 30, 
							  -1, [], [], 0));

	//this should really be a "research" planet...
	this.addPlanet(new Planet({x:5750,y:0,z:-1000}, "factory", 30,
				   			  -1, [], [], 0));
	
	//this should be a "gateway planet" if we end up having those...			   			  
	this.addPlanet(new Planet({x:4250,y:0,z:-1100}, "steel", 30,
				   			  -1, [], [], 0));	
							  	   			 
				   			  			   			  
	this.planets[16].linkPlanet("0-17");
	this.planets[16].linkPlanet("0-18");
	this.planets[16].linkPlanet("0-20");
	
	this.planets[18].linkPlanet("0-20");
	this.planets[19].linkPlanet("0-21");
	this.planets[20].linkPlanet("0-21");
	this.planets[17].linkPlanet("0-19");
	this.planets[21].linkPlanet("0-20");
	this.planets[22].linkPlanet("0-18");
	this.planets[22].linkPlanet("0-20");
	this.planets[22].linkPlanet("0-15");
}
