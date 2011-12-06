// JavaScript Document
function lb_createSS()
{
	console.log("createSS");
	placingSS = true;
}
function lb_createPlanet()
{
	placingPlanet = false;
}
function lb_getPlanetType(index)
{
	var type;
	switch (index)
	{
		case 0:
			type = "credit";
		break;
		case 1:
			type = "steel";
		break;
		case 2:
			type = "plasma";
		break;
		case 3:
			type = "antimatter";
		break;
		case 4:
			type = "factory";
		break;
		case 5:
			type = "warp";
		break;
		case 6:
			type = "academy";
		break;
		default:
			type = "credit";
		break;
	}
	return type;
}
function lb_getPlanetTypeModel(index)
{	var model;
	switch (index)
	{
		case 0:
			model = 6;
		break;
		case 1:
			model = 3;
		break;
		case 2:
			model = 1;
		break;
		case 3:
			model = 2;
		break;
		case 4:
			model = 0;
		break;
		case 5:
			model = 3;
		break;
		case 6:
			model = 6;
		break;
		default:
			model = 6;
		break;
	}
	return model;
}