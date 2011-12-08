// JavaScript Document

function upgradeData(planet){
	this.credits = 0;
	this.steel = 0;
	this.plasma = 0;
	this.antimatter = 0;
	
	this.maxUpgradeLevel = 0;
	//Set max upgrade Level
	//TODO: Add real values here.
	switch (planet.type)
	{
		case "factory":
			this.maxUpgradeLevel = 3;
			break;
		case "plasma":
			this.maxUpgradeLevel = 3;
			break;
		case "antimatter":
			this.maxUpgradeLevel = 3;
			break;
		case "steel":
			this.maxUpgradeLevel = 3;
			break;
		case "credit":
			this.maxUpgradeLevel = 3;
			break;
		case "warp":
			this.maxUpgradeLevel = 3;
			break;
		case "academy":
			this.maxUpgradeLevel = 3;
			break;
		case "default":
			this.maxUpgradeLevel = 3;
			break;
	}
	
	//TODO: Add real values here. Balancing.
	if(planet.upgradeLevel == 1){	
		switch (planet.type)
		{
			case "factory":
				this.credits = 500;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "plasma":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "antimatter":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "steel":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "credit":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
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
			case "plasma":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "antimatter":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "steel":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
				break;
			case "credit":
				this.credits = 0;
				this.steel = 0;
				this.plasma = 0;
				this.antimatter = 0;
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