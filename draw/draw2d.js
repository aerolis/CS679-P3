//for 2D - GUI/HUD drawing.
//separated from 3D since Nate will be doing mostly 3D
//and Tessa will be doing a bunch of 2D, so it will make
//git merging easier if we aren't both editing the same thing
var OptionBarX;
var OptionBarY;
var OptionBarWidth;
var OptionBarHeight;

var unitsStart;
var planetStart;
var permaStart;	

var permaButtons;		

function initDraw2d(){
	OptionBarX = 10;
	OptionBarY = canvas.height - 110;
	OptionBarWidth = canvas.width - 20;
	OptionBarHeight = 100;
	
	unitsStart = OptionBarX + 150;
	planetStart = OptionBarX + 410;
	permaStart = OptionBarX + 900;			
	
	permaButtons = new buttonset();
	permaButtons.addButton(permaStart + 10, OptionBarY + 20, 90, OptionBarHeight - 40, '#657383', "End Turn", buttonType.EndTurn);
	
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
			
			//Draw background for HUD
			ctx.fillStyle = '#34282C';
			ctx.fillRect(OptionBarX, OptionBarY, OptionBarWidth, OptionBarHeight);
		
			//Print inventory
			ctx.fillStyle = 'white';
			ctx.font = "15pt Calibri";		
			ctx.fillText("Credits: " + players[0].credits, OptionBarX + 20, OptionBarY + 25);
			ctx.fillText("Steel: " + players[0].steel, OptionBarX + 20, OptionBarY + 45);	
			ctx.fillText("Plasma: " + players[0].plasma, OptionBarX + 20, OptionBarY + 65);	
			ctx.fillText("Antimatter: " + players[0].antimatter, OptionBarX + 20, OptionBarY + 85);	

			
			
			ctx.strokeStyle = 'white';
			ctx.strokeRect(unitsStart, OptionBarY + 10, 250, OptionBarHeight - 20);
			ctx.fillText("Available units; selection", unitsStart + 10, OptionBarY + 40);	

			ctx.strokeRect(planetStart, OptionBarY + 10, 480, OptionBarHeight - 20);
			ctx.fillText("Planet options (send attack, upgrade, create things... ", planetStart + 10, OptionBarY + 40);

			ctx.strokeRect(permaStart, OptionBarY + 10, 200, OptionBarHeight - 20);
			ctx.fillText("Next turn, back to menu... ", permaStart + 10, OptionBarY + 40);			

			//Draw planet menu
			if (selectedPlanet != null && selectedPlanet.showOptions == true){
				selectedPlanet.optionButtons.draw();
			}
			
			permaButtons.draw();
			
			break;
			
		case 2: // ??
			break;
		case 3: // ??
			break;
	}		
}













