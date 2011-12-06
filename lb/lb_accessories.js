//additional functions needed only for the level builder

//from map
map.prototype.initBlank = function()
{
	//
}
map.prototype.rebuildLines = function()
{
	this.bindLines();
	this.bindColors();
	this.bindHalo();
	this.bindHaloColors();
	this.setupPlanetLists();
	this.drawReady = true;
}

//from draw2d
function drawLB2d()
{
	
}