//This is largely legacy code left in case we want to do a similar type of level loading
//Ultimately almost all of it will need to change, but who knows

function level()
{
	this.events = new Array();
	this.id;
	this.loaded = false;
	this.finished = false;
}

level.prototype.doEvents = function()
{
	var i;
	//very much from P2 - left just in case
	for (i=0;i<this.events.length;i++)
	{
		if (this.events[i].zpos <= -cam.pos.z && !(this.events[i].triggered))
		{
			this.events[i].doEvent();
			this.events[i].triggered = true;
		}
	}
}

function event()
{
	this.type;
}
event.prototype.doEvent = function()
{
	//code to do event here
	//now doing event
	var i;
	switch (this.type)
	{
		/*
		//legacy code from P2 - left as example in case we have events
		case "enemy_swarm":
			for (i=0;i<this.amount;i++)
			{
				var id = enemies.length;
				enemies.push(new enemy(id));
				enemies[id].pos = new v3(this.pos.x,150,this.pos.z);
				enemies[id].phase = this.phase;
				enemies[id].model = this.model;
				enemies[id].radius = this.radius;
				switch (this.behavior)
				{
					case "simple_track":
						enemies[id].behavior = new followBehavior(1,10);
						break;
				}
				enemies[id].init();
				//enemyCt++;
			}
			break;*/
	}
}

function load_level(data)
{
	var levr = new level();
	var eventNum = 0;
	var lines = data.split('\n');
	for (i in lines)
	{
		var tokens = lines[i].split(' ');
		switch (tokens[0])
		{
			case "//":
				//comment line, do nothing
				break;
			case "<level>":
				//initialize level
				break;
			case "</level>":
				//close level
				break;
			case "<id>":
				levr.id = tokens[1];
				break;
			/*	
			//legacy level loader functionality - left as example
			case "<length>":
				levr.length = tokens[1];
				break;
			case "<event>":
				//start event
				levr.events.push(new event());
				break;
			case "<type>":
				levr.events[eventNum].type = tokens[1];
				break;
			case "<dist>":
				levr.events[eventNum].dist = parseFloat(tokens[1]);
				break;
				levr.events[eventNum].pos = new v3(parseFloat(tokens[1]),parseFloat(tokens[2]),-parseFloat(tokens[3]));
				break;
			case "<behavior>":
				levr.events[eventNum].behavior = tokens[1];
				break;
			case "</event>":
				eventNum++;
				break;
	*/		
		}
	}
	levr.loaded = true;
	return levr;
}