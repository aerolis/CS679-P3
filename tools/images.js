//a file to keep track of loading 2d images
function images()
{
	//initialize all params
	this.info_bar = new Image();
	this.end_turn = new Image();
	this.upgrade_planet = new Image();
	this.ok_button = new Image();
	this.options_bar = new Image();
	this.planet_cost = new Image();
	this.left_arrow = new Image();
	this.right_arrow = new Image();
	this.hover_background = new Image();
	this.hover_background_220 = new Image();
	this.combat_background = new Image();
	this.tutorial_background = new Image();
	
	this.planets_64 = new Array();
	this.ship_buttons = new Array();
	this.research_buttons = new Array();
	this.research_64 = new Array();
	this.filters = new Array();
	this.ship_64 = new Array();
	
	//now load their files
	this.info_bar.src = "images/info_bar.png";
	this.end_turn.src = "images/end_turn_button.png";
	this.upgrade_planet.src = "images/upgrade_planet_button.png";
	this.ok_button.src = "images/ok_button.png";
	this.options_bar.src = "images/options_bar.png";
	this.planet_cost.src = "images/planet_cost.png";
	this.left_arrow.src = "images/left_arrow.png";
	this.right_arrow.src = "images/right_arrow.png";
	this.hover_background.src = "images/hover_background.png";
	this.hover_background_220.src = "images/hover_background_220.png";
	this.combat_background.src = "images/combat_background.png";
	this.tutorial_background.src = "images/tutorial_screen.png";
	
	//load planet images
	var i;
	for (i=0;i<7;i++)
	{
		this.planets_64[i] = new Image();
	}
	this.planets_64[0].src = "images/factory_64.png"; //factory
	this.planets_64[1].src = "images/credit_64.png"; //credit
	this.planets_64[2].src = "images/steel_64.png"; //steel
	this.planets_64[3].src = "images/plasma_64.png"; //plasma
	this.planets_64[4].src = "images/antimatter_64.png"; //antimatter
	this.planets_64[5].src = "images/warp_64.png"; //warp
	this.planets_64[6].src = "images/warp_64.png"; //academy
	
	//load ship images
	for (i=0;i<6;i++)
	{
		this.ship_64[i] = new Image();
	}
	this.ship_64[0].src = "images/f_1_64.png"; //frigate
	this.ship_64[1].src = "images/cr_1_64.png"; //cruiser
	this.ship_64[2].src = "images/c_1_64.png"; //capital
	this.ship_64[3].src = "images/s_1_64.png"; //scout
	this.ship_64[4].src = "images/f_1_64.png"; //fighter
	this.ship_64[5].src = "images/d_1_64.png"; //dreadnaught
	
	//load button filters
	this.filters[0] = new Image();
	this.filters[0].src = "images/filter_blank.png";
	this.filters[1] = new Image();
	this.filters[1].src = "images/filter_grey.png";
	this.filters[2] = new Image();
	this.filters[2].src = "images/filter_red.png";
	this.filters[3] = new Image();
	this.filters[3].src = "images/filter_green.png";
	this.filters[4] = new Image();
	this.filters[4].src = "images/filter_blue.png";
	
	//load planet buttons
	for (i=0;i<6;i++)
	{
		this.ship_buttons[i] = new Image();
	}
	this.ship_buttons[0].src = "images/ship_f_1.png";
	this.ship_buttons[1].src = "images/ship_cr_1.png";
	this.ship_buttons[2].src = "images/ship_c_1.png";
	this.ship_buttons[3].src = "images/ship_s_1.png";
	this.ship_buttons[4].src = "images/ship_f_1.png";
	this.ship_buttons[5].src = "images/ship_d_1.png";
	
	//load research buttons
	for (i=0;i<4;i++)
	{
		this.research_buttons[i] = new Image();
		this.research_64[i] = new Image();
	}
	this.research_buttons[0].src = "images/ship_1.png";
	this.research_buttons[1].src = "images/ship_1.png";
	this.research_buttons[2].src = "images/ship_1.png";
	this.research_buttons[3].src = "images/ship_1.png";
	this.research_64[0].src = "images/warp_64.png";
	this.research_64[1].src = "images/warp_64.png";
	this.research_64[2].src = "images/warp_64.png";
	this.research_64[3].src = "images/warp_64.png";
}

images.prototype.drawPlanetImage = function(type,x,y)
{
	switch (type)
	{
		case "factory":
			ctx.drawImage(img.planets_64[pln_images.factory],x,y);
		break;
		case "credit":
			ctx.drawImage(img.planets_64[pln_images.credit],x,y);
		break;
		case "steel":
			ctx.drawImage(img.planets_64[pln_images.steel],x,y);
		break;
		case "plasma":
			ctx.drawImage(img.planets_64[pln_images.plasma],x,y);
		break;
		case "antimatter":
			ctx.drawImage(img.planets_64[pln_images.antimatter],x,y);
		break;
		case "warp":
			ctx.drawImage(img.planets_64[pln_images.warp],x,y);
		break;
		case "academy":
			ctx.drawImage(img.planets_64[pln_images.academy],x,y);
		break;
		default:
			ctx.drawImage(img.planets_64[pln_images.factory],x,y);
		break;
	}	
}
images.prototype.drawShipImage = function(type,x,y)
{
	switch (type)
	{
		case "frigate":
			ctx.drawImage(img.ship_64[ship_images.frigate],x,y);
		break;
		case "cruiser":
			ctx.drawImage(img.ship_64[ship_images.cruiser],x,y);
		break;
		case "capital":
			ctx.drawImage(img.ship_64[ship_images.capital],x,y);
		break;
		case "scout":
			ctx.drawImage(img.ship_64[ship_images.scout],x,y);
		break;
		case "fighter":
			ctx.drawImage(img.ship_64[ship_images.fighter],x,y);
		break;
		case "dreadnaught":
			ctx.drawImage(img.ship_64[ship_images.dreadnaught],x,y);
		break;
		default:
			ctx.drawImage(img.planets_64[ship_images.frigate],x,y);
		break;
	}
}
images.prototype.drawResearchImage = function(type,x,y)
{
	switch (type)
	{
		case "laser":
			ctx.drawImage(img.research_64[research_images.laser],x,y);
		break;
		case "shields":
			ctx.drawImage(img.research_64[research_images.shield],x,y);
		break;
		case "advMissile":
			ctx.drawImage(img.research_64[research_images.adv_missile],x,y);
		break;
		case "reactor":
			ctx.drawImage(img.research_64[research_images.reactor],x,y);
		break;
	}
}
images.prototype.drawShipButton = function(type,x,y,lhs,rhs,col_ref,c)
{
	c.font = "12pt Calibri";
	c.fillStyle = 'white';
	
	switch (type)
	{
		case "frigate":
			c.drawImage(img.ship_buttons[ship_images.frigate],x,y);
			c.drawImage(img.filters[col_ref],x,y);
			c.fillText(lhs,x+14,y+16);
			c.fillText(rhs,x+80,y+16);
		break;
		case "cruiser":
			c.drawImage(img.ship_buttons[ship_images.cruiser],x,y);
			c.drawImage(img.filters[col_ref],x,y);
			c.font = "12pt Calibri";
			c.fillText(lhs,x+14,y+16);
			c.fillText(rhs,x+80,y+16);
		break;
		case "capital":
			c.drawImage(img.ship_buttons[ship_images.capital],x,y);
			c.drawImage(img.filters[col_ref],x,y);
			c.font = "12pt Calibri";
			c.fillText(lhs,x+14,y+16);
			c.fillText(rhs,x+80,y+16);
		break;
		case "scout":
			c.drawImage(img.ship_buttons[ship_images.scout],x,y);
			c.drawImage(img.filters[col_ref],x,y);
			c.fillText(lhs,x+14,y+16);
			c.fillText(rhs,x+80,y+16);
		break;
		case "fighter":
			c.drawImage(img.ship_buttons[ship_images.fighter],x,y);
			c.drawImage(img.filters[col_ref],x,y);
			c.fillText(lhs,x+14,y+16);
			c.fillText(rhs,x+80,y+16);
		break;
		case "dreadnaught":
			c.drawImage(img.ship_buttons[ship_images.dreadnaught],x,y);
			c.drawImage(img.filters[col_ref],x,y);
			c.font = "12pt Calibri";
			c.fillText(lhs,x+14,y+16);
			c.fillText(rhs,x+80,y+16);
		break;
	}
}

// !!! Add information on how many are in queue.
images.prototype.drawBuildShipButton = function(type,x,y, queuesize, c)
{
	c.font = "12pt Calibri";
	c.fillStyle = 'white';
	var sh;
	
	switch (type)
	{
		case "frigate":
			c.drawImage(img.ship_buttons[ship_images.frigate],x,y);
			sh = new ship(-1,"frigate");
			if (players[currentPlayer].hasResources(sh.credits,sh.steel,sh.plasma,sh.antiMatter))
				c.drawImage(img.filters[0],x,y);
			else
				c.drawImage(img.filters[1],x,y);
		break;
		case "cruiser":
			c.drawImage(img.ship_buttons[ship_images.cruiser],x,y);
			sh = new ship(-1,"cruiser");
			if (players[currentPlayer].hasResources(sh.credits,sh.steel,sh.plasma,sh.antiMatter))
				c.drawImage(img.filters[0],x,y);
			else
				c.drawImage(img.filters[1],x,y);
		break;
		case "capital":
			c.drawImage(img.ship_buttons[ship_images.capital],x,y);
			sh = new ship(-1,"capital");
			if (players[currentPlayer].hasResources(sh.credits,sh.steel,sh.plasma,sh.antiMatter))
				c.drawImage(img.filters[0],x,y);
			else
				c.drawImage(img.filters[1],x,y);
		break;
		case "scout":
			c.drawImage(img.ship_buttons[ship_images.scout],x,y);
			sh = new ship(-1,"scout");
			if (players[currentPlayer].hasResources(sh.credits,sh.steel,sh.plasma,sh.antiMatter))
				c.drawImage(img.filters[0],x,y);
			else
				c.drawImage(img.filters[1],x,y);
		break;
		case "fighter":
			c.drawImage(img.ship_buttons[ship_images.fighter],x,y);
			sh = new ship(-1,"fighter");
			if (players[currentPlayer].hasResources(sh.credits,sh.steel,sh.plasma,sh.antiMatter))
				c.drawImage(img.filters[0],x,y);
			else
				c.drawImage(img.filters[1],x,y);
		break;
		case "dreadnaught":
			c.drawImage(img.ship_buttons[ship_images.dreadnaught],x,y);
			sh = new ship(-1,"dreadnaught");
			if (players[currentPlayer].hasResources(sh.credits,sh.steel,sh.plasma,sh.antiMatter))
				c.drawImage(img.filters[0],x,y);
			else
				c.drawImage(img.filters[1],x,y);
		break;
	}
	
	c.fillText(queuesize,x+14,y+16);
}

images.prototype.drawResearchButton = function(type,x,y,c)
{
	c.font = "12pt Calibri";
	c.fillStyle = 'white';
	var research;
	
	switch (type)
	{
		case "laser":
			c.drawImage(img.research_buttons[research_images.laser],x,y);
			research = new shipProj("laser");
		break;
		case "shield":
			c.drawImage(img.research_buttons[research_images.shield],x,y);
			research = new shipProj("shields");
		break;
		case "adv_missile":
			c.drawImage(img.research_buttons[research_images.adv_missile],x,y);
			research = new shipProj("advMissile");
		break;
		case "reactor":
			c.drawImage(img.research_buttons[research_images.reactor],x,y);
			research = new shipProj("reactor");
		break;
	}	
	//determine if in production
	var rPlan = selectedPlanet.researchPlan;
	var isProducing = false;
	if (rPlan.plan.length > 0)
	{
		if (rPlan.findProject(research.type) > -1)
			isProducing = true;
		else
			isProducing = false;
	}
	//draw filter
	if (!isProducing && players[currentPlayer].hasResources(research.credits,research.steel,research.plasma,research.antimatter))
		c.drawImage(img.filters[0],x,y);
	else if (isProducing)
		c.drawImage(img.filters[4],x,y);		
	else
		c.drawImage(img.filters[1],x,y);
}

var pln_images = { 	"factory": 0,
					"credit": 1,
					"steel": 2,
					"plasma": 3,
					"antimatter": 4,
					"warp": 5,
					"academy": 6,
					};

var ship_images = {	"frigate": 0,
					"cruiser": 1,
					"capital": 2,
					"scout": 3,
					"fighter": 4,
					"dreadnaught": 5
					};
				
var research_images = { "laser": 0,
						"shield": 1,
						"adv_missile": 2,
						"reactor": 3
						};