// JavaScript Document
function lb_createSS()
{
	placingSS = true;
	placingPlanet = false;
	linkingPlanet = false;
}
function lb_createPlanet()
{
	placingPlanet = true;
	placingSS = false;
	linkingPlanet = false;
}
function lb_linkPlanet()
{
	linkingPlanet = true;
	placingPlanet = false;
}
function lb_cancelActions()
{
	selectionType = -1;
	if (placingPlanet)
		placingPlanet = false;
	if (placingSS)
		placingSS = false;
	if (linkingPlanet)
	{
		linkingStage = 0;
		lPlanetA = null;
		lPlanetB = null;
		drawDirectionalLine = false;
		directionalLineAnchor = null;
		linkingPlanet = false;
	}
	document.getElementById("ssOps").style.display = "none";
	document.getElementById("planetOps").style.display = "none";
}

//player ops
function lb_createPlayer()
{
	var pl = new player(amtPlayers,false);
	players.push(pl);
	amtPlayers++;
	lb_genPlayerList();
	//add to planet list
}
function lb_genPlayerList()
{
	var i;
	var playerList = "";
	for (i=0;i<players.length;i++)
	{
		playerList += "Player "+ i + "<br>";
		playerList += "<select id='p"+i+"_type' onchange='lb_setPlayerType("+i+")'><option value='false'>Human</option><option value='true'>AI</option></select><br>";
		playerList += "<input type='text' id='p"+i+"_r' value='"+players[i].color.x+"' onchange='lb_setPlayerColor("+i+");'>R<br>";
		playerList += "<input type='text' id='p"+i+"_g' value='"+players[i].color.y+"' onchange='lb_setPlayerColor("+i+");'>G<br>";
		playerList += "<input type='text' id='p"+i+"_b' value='"+players[i].color.z+"' onchange='lb_setPlayerColor("+i+");'>B<br>";
	}
	document.getElementById("playerList").innerHTML = playerList;
	lb_buildPlanetOps();
}

function lb_setPlayerType(id)
{
	var pl = players[id];
	pl.isAI = document.getElementById("p"+id+"_type").value;
}
function lb_setPlayerColor(id)
{
	var pl = players[id];
	var r = parseFloat(document.getElementById("p"+id+"_r").value);
	var g = parseFloat(document.getElementById("p"+id+"_g").value);
	var b = parseFloat(document.getElementById("p"+id+"_b").value);
	pl.color = new v3(r,g,b);
	if (mp.systems != null)
		mp.rebuildLines();
}
function lb_toggleShowPlayers()
{
	showPlayers = !showPlayers;
	if (!showPlayers)
		document.getElementById("playerList").style.display = "none";
	else
		document.getElementById("playerList").style.display = "block";	
}

//planet ops
function lb_displayPlanetOps()
{
	lb_buildPlanetOps();
	document.getElementById("ssOps").style.display = "none";
	document.getElementById("planetOps").style.display = "block";
	document.getElementById("playerOps").style.display = "none";
}
function lb_buildPlanetOps()
{
	var plList = "";
	if (currentPlanet != null)
	{
	plList = "Planet Ops:<br><form>";
		plList += "<select id='pl"+currentPlanet.a+"-"+currentPlanet.b+"_player' onchange='lb_changePlanetOwner("+currentPlanet.a+","+currentPlanet.b+");'>";
		plList += "<option value='-1'>No owner</option>";
		var i;
		for (i=0;i<players.length;i++)
		{
			plList += "<option value='"+i+"'>Player "+i+"</option>";
		}
		plList += "</select> Select Owner";
		plList += "</form>";
	}
	document.getElementById("planetOps").innerHTML = plList;
}
function lb_changePlanetOwner(cpa,cpb)
{
	var pl = mp.systems[cpa].planets[cpb];
	pl.player = parseInt(document.getElementById("pl"+cpa+"-"+cpb+"_player").value);
	if (mp.systems != null)
		mp.rebuildLines();
}
function lb_deletePlanet(cp)
{
	var pl = mp.systems[cp.a].planets[cp.b];
	//delete links
	var i,j,k;
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			if ((k=mp.systems[i].planets[j].linkedPlanets.indexOf(pl)) > -1)
				mp.systems[i].planets[j].linkedPlanets.splice(k,1);
		}
	}
	//delete planet
	mp.systems[cp.a].planets.splice(cp.b,1);
	mp.systems[cp.a].numOfPlanets--;
	lb_refactorMap();
}
function lb_refactorMap()
{
	var i,j,k;
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			mp.systems[i].planets[j].id = j;
			mp.systems[i].planets[j].mySystem = i;
		}
	}
}

//solar system ops
function lb_displaySSOps()
{
	lb_buildSSOps();
	document.getElementById("ssOps").style.display = "block";
	document.getElementById("planetOps").style.display = "none";
	document.getElementById("playerOps").style.display = "none";
}
function lb_deleteSS()
{
	var ss = mp.systems[currentSS];
	//delete planets
	var i,j,k;
	for (j=mp.systems[currentSS].planets.length;j>-1;j--)
	{
		lb_deletePlanet(new c2(currentSS,j));
	}
	//delete ss
	mp.systems.splice(currentSS,1);
	lb_refactorMap();
}
function lb_buildSSOps()
{
	var ssop = "";
	ssop += "Solar System Operations<br>";
	ssop += "<input type='text' id='ss"+currentSS+"_r' value='"+mp.systems[currentSS].sunColor.x+"' onchange='lb_setSSColor("+currentSS+");'>R<br>";
	ssop += "<input type='text' id='ss"+currentSS+"_g' value='"+mp.systems[currentSS].sunColor.y+"' onchange='lb_setSSColor("+currentSS+");'>G<br>";
	ssop += "<input type='text' id='ss"+currentSS+"_b' value='"+mp.systems[currentSS].sunColor.z+"' onchange='lb_setSSColor("+currentSS+");'>B<br>";
	document.getElementById("ssOps").innerHTML = ssop;
}
function lb_setSSColor(id)
{
	var ss = mp.systems[id];
	var r = parseFloat(document.getElementById("ss"+id+"_r").value);
	var g = parseFloat(document.getElementById("ss"+id+"_g").value);
	var b = parseFloat(document.getElementById("ss"+id+"_b").value);
	ss.sunColor = new v3(r,g,b);
}

//accessory planet typing
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
{	
	var model;
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