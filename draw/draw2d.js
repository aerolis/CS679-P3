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
	permaButtons.addButton(permaStart + 10, OptionBarY + 20, 90, OptionBarHeight - 40, '#657383', "End Turn", buttonType.EndTurn);
	
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
			ctx.fillStyle = '#34282C';
			ctx.fillRect(InfoBarX, InfoBarY, InfoBarWidth, InfoBarHeight);
		
			//Print inventory
			ctx.fillStyle = 'white';
			ctx.font = "15pt Calibri";		
			//ctx.fillText("Credits: " + players[0].credits, InfoBarX + 20, InfoBarY + 20);
			//ctx.fillText("Steel: " + players[0].steel, InfoBarX + 100, InfoBarY + 20);	
			//ctx.fillText("Plasma: " + players[0].plasma, InfoBarX + 180, InfoBarY + 20);	
			//ctx.fillText("Antimatter: " + players[0].antimatter, InfoBarX + 260, InfoBarY + 20);	
			ctx.fillText("Credits: " + players[0].credits + "   " + "Steel: " + players[0].steel + "   " + "Plasma: " + players[0].plasma + "   " + "Antimatter: " + players[0].antimatter, InfoBarX + 20, InfoBarY + 30);
			
			//Draw background for HUD
			ctx.beginPath();
			ctx.moveTo(OptionBarX, OptionBarY);
			ctx.lineTo(OptionBarX + OptionBarSidesWidth, OptionBarY);
			ctx.lineTo(OptionBarX + OptionBarSidesWidth + 20, OptionBarY + OptionBarMiddleDif);
			ctx.lineTo(OptionBarWidth - OptionBarSidesWidth - 20, OptionBarY + OptionBarMiddleDif);
			ctx.lineTo(OptionBarWidth - OptionBarSidesWidth, OptionBarY);
			ctx.lineTo(OptionBarX + OptionBarWidth, OptionBarY);
			ctx.lineTo(OptionBarX + OptionBarWidth, OptionBarY + OptionBarHeight);
			ctx.lineTo(OptionBarX, OptionBarY + OptionBarHeight);
			ctx.closePath();
			ctx.lineWidth = 1;
			ctx.fillStyle = '#34282C';			
			ctx.fill();
						
			/*
			ctx.strokeStyle = 'white';
			ctx.strokeRect(unitsStart, OptionBarY + 10, 250, OptionBarHeight - 20);
			ctx.fillText("Available units; selection", unitsStart + 10, OptionBarY + 40);	

			ctx.strokeRect(planetStart, OptionBarY + 10, 480, OptionBarHeight - 20);
			ctx.fillText("Planet options (send attack, upgrade, create things... ", planetStart + 10, OptionBarY + 40);

			ctx.strokeRect(permaStart, OptionBarY + 10, 200, OptionBarHeight - 20);
			ctx.fillText("Next turn, back to menu... ", permaStart + 10, OptionBarY + 40);			
			*/
			//Draw planet menu
			if (selectedPlanet != null && selectedPlanet.fl_showOptions == true){
				selectedPlanet.optionButtons.draw();
			}
			
			if (selectedPlanet != null && selectedPlanet.fl_showShips == true){
				selectedPlanet.shipButtons.draw();
			}
			
			
			permaButtons.draw();
			
			if(combatResultScreen.active){
				console.log("combatResultsScreen should be drawing");
				combatResultScreen.draw();
			}
			
			break;
			
		case 2: // ??
			break;
		case 3: // ??
			break;
	}		
}
