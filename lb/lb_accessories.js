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
	ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );
	
	var lpos = canvas.width - 200;
	var tpos = canvas.height - 50;
	var lpos2 = 50;
	
	ctx.fillStyle = 'white';
	ctx.font = "12pt Calibri";
	
	//current action
	if (placingSS)
		ctx.fillText("Placing new SS",lpos,tpos);
	else if (placingPlanet)
		ctx.fillText("Placing new planet",lpos,tpos);
	else if (linkingPlanet)
	{
		if (linkingStage == 0)
			ctx.fillText("Linking: none selected",lpos,tpos);
		else
			ctx.fillText("Linking: selected SS["+lPlanetA.a+"]:P["+lPlanetA.b+"]",lpos,tpos,200);
	}
	
	//currently selected
	if (currentSS != null)
		ctx.fillText("Current SS: "+currentSS,lpos2,tpos-15);
	if (currentPlanet != null)
		ctx.fillText("Current planet [SS]:" + currentPlanet.a + " [P]:" + currentPlanet.b,lpos2,tpos);
		
}
function initDraw2d(){
	OptionBarSidesWidth = 450;
	OptionBarWidth = canvas.width;
	OptionBarHeight = 250;
	OptionBarMiddleDif = 50;
	OptionBarX = 0;
	OptionBarY = canvas.height - OptionBarHeight;	
	
	InfoBarX = 0;
	InfoBarY = 0;
	InfoBarWidth = canvas.width;
	InfoBarHeight = 50;
	
	unitsStart = OptionBarX + 150;
	planetStart = OptionBarX + 410;
	permaStart = OptionBarX + 900;			
	
	
}