function map()
{
	this.systems = new Array();
	
	//stuff for drawing map structure
	this.linePosBuffer;
	this.lineColBuffer;
	//stuff for halos
	this.nextBuffer = 0;
	this.haloPosBuffers = new Array();
	this.haloPosBuffer;
	this.haloColBuffer;
	this.drawReady = false;
	this.seg = 42; //number of segments in halos
	
	//makes searching for planets easier
	this.planetList = new Array();
	this.planetPos = new Array();
}
map.prototype.init = function()
{
	//var ss = new SolarSystem();
	//this.addSystem(ss); //hard coded a solar system for default
	//ss.init();
	this.bindLines();
	this.bindColors();
	this.bindHalo();
	this.bindHaloColors();
	this.setupPlanetLists();
	this.drawReady = true;
}

map.prototype.update = function()
{
	var i;
	for (i=0;i<this.systems.length;i++)
	{
		this.systems[i].update();
	}
}
map.prototype.addSystem = function(sys)
{
	this.systems.push(sys);
	return this.systems.indexOf(sys);
}
map.prototype.bindLines = function()
{
	var i,j,k;
	var verts = new Array();
	var connections = new Array();
	var num = 0;
	var d = 1.4;
	var fade = 0.15;
	
	this.linePosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.linePosBuffer);
	for (i=0;i<this.systems.length;i++)
	{
		for (j=0;j<this.systems[i].planets.length;j++)
		{
			for (k=0;k<this.systems[i].planets[j].linkedPlanets.length;k++)
			{
				//var lnk = this.systems[i].planets[j].linkedPlanets[k].split('-');
				//var lnk_sys = lnk[0];
				//var lnk_planet = lnk[1];
				var lnk_planet = this.systems[i].planets[j].linkedPlanets[k].id;
				var lnk_sys = this.systems[i].planets[j].linkedPlanets[k].mySystem;
				
				
				var pln_a = this.systems[i].planets[j];
				var pln_b = this.systems[lnk_sys].planets[lnk_planet];
				
				var checkStrA = "" + i + ":" + j + "-" + lnk_sys + ":" + lnk_planet;
				var checkStrB = "" +lnk_sys + ":" + lnk_planet + "-" + i + ":" + j;
				if (connections.indexOf(checkStrA) == -1 && connections.indexOf(checkStrB) == -1)
				{
					var dx = pln_b.pos.x-pln_a.pos.x;
					var dz = pln_b.pos.z-pln_a.pos.z;
					var theta = Math.atan2(dz,dx)*180/Math.PI;
					var phi = 90-theta;
					var xa = pln_a.pos.x+this.systems[i].pos.x;
					var ya = pln_a.pos.y+this.systems[i].pos.y;
					var za = pln_a.pos.z+this.systems[i].pos.z;
					var xb = pln_b.pos.x+this.systems[lnk_sys].pos.x;
					var yb = pln_b.pos.y+this.systems[lnk_sys].pos.y;
					var zb = pln_b.pos.z+this.systems[lnk_sys].pos.z;
					//verts for center
					verts = verts.concat(xa-d*fade*Math.cos(degToRad(phi)),	ya,	za+d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xb-d*fade*Math.cos(degToRad(phi)),	yb,	zb+d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xa+d*fade*Math.cos(degToRad(phi)),	ya,	za-d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xb-d*fade*Math.cos(degToRad(phi)),	yb,	zb+d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xa+d*fade*Math.cos(degToRad(phi)),	ya,	za-d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xb+d*fade*Math.cos(degToRad(phi)),	yb,	zb-d*fade*Math.sin(degToRad(phi)));
					//vert for left side
					verts = verts.concat(xa-d*Math.cos(degToRad(phi)),		ya,	za+d*Math.sin(degToRad(phi)));
					verts = verts.concat(xb-d*Math.cos(degToRad(phi)),		yb,	zb+d*Math.sin(degToRad(phi)));
					verts = verts.concat(xa-d*fade*Math.cos(degToRad(phi)),	ya,	za+d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xb-d*Math.cos(degToRad(phi)),		yb,	zb+d*Math.sin(degToRad(phi)));
					verts = verts.concat(xa-d*fade*Math.cos(degToRad(phi)),	ya,	za+d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xb-d*fade*Math.cos(degToRad(phi)),	yb,	zb+d*fade*Math.sin(degToRad(phi)));
					//verts for right side
					verts = verts.concat(xa+d*fade*Math.cos(degToRad(phi)),	ya,	za-d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xb+d*fade*Math.cos(degToRad(phi)),	yb,	zb-d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xa+d*Math.cos(degToRad(phi)),		ya,	za-d*Math.sin(degToRad(phi)));
					verts = verts.concat(xb+d*fade*Math.cos(degToRad(phi)),	yb,	zb-d*fade*Math.sin(degToRad(phi)));
					verts = verts.concat(xa+d*Math.cos(degToRad(phi)),		ya,	za-d*Math.sin(degToRad(phi)));
					verts = verts.concat(xb+d*Math.cos(degToRad(phi)),		yb,	zb-d*Math.sin(degToRad(phi)));
					
					connections.push(checkStrA);
					num++;
				}
			}
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	this.linePosBuffer.itemSize = 3;
    this.linePosBuffer.numItems = num*18;
}
map.prototype.bindColors = function()
{
	var i,j,k;	
	this.lineColBuffer = null;
	var colors = new Array();
	var connections = new Array();
	var num = 0;
	var a = 0.8;
	for (i=0;i<this.systems.length;i++)
	{
		for (j=0;j<this.systems[i].planets.length;j++)
		{
			for (k=0;k<this.systems[i].planets[j].linkedPlanets.length;k++)
			{
				var lnk_planet = this.systems[i].planets[j].linkedPlanets[k].id;
				var lnk_sys = this.systems[i].planets[j].linkedPlanets[k].mySystem;
				
				var pln_a = this.systems[i].planets[j];
				var pln_b = this.systems[lnk_sys].planets[lnk_planet];
				
				var checkStrA = "" + i + ":" + j + "-" + lnk_sys + ":" + lnk_planet;
				var checkStrB = "" +lnk_sys + ":" + lnk_planet + "-" + i + ":" + j;
				if (connections.indexOf(checkStrA) == -1 && connections.indexOf(checkStrB) == -1)
				{
					if (pln_a.player != -1)
					{
						var r1 = players[pln_a.player].color.x;
						var g1 = players[pln_a.player].color.y;
						var b1 = players[pln_a.player].color.z;
					}
					else
					{
						var r1 = 0.4;
						var g1 = 0.4;
						var b1 = 0.4;
					}
					if (pln_b.player != -1)
					{
						var r2 = players[pln_b.player].color.x;
						var g2 = players[pln_b.player].color.y;
						var b2 = players[pln_b.player].color.z;
					}
					else
					{
						var r2 = 0.4;
						var g2 = 0.4;
						var b2 = 0.4;
					}
					//center
					colors = colors.concat([r1,g1,b1,a]);
					colors = colors.concat([r2,g2,b2,a]);
					colors = colors.concat([r1,g1,b1,a]);
					colors = colors.concat([r2,g2,b2,a]);
					colors = colors.concat([r1,g1,b1,a]);
					colors = colors.concat([r2,g2,b2,a]);
					//left
					colors = colors.concat([r1,g1,b1,0]);
					colors = colors.concat([r2,g2,b2,0]);
					colors = colors.concat([r1,g1,b1,a]);
					colors = colors.concat([r2,g2,b2,0]);
					colors = colors.concat([r1,g1,b1,a]);
					colors = colors.concat([r2,g2,b2,a]);
					//right
					colors = colors.concat([r1,g1,b1,a]);
					colors = colors.concat([r2,g2,b2,a]);
					colors = colors.concat([r1,g1,b1,0]);
					colors = colors.concat([r2,g2,b2,a]);
					colors = colors.concat([r1,g1,b1,0]);
					colors = colors.concat([r2,g2,b2,0]);
					connections.push(checkStrA);
					num++;
				}
			}
		}
	}
	
	this.lineColBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.lineColBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.lineColBuffer.itemSize = 4;
    this.lineColBuffer.numItems = num*18;
}

map.prototype.bindHalo = function()
{
	var i,j,k;
	var verts = new Array();
	
	var num = 0;
	var rd = 75;
	var fr = 0.8;
	var or = 1.05;
	this.nextBuffer = 0;
	
	for (i=0;i<this.systems.length;i++)
	{
		for (j=0;j<this.systems[i].planets.length;j++)
		{
			this.haloPosBuffers[this.nextBuffer] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.haloPosBuffers[this.nextBuffer]);
			
			var pln_a = this.systems[i].planets[j];
			var sys = this.systems[i];
			var amt = 2*Math.PI/this.seg;
			r = rd*pln_a.scale;
			if (this.systems[i].planets[j].type == "sun")
				r = r*2.8;
				
			num = 0;
			
			var theta;
			for (theta = 0; theta < 2*Math.PI; theta += amt)
			{
				var phi = theta+amt;
				var x = sys.pos.x + 	pln_a.pos.x;
				var y = sys.pos.y + 	pln_a.pos.y + 3;
				var z = sys.pos.z + 	pln_a.pos.z;
								
				verts = verts.concat(x+fr*r*Math.cos(phi), y, z+fr*r*Math.sin(phi));
				verts = verts.concat(x+fr*r*Math.cos(theta), y, z+fr*r*Math.sin(theta));
				verts = verts.concat(x+r*Math.cos(phi), y, z+r*Math.sin(phi));
				
				verts = verts.concat(x+fr*r*Math.cos(theta), y, z+fr*r*Math.sin(theta));
				verts = verts.concat(x+r*Math.cos(phi), y, z+r*Math.sin(phi));
				verts = verts.concat(x+r*Math.cos(theta), y, z+r*Math.sin(theta));
				
				verts = verts.concat(x+r*Math.cos(phi), y, z+r*Math.sin(phi));
				verts = verts.concat(x+r*Math.cos(theta), y, z+r*Math.sin(theta));
				verts = verts.concat(x+or*r*Math.cos(phi), y, z+or*r*Math.sin(phi));
				
				verts = verts.concat(x+r*Math.cos(theta), y, z+r*Math.sin(theta));
				verts = verts.concat(x+or*r*Math.cos(phi), y, z+or*r*Math.sin(phi));
				verts = verts.concat(x+or*r*Math.cos(theta), y, z+or*r*Math.sin(theta));
				
				num++;
			}
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
			this.haloPosBuffers[this.nextBuffer].itemSize = 3;
			this.haloPosBuffers[this.nextBuffer].numItems = num*12;
			this.nextBuffer++;
			verts = [];
		}
	}
}
map.prototype.bindHaloColors = function()
{
	var i,j,k;	
	var colors = new Array();
	var num = 0;
	var a = 1;
	
	var amt = 2*Math.PI/this.seg;
	var num = 0;
	
	var theta;
	for (theta = 0; theta < 2*Math.PI; theta += amt)
	{

		var r = 0.4;
		var g = 0.4;
		var b = 0.4;
		
		colors = colors.concat([r,g,b,0]);
		colors = colors.concat([r,g,b,0]);
		colors = colors.concat([r,g,b,a]);
		
		colors = colors.concat([r,g,b,0]);
		colors = colors.concat([r,g,b,a]);
		colors = colors.concat([r,g,b,a]);
		
		colors = colors.concat([r,g,b,a]);
		colors = colors.concat([r,g,b,a]);
		colors = colors.concat([r,g,b,0]);
		
		colors = colors.concat([r,g,b,a]);
		colors = colors.concat([r,g,b,0]);
		colors = colors.concat([r,g,b,0]);
		
		num++;
	}
	
	this.haloColBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.haloColBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.haloColBuffer.itemSize = 4;
    this.haloColBuffer.numItems = num*12;
}

map.prototype.setupPlanetLists = function()
{
	this.planetList = new Array();
	this.planetPos = new Array();
	
	var i,j;
	for (i=0;i<this.systems.length;i++)
	{
		for (j=0;j<this.systems[i].planets.length;j++)
		{
			var x = this.systems[i].pos.x + this.systems[i].planets[j].pos.x;
			var y = this.systems[i].pos.y + this.systems[i].planets[j].pos.y;
			var z = this.systems[i].pos.z + this.systems[i].planets[j].pos.z;
			this.systems[i].planets[j].initFleetOwner();
			this.planetPos.push(new v3(x,y,z));
			this.planetList.push(new c2(i,j));
		}
	}
}