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
				ctx.drawImage(getPlanetImage(selectedPlanet.type), OptionBarX + OptionBarSidesWidth + 25, OptionBarY + OptionBarMiddleDif + 30 );
				ctx.fillText("Planet type: " + selectedPlanet.type, OptionBarX + OptionBarSidesWidth + 20 + 10, OptionBarY + OptionBarMiddleDif + 30);
				ctx.fillText("Planet level: " + selectedPlanet.upgradeLevel, OptionBarX + OptionBarSidesWidth + 20 + 10, OptionBarY + OptionBarMiddleDif + 55);
				if (selectedPlanet.upgradeLevel < selectedPlanet.upgradeStats.maxUpgradeLevel){
					// !!! Should be nicer.
					ctx.fillText("Upgrade cost: " + selectedPlanet.upgradeStats.credits + ", " + selectedPlanet.upgradeStats.steel + ", " + selectedPlanet.upgradeStats.plasma + ", " + selectedPlanet.upgradeStats.antimatter, OptionBarX + OptionBarSidesWidth + 20 + 10, OptionBarY + OptionBarMiddleDif + 80);
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

