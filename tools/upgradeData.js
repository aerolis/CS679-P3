// JavaScript Document

function upgradeData(planet){
	this.credits = 0;
	this.steel = 0;
	this.plasma = 0;
	this.antimatter = 0;
	
	this.newResources = 0;
	this.maxUpgradeLevel = 0;
	//Set max upgrade Level
	//TODO: Add real values here.
	//console.log("New upgradedata. type = " + planet.type + ", level is " + planet.upgradeLevel);
	
	switch (planet.type)
	{
		case "factory":
			this.maxUpgradeLevel = 1;
			break;
		case "credit":
			this.maxUpgradeLevel = 3;
			break;
		case "steel":
			this.maxUpgradeLevel = 3;
			break;
		case "plasma":
			this.maxUpgradeLevel = 3;
			break;
		case "antimatter":
			this.maxUpgradeLevel = 3;
			break;		
		case "warp":
			this.maxUpgradeLevel = 1;
			break;
		case "academy":
			this.maxUpgradeLevel = 1;
			break;
		case "default":
			this.maxUpgradeLevel = 1;
			break;
	}
	
	//TODO: Add real values here. Balancing.
	if(planet.upgradeLevel == 1){	
		switch (planet.type)
		{
			case "factory":
				this.credits = 500;
				this.steel = 100;
				this.plasma = 80;
				this.antimatter = 20;
				break;
			case "credit":
				this.credits = 150;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				this.newResources = 60;	
				break;
			case "steel":
				this.credits = 200;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;				
				this.newResources = 30;	
				break;			
			case "plasma":
				this.credits = 200;
				this.steel = 0;
				this.plasma = 0;				
				this.antimatter = 0;
				this.newResources = 25;					
				break;
			case "antimatter":
				this.credits = 200;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				this.newResources = 12;
				break;
			case "warp":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "academy":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "default":
			break;
		}
	}
	else if(planet.upgradeLevel == 2){
		switch (planet.type)
		{
			case "factory":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "credit":
				this.credits = 400;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				this.newResources = 90;	
				break;
			case "steel":
				this.credits = 500;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;				
				this.newResources = 45;	
				break;			
			case "plasma":
				this.credits = 500;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				this.newResources = 40;	
				break;
			case "antimatter":
				this.credits = 500;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				this.newResources = 25;	
				break;
			case "warp":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "academy":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "default":
			break;
		}		
	}	
}