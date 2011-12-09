//for 2D - GUI/HUD drawing.
//separated from 3D since Nate will be doing mostly 3D
//and Tessa will be doing a bunch of 2D, so it will make
//git merging easier if we aren't both editing the same thing
var OptionBarX;
var OptionBarY;
var OptionBarWidth;
var OptionBarHeight;
var OptionBarSidesWidth;
var OptionBarMiddleDif;


var InfoBarX;
var InfoBarY;
var InfoBarWidth;
var InfoBarHeight;

var unitsStart;
var unitsWidth;
var planetStart;
var planetWidth;
var permaStart;	

var permaButtons;
var combatResultScreen;		

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
	
	unitsStart = OptionBarX + 10;
	planetStart = OptionBarX + 410;
	permaStart = OptionBarX + 900;			
	
	permaButtons = new buttonset();
	permaButtons.addButton(InfoBarX + InfoBarWidth - 210, InfoBarY + 5, 200, 36, '#657383', "", buttonType.EndTurn);
	
	combatResultScreen = new combatResults();
	
}

function draw2d()
{
	// !!! Maybe I don't need to set these things every step...
	this.originX = 10;
	this.originY = canvas.height - 90;
	this.width = canvas.width - 20;
	this.height = 80;
	
	ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );


	switch (playState){
		case 0:
			//draw loading screen
			break;
		case 1:
			//Default Game state
			
			//Draw infobar background
			ctx.drawImage(img.info_bar,InfoBarX,InfoBarY);
		
			//Print inventoryw
			ctx.fillStyle = 'white';
			ctx.font = "15pt Calibri";		
			ctx.fillText(players[0].credits,InfoBarX+110,InfoBarY+30);
			ctx.fillText(players[0].steel,InfoBarX+300,InfoBarY+30);
			ctx.fillText(players[0].plasma,InfoBarX+490,InfoBarY+30);
			ctx.fillText(players[0].antimatter,InfoBarX+680,InfoBarY+30);
			
			
			//Draw background for HUD
			ctx.drawImage(img.options_bar,OptionBarX,OptionBarY-10);
			
						
			//Draw everything related to selected planet 
			if (selectedPlanet != null){
				//Draw options
				if (selectedPlanet.fl_showOptions == true){
					selectedPlanet.optionButtons.draw();
				}
				//Draw available units
				if (selectedPlanet.fl_showShips == true){
					selectedPlanet.shipButtons.draw();
				}
				//Draw info
				ctx.fillStyle = 'white';
				ctx.font = "15pt Calibri";
				img.drawPlanetImage(selectedPlanet.type, OptionBarX + OptionBarSidesWidth + 25, OptionBarY + OptionBarMiddleDif + 25 );
				ctx.fillText("" + selectedPlanet.type, OptionBarX + OptionBarSidesWidth + 30, OptionBarY + OptionBarMiddleDif + 100);
				
				ctx.font = "12pt Calibri";
				ctx.fillText("level: " + selectedPlanet.upgradeLevel, OptionBarX + OptionBarSidesWidth + 30, OptionBarY + OptionBarMiddleDif + 115);
				
				
				
				if (selectedPlanet.upgradeLevel < selectedPlanet.upgradeStats.maxUpgradeLevel && selectedPlanet.player == currentPlayer){
					ctx.font = "13pt Calibri";
					ctx.fillText("upgrade cost:", OptionBarX + OptionBarSidesWidth + 120, OptionBarY + OptionBarMiddleDif + 40);
					//draw upgrade img
					ctx.drawImage(img.planet_cost, OptionBarX + OptionBarSidesWidth + 110, OptionBarY + OptionBarMiddleDif + 50);
					//now draw upgrade costs
					ctx.font = "12pt Calibri";
					ctx.fillText(selectedPlanet.upgradeStats.credits, OptionBarX + OptionBarSidesWidth + 140, OptionBarY + OptionBarMiddleDif + 62);
					ctx.fillText(selectedPlanet.upgradeStats.steel, OptionBarX + OptionBarSidesWidth + 140, OptionBarY + OptionBarMiddleDif + 62+16);
					ctx.fillText(selectedPlanet.upgradeStats.plasma, OptionBarX + OptionBarSidesWidth + 140, OptionBarY + OptionBarMiddleDif + 62+32);
					ctx.fillText(selectedPlanet.upgradeStats.antimatter, OptionBarX + OptionBarSidesWidth + 140, OptionBarY + OptionBarMiddleDif + 62+48);
				}
			}
				
			permaButtons.draw();
			
			if(combatResultScreen.active){
				combatResultScreen.draw();
			}
			
			break;
			
		case 2: // ??
			break;
		case 3: // ??
			break;
	}		
}

function onHover(x,y,type,obj)
{
	//x: x pos
	//y: y pos
	//type: ship/research/planet
	//obj: the ref being hovered over
	var width = 250;
	var height = 300;
	var x_offset = 0;
	if (type == 0) //ship
	{
		//first draw background rectangle
		if (y > canvas.width)
			x_offset = -width;
		//draw at x+x_offset,y
		
		//draw the rest on this
	}
	else if (type == 2)
	{
		ctx.drawImage(img.hover_background,x,y);
	}
}