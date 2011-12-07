function lb_generateMap()
{
	var i,j,k
	//list all ss's
	var ss_str = "<systems>\n";
	for (i=0;i<mp.systems.length;i++)
	{
		//for each ss
		ss_str += "<ss>\n";
		ss_str += "<id> "+i+" </id>\n";
		ss_str += "<pos> "	+mp.systems[i].pos.x+" "+mp.systems[i].pos.y+" "+mp.systems[i].pos.z+" </pos>\n";
		ss_str += "<color> "+mp.systems[i].sunColor.x+" "+mp.systems[i].sunColor.y+" "+mp.systems[i].sunColor.z+" </color>\n";
		ss_str += "</ss>\n";
	}
	ss_str += "</systems>\n";
	//list all planets
	var pl_str = "<planets>\n";
	for (i=0;i<mp.systems.length;i++)
	{
		//for each ss
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			//for each planet
			pl_str += "<pl>\n";
			pl_str += "<ss> "+i+" </ss>\n";
			pl_str += "<id> "+j+" </id>\n";
			pl_str += "<type> "+mp.systems[i].planets[j].type+" </type>\n";
			pl_str += "<owner> "+mp.systems[i].planets[j].player+" </owner>\n";
			pl_str += "<pos> "	+mp.systems[i].planets[j].pos.x
				+" "+mp.systems[i].planets[j].pos.y
				+" "+mp.systems[i].planets[j].pos.z
				+" </pos>\n";
			pl_str += "</pl>\n";
		}
	}
	pl_str += "</planets>\n";
	//list all players
	var ply_str = "<players>\n";
	for (i=0;i<players.length;i++)
	{
		ply_str += "<ply>\n";
		ply_str += "<id> "+i+" </id>\n";
		ply_str += "<ai> "+players[i].ai+" </ai>\n";
		ply_str += "<color> "+players[i].color.x+" "+players[i].color.y+" "+players[i].color.z+" </color>\n";
		ply_str += "</ply>\n";
	}
	ply_str += "</players>\n";
	//find all connections
	var connections = new Array();
	var checkStrs = new Array();
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			for (k=0;k<mp.systems[i].planets[j].linkedPlanets.length;k++)
			{
				var pln_a	= j;
				var ss_a	= i;
				var pln_b	= mp.systems[i].planets[j].linkedPlanets[k].id;
				var ss_b	= mp.systems[i].planets[j].linkedPlanets[k].mySystem;
				
				var chkA = ""+ss_a+"-"+pln_a+":"+ss_b+"-"+pln_b;
				var chkB = ""+ss_b+"-"+pln_b+":"+ss_a+"-"+pln_a;
				if (checkStrs.indexOf(chkA) == -1 && checkStrs.indexOf(chkB) == -1)
				{
					checkStrs.push(chkA);
					checkStrs.push(chkB);
					connections.push(new c2(new c2(ss_a,pln_a),new c2(ss_b,pln_b)));
				}
			}
		}
	}
	//now file all links
	var links = "<links>\n";
	for (i=0;i<connections.length;i++)
	{
		links += "<l> "+connections[i].a.a+" "+connections[i].a.b+" "+connections[i].b.a+" "+connections[i].b.b+" </l>\n";
	}
	links += "</links>\n";
	
	var final = ss_str + pl_str + ply_str + links;
	alert(final);
}

//keeping this here for now because it's easier than
//refactoring everywhere a planet is created
//to pass an extra value
var createdViaMap = false;
var globalPlanetID = 0;

function lb_parseMap(data)
{
	mp = new map();
	createdViaMap = true;
	var lines = data.split('\n');
	var i;
	var stage = "systems";
	var tmp;
	var id = 0;
	for (i=0;i<lines.length;i++)
	{
		var ln = lines[i].split('\r')[0];
		if (stage == "systems")
		{
			var tokens = ln.split(' ');
			switch (tokens[0])
			{
				case "<ss>":
					tmp = new SolarSystem();
				break;
				case "<id>":
					id = parseInt(tokens[1]);
				break;
				case "<pos>":
					tmp.pos = new v3(parseFloat(tokens[1]),parseFloat(tokens[2]),parseFloat(tokens[3]));
				break;
				case "<color>":
					tmp.sunColor = new v3(parseFloat(tokens[1]),parseFloat(tokens[2]),parseFloat(tokens[3]));
					if (tmp.sunColor.r == 1 && tmp.sunColor.g == 1 && tmp.sunColor.b == 1)
						tmp.randomizeColor();
				break;
				case "</ss>":
					mp.systems[id] = tmp;
					tmp = null;
				break;
			}
			if(ln == "</systems>")
				stage = "planets";
		}
		else if (stage == "planets")
		{
			var tokens = ln.split(' ');
			switch (tokens[0])
			{
				case "<pl>":
					tmp = new Planet(new v3(0,0,0),"credit",1,-1,[],[],0);
				break;
				case "<ss>":
					tmp.mySystem = parseInt(tokens[1]);
				break;
				case "<id>":
					id = parseInt(tokens[1]);
					tmp.id = id;
				break;
				case "<type>":
					tmp.type = tokens[1];
					tmp.specifyPlanetType();
				break;
				case "<owner>":
					tmp.player = parseInt(tokens[1]);
				break;
				case "<pos>":
					tmp.pos = new v3(parseFloat(tokens[1]),parseFloat(tokens[2]),parseFloat(tokens[3]));
				break;
				case "</pl>":
					mp.systems[tmp.mySystem].planets[id] = tmp;
					tmp = null;
				break;
			}
			if(ln == "</planets>")
				stage = "players";
		}
		else if (stage == "players")
		{
			//skip for now - perform a separate parse for this
			if(ln == "</players>")
				stage = "links";
		}
		else if (stage == "links")
		{
			var tokens = ln.split(' ');
			switch (tokens[0])
			{
				case "<l>":
				var ss_a = parseInt(tokens[1]);
				var pln_a = parseInt(tokens[2]);
				var ss_b = parseInt(tokens[3]);
				var pln_b = parseInt(tokens[4]);
				var pln = mp.systems[ss_b].planets[pln_b];
				mp.systems[ss_a].planets[pln_a].linkPlanet(pln);
				break;
			}			
			if(ln == "</links>")
				stage = "done";
		}
		else
		{
			break;
		}
	}	
	createdViaMap = false;
}

function lb_parsePlayers(data)
{
	players = new Array();
	var lines = data.split('\n');
	var i;
	var stage = "systems";
	var tmp;
	var id = 0;
	for (i=0;i<lines.length;i++)
	{
		var ln = lines[i].split('\r')[0];
		if (stage == "systems")
		{
			//don't deal with this here
			if(ln == "</systems>")
				stage = "planets";
		}
		else if (stage == "planets")
		{
			//don't deal with this here
			if(ln == "</planets>")
				stage = "players";
		}
		else if (stage == "players")
		{
			var tokens = ln.split(' ');
			switch (tokens[0])
			{
				case "<ply>":
					tmp = new player(0,false);
				break;
				case "<id>":
					id = parseInt(tokens[1]);
					tmp.id = id;
				break;
				case "<ai>":
					tmp.ai = tokens[1];
				break;
				case "<color>":
					tmp.color = new v3(parseFloat(tokens[1]),parseFloat(tokens[2]),parseFloat(tokens[3]));
				break;
				case "</ply>":
					tmp.initializeCameraPos();
					players[id] = tmp;
					tmp = null;
				break;
			}
			if(ln == "</players>")
				stage = "links";
		}
		else if (stage == "links")
		{
			//don't deal with this here
			if(ln == "</links>")
				stage = "done";
		}
		else
		{
			break;
		}
	}	
		
	return players;
}
function lb_loadMap()
{
	var file = document.getElementById("loadFile").value;
	playState = 0;
	$.get("levels/"+file, function(data){
		lb_parseMap(data);
		lb_parsePlayers(data);
	}, 'html');
	var t = setTimeout("lb_checkLoaded();",1/30*1000);
}
function lb_checkLoaded()
{
	if (map != null && players != null)
		lb_startBuilder();
	else	
		var t = setTimeout("lb_checkLoaded();",1/30*1000);
}
function lb_startBuilder()
{
	mp.init();
	lb_genPlayerList();
	cam.flyTo(new v3(0,0,0));
	playState = 1;
}