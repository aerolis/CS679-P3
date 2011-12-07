/**
 * @author Dan
 */

function SolarSystem() {
	this.planets = [];
	this.numOfPlanets = 0;
	this.sunRot_rate = new v3(0,Math.random()*0.1,0);
	this.rot = new v3(0,0,0);
	this.sunColor = new v3(1.0,1.0,1.0);
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
