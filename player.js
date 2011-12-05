function player (i)
{
	this.id = i;
	
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