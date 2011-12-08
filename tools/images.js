//a file to keep track of loading 2d images
function images()
{
	//initialize all params
	this.info_bar = new Image();
	this.end_turn = new Image();
	this.options_bar = new Image();
	this.planet_cost = new Image();
	
	this.planets_64 = new Array();
	
	//now load their files
	this.info_bar.src = "images/info_bar.png";
	this.end_turn.src = "images/end_turn_button.png";
	this.options_bar.src = "images/options_bar.png";
	this.planet_cost.src = "images/planet_cost.png";
	
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
	this.planets_64[5].src = "images/credit_64.png"; //warp
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

var pln_images = { 	"factory": 0,
					"credit": 1,
					"steel": 2,
					"plasma": 3,
					"antimatter": 4,
					"warp": 5,
					};
	