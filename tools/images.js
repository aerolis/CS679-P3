//a file to keep track of loading 2d images
function images()
{
	//initialize all params
	this.info_bar = new Image();
	this.end_turn = new Image();
	this.upgrade_planet = new Image();
	this.options_bar = new Image();
	this.planet_cost = new Image();
	this.left_arrow = new Image();
	this.right_arrow = new Image();
	this.hover_background = new Image();
	
	this.planets_64 = new Array();
	this.ship_buttons = new Array();
	this.filters = new Array();
	
	//now load their files
	this.info_bar.src = "images/info_bar.png";
	this.end_turn.src = "images/end_turn_button.png";
	this.upgrade_planet.src = "images/upgrade_planet_button.png";
	this.options_bar.src = "images/options_bar.png";
	this.planet_cost.src = "images/planet_cost.png";
	this.left_arrow.src = "images/left_arrow.png";
	this.right_arrow.src = "images/right_arrow.png";
	this.hover_background.src = "images/hover_background.png";
	
	//load planet images
	var i;
	for (i=0;i<6;i++)
	{
		this.planets_64[i] = new Image();
	}
	this.planets_64[0].src = "images/credit_64.png"; //factory
	this.planets_64[1].src = "images/credit_64.png"; //credit
	this.planets_64[2].src = "images/steel_64.png"; //steel
	this.planets_64[3].src = "images/plasma_64.png"; //plasma
	this.planets_64[4].src = "images/antimatter_64.png"; //antimatter
	this.planets_64[5].src = "images/warp_64.png"; //warp
	
	//load button filters
	this.filters[0] = new Image();
	this.filters[0].src = "images/filter_blank.png";
	this.filters[1] = new Image();
	this.filters[1].src = "images/filter_grey.png";
	this.filters[2] = new Image();
	this.filters[2].src = "images/filter_red.png";
	this.filters[3] = new Image();
	this.filters[3].src = "images/filter_green.png";
	
	//load planet buttons
	var i;
	for (i=0;i<3;i++)
	{
		this.ship_buttons[i] = new Image();
	}
	this.ship_buttons[0].src = "images/ship_1.png";
	this.ship_buttons[1].src = "images/ship_1.png";
	this.ship_buttons[2].src = "images/ship_1.png";
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
		default:
			ctx.drawImage(img.planets_64[pln_images.factory],x,y);
		break;
	}
	
}

images.prototype.drawShipButton = function(type,x,y,lhs,rhs,col_ref)
{
	switch (type)
	{
		case "frigate":
			ctx.drawImage(img.ship_buttons[ship_images.frigate],x,y);
			ctx.drawImage(img.filters[col_ref],x,y);
			ctx.font = "12pt Calibri";
			ctx.fillText(lhs,x+2,y+2);
			ctx.fillText(rhs,x+72,y+2);
		break;
		case "cruiser":
			ctx.drawImage(img.ship_buttons[ship_images.cruiser],x,y);
			ctx.drawImage(img.filters[col_ref],x,y);
			ctx.font = "12pt Calibri";
			ctx.fillText(lhs,x+2,y+2);
			ctx.fillText(rhs,x+72,y+2);
		break;
		case "capital":
			ctx.drawImage(img.ship_buttons[ship_images.capital],x,y);
			ctx.drawImage(img.filters[col_ref],x,y);
			ctx.font = "12pt Calibri";
			ctx.fillText(lhs,x+2,y+2);
			ctx.fillText(rhs,x+72,y+2);
		break;
	}
}

var pln_images = { 	"factory": 0,
					"credit": 1,
					"steel": 2,
					"plasma": 3,
					"antimatter": 4,
					"warp": 5,
					};

var ship_images = {	"frigate": 0,
					"cruiser": 1,
					"capital": 2,
					};