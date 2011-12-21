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

var ShipButtonWidth;
var ShipButtonHeight;

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

var drawHover;
var planetHover;
var shipHover;
var researchHover;
var planetXY;

function initDraw2d(){
	OptionBarSidesWidth = 450;
	OptionBarWidth = canvas.width;
	OptionBarHeight = 250;
	OptionBarMiddleDif = 50;
	OptionBarX = 0;
	OptionBarY = canvas.height - OptionBarHeight;	
		
	ShipButtonWidth = (OptionBarSidesWidth - 20)/4     //=107.5
	ShipButtonHeight = (OptionBarHeight - 20)/3        //=73.3
		
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
		
			//Print inventory
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
				/*
				//Draw options
				if (selectedPlanet.fl_showOptions == true){
					selectedPlanet.optionButtons.draw();
				}
				//Draw available units
				if (selectedPlanet.fl_showShips == true){
					selectedPlanet.shipButtons.draw();
				}
				*/
				
				if (selectedPlanet.player == currentPlayer){
					selectedPlanet.optionButtons.draw();	
				}
				selectedPlanet.shipButtons.draw();
				
				//Draw info
				ctx.fillStyle = 'white';
				ctx.font = "14pt Calibri";
				img.drawPlanetImage(selectedPlanet.type, OptionBarX + OptionBarSidesWidth + 25, OptionBarY + OptionBarMiddleDif + 25 );
				ctx.fillText("" + selectedPlanet.name, OptionBarX + OptionBarSidesWidth + 30, OptionBarY + OptionBarMiddleDif + 100);
				
				ctx.font = "14pt Calibri";
				ctx.fillText("" + selectedPlanet.type, OptionBarX + OptionBarSidesWidth + 30, OptionBarY + OptionBarMiddleDif + 115);
				
				ctx.font = "12pt Calibri";
				ctx.fillText("level: " + selectedPlanet.upgradeLevel, OptionBarX + OptionBarSidesWidth + 30, OptionBarY + OptionBarMiddleDif + 130);
								
				
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
				
			//drawing the hover menu
			if (drawHover == 0)
				onHover(mousex,mousez,0,shipHover);
			else if (drawHover == 1)
				onHover(mousex,mousez,1,researchHover);
			else if (drawHover == 2)
				onHover(mousex,mousez,2,planetHover);	
			
			permaButtons.draw();
			
			if(combatResultScreen.active){
				combatResultScreen.draw();
			}
			
			if (drawFPS)
			{
				ctx.font = "12pt Calibri";
				ctx.fillText("FPS:"+fps,20,70);
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
	//type: ship/research/planet
	//obj: the ref being hovered over
	var width = 250;
	var height = 220;
	var x_offset = 0;
	var y_offset = 0;
	if (type == 0) //ship
	{
		//first draw background rectangle
		if (x > canvas.width-width)
			x_offset = -width;
		y_offset = -height;
		ctx.drawImage(img.hover_background_220,x+x_offset,y+y_offset);
		// next calc ship_type
		var sh;
		switch (obj)
		{
			case "Frigates":
				sh = new ship(-1,"frigate");
			break;
			case "Cruisers":
				sh = new ship(-1,"cruiser");
			break;
			case "Capitals":
				sh = new ship(-1,"capital");
			break;
			case "Scouts":
				sh = new ship(-1,"scout");
			break;
			case "Fighters":
				sh = new ship(-1,"fighter");
			break;
			case "Dreadnaughts":
				sh = new ship(-1,"dreadnaught");
			break;
			//TODO fix that this case doesn't happen
			default:
				sh = new ship(-1, "frigate");
			break;
		}
		
		//draw the rest on thisctx.font = "15pt Calibri";
		img.drawShipImage(sh.type, x + 15 + x_offset, y + 10 + y_offset );
		ctx.font = "13pt Calibri";
		ctx.fillText("" + sh.type, x + 22 + x_offset, y + 85 + y_offset);
				
		ctx.fillStyle = 'white';
		ctx.font = "13pt Calibri";
		var off = 10;
		var left = 110;
		var stat_off = 80;
		ctx.fillText("stats", x + left + x_offset, y + 40 + y_offset);
		ctx.font = "12pt Calibri";
		off += 16;
		ctx.fillText("lasers: ", x + (left+10) + x_offset, y + 40 + y_offset + off);
		ctx.fillText("" + sh.laser, x + (left+10) + x_offset + stat_off, y + 40 + y_offset + off);
		off += 16;
		ctx.fillText("missiles: ", x + (left+10) + x_offset, y + 40 + y_offset + off);
		ctx.fillText("" + sh.missile, x + (left+10) + x_offset + stat_off, y + 40 + y_offset + off);
		off += 32;
		ctx.fillText("armor: ", x + (left+10) + x_offset, y + 40 + y_offset + off);
		ctx.fillText("" + sh.armor, x + (left+10) + x_offset + stat_off, y + 40 + y_offset + off);
		off += 16;
		ctx.fillText("shields: ", x + (left+10) + x_offset, y + 40 + y_offset + off);
		ctx.fillText("" + sh.shield, x + (left+10) + x_offset + stat_off, y + 40 + y_offset + off);
		off += 16;
		ctx.fillText("health: ", x + (left+10) + x_offset, y + 40 + y_offset + off);
		ctx.fillText("" + sh.maxHp, x + (left+10) + x_offset + stat_off, y + 40 + y_offset + off);
		off += 16;
		ctx.fillText("build turns: ", x + (left+10) + x_offset, y + 40 + y_offset + off);
		ctx.fillText("" + sh.period, x + (left+10) + x_offset + stat_off, y + 40 + y_offset + off);
		
		//now draw cost
		ctx.font = "13pt Calibri";
		ctx.fillText("cost:", x+x_offset+20,y+y_offset+115);
		//draw cost img
		ctx.drawImage(img.planet_cost, x+x_offset+5,y+y_offset+125);
		//now draw upgrade costs
		ctx.font = "12pt Calibri";
		ctx.fillText(sh.credits, x+x_offset+35, y+y_offset + 136);
		ctx.fillText(sh.steel, x+x_offset+35, y+y_offset + 136+16);
		ctx.fillText(sh.plasma, x+x_offset+35, y+y_offset + 136+32);
		ctx.fillText(sh.antiMatter, x+x_offset+35, y+y_offset + 136+48);

	}
	else if (type == 1)
	{		
		if (x > canvas.width-width)
			x_offset = -width;
		y_offset = -height;
		ctx.drawImage(img.hover_background_220,x+x_offset,y+y_offset);
		// next calc ship_type
		var research;
		var name_1;
		var name_2;
		var desc_1 = "";
		var desc_2 = "";
		var desc_3 = "";
		var desc_4 = "";
		var desc_5 = "";
		
		var benefit_1 = "";
		var benefit_2 = "";
		var benefit_3 = "";
		switch (obj)
		{
			case "Lasers":
				research = new shipProj("laser");
				name_1 = "phased laser";
				name_2 = "arrays";
				desc_1 = "Researching phased lasers";
				desc_2 = "is required for construction";
				desc_3 = "of fighters, capital ships,";
				desc_4 = "and dreadnaughts.";
				benefit_1 = "Researching will result in large bonus";
				benefit_2 = "to laser damage from affected ships.";
			break;
			case "Shields":
				research = new shipProj("shields");
				name_1 = "magnetic deflector";
				name_2 = "shields";
				desc_1 = "Researching deflector shields";
				desc_2 = "is required for construction";
				desc_3 = "of cruisers, capital ships,";
				desc_4 = "and dreadnaughts.";
				benefit_1 = "Researching will result in large bonus";
				benefit_2 = "to shield strength for affected ships.";
			break;
			case "Adv_Missiles":
				research = new shipProj("advMissile");
				name_1 = "thermoferrite hyper";
				name_2 = "torpedoes";
				desc_1 = "Researching hyper torpedoes";
				desc_2 = "is required for construction";
				desc_3 = "of cruisers and capital";
				desc_4 = "ships.";
				benefit_1 = "Researching will result in large bonus";
				benefit_2 = "to missile damage from missile ships.";
			break;
			case "Reactors":
				research = new shipProj("reactor");
				name_1 = "antimatter charge";
				name_2 = "reactors";
				desc_1 = "Researching antimatter";
				desc_2 = "reactors is required for";
				desc_3 = "construction of capital";
				desc_4 = "ships.";
				benefit_1 = "Researching will result in large bonus";
				benefit_2 = "to attack and defense bonuses for";
				benefit_3 = "capital ships.";
			break;
		}
		//draw image and name
		img.drawResearchImage(research.type, x + 15 + x_offset, y + 10 + y_offset );
		ctx.font = "14.5pt Calibri";
		ctx.fillText("" + name_1, x + 84 + x_offset, y + 32 + y_offset);
		ctx.fillText("" + name_2, x + 96 + x_offset, y + 32 + 17 + y_offset);
		
		//now draw cost
		ctx.font = "14pt Calibri";
		var off = 86;
		ctx.fillText("cost:", x+x_offset+20,y+y_offset+off);
		//draw cost img
		off += 6;
		ctx.drawImage(img.planet_cost, x+x_offset+5,y+y_offset+off);
		//now draw upgrade costs
		ctx.font = "12pt Calibri";
		off += 11;
		ctx.fillText(research.credits, x+x_offset+35, y+y_offset + off);
		off += 16;
		ctx.fillText(research.steel, x+x_offset+35, y+y_offset + off);
		off += 16;
		ctx.fillText(research.plasma, x+x_offset+35, y+y_offset + off);
		off += 16;
		ctx.fillText(research.antimatter, x+x_offset+35, y+y_offset + off);

		//write description
		ctx.font = "11.5pt Calibri";
		off = 100;
		ctx.fillText(desc_1, x+x_offset+70,y+y_offset+off);
		off += 14;
		ctx.fillText(desc_2, x+x_offset+70,y+y_offset+off);
		off += 14;
		ctx.fillText(desc_3, x+x_offset+70,y+y_offset+off);
		off += 14;
		ctx.fillText(desc_4, x+x_offset+70,y+y_offset+off);
		off += 14;
		ctx.fillText(desc_5, x+x_offset+70,y+y_offset+off);

		off = 175;
		ctx.fillText(benefit_1, x+x_offset+10,y+y_offset+off);
		off += 14;
		ctx.fillText(benefit_2, x+x_offset+10,y+y_offset+off);
		off += 14;
		ctx.fillText(benefit_3, x+x_offset+10,y+y_offset+off);
	}
	else if (type == 2)
	{
		var pl = mp.systems[obj.a].planets[obj.b];
		if (x > canvas.width-width)
			x_offset = -width;
		if (y > canvas.height-height)
			y_offset = -height;
		ctx.drawImage(img.hover_background,x+x_offset,y+y_offset);
		//now draw data
		ctx.font = "14pt Calibri";
		img.drawPlanetImage(pl.type, x + 15 + x_offset, y + 10 + y_offset );
		ctx.fillText("" + pl.name, x + 15 + x_offset, y + 85 + y_offset);
		
		ctx.font = "13pt Calibri";
		ctx.fillText("" + pl.type, x + 25 + x_offset, y + 100 + y_offset);
		
		ctx.font = "12pt Calibri";
		ctx.fillText("level: " + pl.upgradeLevel, x + 25 + x_offset, y + 115 + y_offset);
		
		//now draw ship types
		ctx.font = "13pt Calibri";
		ctx.fillText("ships", x + 110 + x_offset, y + 40);
		ctx.font = "12pt Calibri";
		var drawAny = false;
		var plusAmt = -4;
		if (pl.myFleet.Scouts.length > 0 || pl.myFleet.ScoutsMoved.length > 0)
		{
			drawAny = true;
			var amt = pl.myFleet.Scouts.length + pl.myFleet.ScoutsMoved.length;
			if (amt > 1)
				ctx.fillText(amt + " scouts", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			else
				ctx.fillText(amt + " scout", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			plusAmt += 13;
		}
		if (pl.myFleet.Frigates.length > 0 || pl.myFleet.FrigatesMoved.length > 0)
		{
			drawAny = true;
			var amt = pl.myFleet.Frigates.length + pl.myFleet.FrigatesMoved.length;
			if (amt > 1)
				ctx.fillText(amt + " frigates", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			else
				ctx.fillText(amt + " frigate", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			plusAmt += 13;
		}
		if (pl.myFleet.Fighters.length > 0 || pl.myFleet.FightersMoved.length > 0)
		{
			drawAny = true;
			var amt = pl.myFleet.Fighters.length + pl.myFleet.FightersMoved.length;
			if (amt > 1)
				ctx.fillText(amt + " fighters", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			else
				ctx.fillText(amt + " fighter", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			plusAmt += 13;
		}
		if (pl.myFleet.Dreadnaughts.length > 0 || pl.myFleet.DreadnaughtsMoved.length > 0)
		{
			drawAny = true;
			var amt = pl.myFleet.Dreadnaughts.length + pl.myFleet.DreadnaughtsMoved.length;
			if (amt > 1)
				ctx.fillText(amt + " dreadnaughts", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			else
				ctx.fillText(amt + " dreadnaught", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			plusAmt += 13;
		}
		if (pl.myFleet.Cruisers.length > 0 || pl.myFleet.CruisersMoved.length > 0)
		{
			drawAny = true;
			var amt = pl.myFleet.Cruisers.length + pl.myFleet.CruisersMoved.length;
			if (amt > 1)
				ctx.fillText(amt + " cruisers", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			else
				ctx.fillText(amt + " cruiser", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			plusAmt += 13;
		}
		if (pl.myFleet.Capitals.length > 0 || pl.myFleet.CapitalsMoved.length > 0)
		{
			drawAny = true;
			var amt = pl.myFleet.Capitals.length + pl.myFleet.CapitalsMoved.length;
			if (amt > 1)
				ctx.fillText(amt + " capital ships", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			else
				ctx.fillText(amt + " capital ship", x + 120 + x_offset, y + 60 + plusAmt + y_offset);
			plusAmt += 13;
		}
		if (!drawAny)
		{
			ctx.fillText("none orbiting", x + 120 + x_offset, y + 60 + y_offset);
		}
	}
}

function draw2DLoading()
{ 
	if (canvas_b == null)
		return null;
	if (ctx == null)
		return null;
	if (!drawTutorial)
	{
		ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );
		ctx.drawImage(splash,0,0);
		
		//draw loading
		//length of loading bar
		var part_a = modelsChecked/totalModels;
		var part_b = modelsBound/totalModels;
		var part_c = initsComplete/totalInits;	
		var part_d;
		if (checkMapComplete)
			part_d = 10;
		else
			part_d = 0;
	
		var length = 190*(part_a+part_b+part_c)/3+part_d;
		ctx.fillStyle = "rgba(0,0,0,0.6)";
		ctx.fillRect(796,596,208,48);
		if (length < 200)
			ctx.fillStyle = "rgba(150,15,30,0.6)";
		else
			ctx.fillStyle = "rgba(15,120,20,0.6)";
		ctx.fillRect(800,600,length,40);
		
		//draw next button
		if (allReady)
		{
			ctx.drawImage(new_game_button,800,660);
		}
	}
	else
	{
		ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );
		
		ctx.drawImage(img.tutorial_background,0,0);
		ctx.drawImage(img.tutorial_words[tutorialState],img.tutorial_xy[tutorialState].x,img.tutorial_xy[tutorialState].y);

		//draw next button
		if (allReady)
		{
			if (tutorialState < tutorialMaxState)
				ctx.drawImage(img.next_button,500,100);
			else
				ctx.drawImage(new_game_button,500,100);
		}
	}
}
