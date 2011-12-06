//keep track of blend/opaque layer
var blendLayer = false;

function drawLB3d()
{	
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(fov, gl.viewportWidth / gl.viewportHeight, zNear, zFar*5, pMatrix);
	shaderProgram = shaderProgram;
	gl.useProgram(shaderProgram);
	
	switch (playState)
	{
		case 0:
			//draw loading screen
			break;
		case 1:
			//first - draw to frame buffer
			setupMV();
			//first draw opaque objects
			blendLayer = false;		
			initBlendModes();
			if (mp.drawReady)
				drawMap();
			drawSkybox();
			if (placingSS)
				drawNewSS();
			if (placingPlanet)
				drawNewPlanet();
			if(drawDirectionalLine)
				drawLineToMouse();
			//now draw blend objects
			blendLayer = true;
			initBlendModes();
			if (mp.drawReady)
				drawMap();
			break;
		case 2: // ??
			break;
		case 3: // ??
			break;
	}
	
}
function initShadersLB() {

	totalInits++; //how many shaders there are
    shaderProgram_main = createProgram("shader-fs", "shader-vs");
	initsComplete += 2;
	drawLoading();
}

function drawNewSS()
{
	//first draw physical sun
	var i;	
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	//lighting
	defineLighting();
	initBlendModes();
	//gl.enable(gl.BLEND);
	//gl.disable(gl.DEPTH_TEST);		
	//gl.blendFunc(gl.ONE, gl.ONE);
	
	useLighting(true,true,false,false);
	
	// translate to location of solar system
	gl.uniform3f(shaderProgram.emissiveColorUniform,0.6,0.6,0.6);
	mvPushMatrix();
	mat4.translate(mvMatrix,[posAtMouse.x,posAtMouse.y,posAtMouse.z]);
	for (i=0;i<models[sunModel].meshes.length;i++)
	{
		drawMesh(sunModel,i);
	}
	mvPopMatrix();
}
function drawNewPlanet()
{
	//first draw physical sun
	var i;	
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	//lighting
	defineLighting();
	initBlendModes();
	//gl.enable(gl.BLEND);
	//gl.disable(gl.DEPTH_TEST);		
	//gl.blendFunc(gl.ONE, gl.ONE);
	
	useLighting(true,true,false,false);
	
	// translate to location of solar system
	gl.uniform3f(shaderProgram.emissiveColorUniform,0.6,0.6,0.6);
	mvPushMatrix();
	mat4.translate(mvMatrix,[posAtMouse.x,posAtMouse.y,posAtMouse.z]);
	for (i=0;i<models[lb_getPlanetTypeModel(placingPlanetType)].meshes.length;i++)
	{
		drawMesh(lb_getPlanetTypeModel(placingPlanetType),i);
	}
	mvPopMatrix();
}
function drawLineToMouse()
{
	bindDirectionalLine();
	
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	//lighting
	defineLighting();
	initBlendModes();
	useLighting(true,false,false,false);
	//materials
	gl.uniform1f(shaderProgram.hasMaterial,0.0);
	gl.uniform1f(shaderProgram.hasTransparent,0.0);
		
	//draw map lines
	gl.bindBuffer(gl.ARRAY_BUFFER, dLinePosBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,dLinePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, dLineColBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,dLineColBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.getError();
	
	setMatrixUniforms();
	gl.drawArrays(gl.LINES, 0, dLinePosBuffer.numItems);	
}
function bindDirectionalLine()
{
	dLinePosBuffer = null;
	dLineColBuffer = null;
	
	var verts = new Array();
	var colors = new Array();

	var loc_a = directionalLineAnchor;
	var loc_b = posAtMouse;
	
	verts = verts.concat(loc_a.x,loc_a.y,loc_a.z);
	verts = verts.concat(loc_b.x,loc_b.y,loc_b.z);
	colors = colors.concat([0.8,0.8,0.8,1.0]);
	colors = colors.concat([0.8,0.8,0.8,1.0]);
	
	//bind line positions
	dLinePosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, dLinePosBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	dLinePosBuffer.itemSize = 3;
   	dLinePosBuffer.numItems = 2;
	
	//bind line colors
	dLineColBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, dLineColBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	dLineColBuffer.itemSize = 4;
   	dLineColBuffer.numItems = 2;
}






/*
function drawMap()
{
	//container for planet drawing
	if (!blendLayer)
	{
		drawPlanets();
		drawSuns();
	}
	else
	{
		drawMapLines();
		drawPlanetHalos();
		drawPlanets();
		drawSuns();
	}
}

function drawMapLines()
{
	var i,j,k;

	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	//lighting
	defineLighting();
	initBlendModes();
	useLighting(false,false,false,false);
	//materials
	gl.uniform1f(shaderProgram.hasMaterial,0.0);
	gl.uniform1f(shaderProgram.hasTransparent,0.0);
		
	//draw map lines
	gl.bindBuffer(gl.ARRAY_BUFFER, mp.linePosBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,mp.linePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, mp.lineColBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,mp.lineColBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.getError();
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, mp.linePosBuffer.numItems);	
}
function drawPlanetHalos()
{
	var i,j,k;

	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	//lighting
	defineLighting();
	initBlendModes();
	useLighting(false,false,false,false);
	//materials
	gl.uniform1f(shaderProgram.hasMaterial,0.0);
	gl.uniform1f(shaderProgram.hasTransparent,0.0);
	//draw map lines
	gl.bindBuffer(gl.ARRAY_BUFFER, mp.haloColBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,mp.haloColBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniform1i(shaderProgram.drawingHalo,1);
	
	var i,j;
	var num = 0;
	var selectColor = new v3(2.0,2.0,2.0);
	var neutralColor = new v3(0.4,0.4,0.4);
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			//deal with halo shading
			if (mp.systems[i].planets[j].player != -1)
			{
				if (selectedPlanetIndices != null)
				{
					if (selectedPlanetIndices.a == i && selectedPlanetIndices.b == j)
						gl.uniform3f(shaderProgram.haloColor,selectColor.x,selectColor.y,selectColor.z);
					else
					{
						var pl = players[mp.systems[i].planets[j].player];
						gl.uniform3f(shaderProgram.haloColor,pl.color.x,pl.color.y,pl.color.z);
					}
				}
				else
				{
					var pl = players[mp.systems[i].planets[j].player];
					gl.uniform3f(shaderProgram.haloColor,pl.color.x,pl.color.y,pl.color.z);
				}
			}
			else if (selectedPlanetIndices != null)
			{
				if (selectedPlanetIndices.a == i && selectedPlanetIndices.b == j)
					gl.uniform3f(shaderProgram.haloColor,selectColor.x,selectColor.y,selectColor.z);
				else
					gl.uniform3f(shaderProgram.haloColor,neutralColor.x,neutralColor.y,neutralColor.z);
			}
			else
			{
				gl.uniform3f(shaderProgram.haloColor,neutralColor.x,neutralColor.y,neutralColor.z);
			}
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mp.haloPosBuffers[num]);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,mp.haloPosBuffers[num].itemSize, gl.FLOAT, false, 0, 0);
			gl.getError();
			setMatrixUniforms();
			gl.drawArrays(gl.TRIANGLES, 0, mp.haloPosBuffers[num].numItems);	
			num++;
		}
	}
	gl.uniform1i(shaderProgram.drawingHalo,0);
}
function drawPlanets()
{
	var i,j,k;
	
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	//lighting
	defineLighting();
	initBlendModes();
	useLighting(true,false,true,true);
	
	for (i=0;i<mp.systems.length;i++)
	{
		if (mp.systems[i] != null)
		{
			// translate to location of solar system
			mat4.translate(mvMatrix,[mp.systems[i].pos.x,mp.systems[i].pos.y,mp.systems[i].pos.z]);
			//set up the sun's lighting
			gl.uniform3f(shaderProgram.pointColorUniform,mp.systems[i].sunColor.x,mp.systems[i].sunColor.y,mp.systems[i].sunColor.z);
			gl.uniform3f(shaderProgram.pointLocationUniform,mp.systems[i].pos.x,mp.systems[i].pos.y,mp.systems[i].pos.z);
			
			for (j=0;j<mp.systems[i].planets.length;j++)
			{
				//per planet drawing

				mvPushMatrix();
				var pln = mp.systems[i].planets[j];
				mat4.translate(mvMatrix,[pln.pos.x,pln.pos.y,pln.pos.z]);
				mat4.scale(mvMatrix,[pln.scale,pln.scale,pln.scale]);
				mat4.rotate(mvMatrix,degToRad(pln.rot.x),[1,0,0]);
				mat4.rotate(mvMatrix,degToRad(pln.rot.y),[0,1,0]);
				mat4.rotate(mvMatrix,degToRad(pln.rot.z),[0,0,1]);
				//
				for (k=0;k<models[mp.systems[i].planets[j].model].meshes.length;k++)
				{
					drawMesh(mp.systems[i].planets[j].model,k);
				}
				mvPopMatrix();
			}
		}
	}	
}
function drawSuns()
{
	//first draw physical sun
	var i;	
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	
	if (!blendLayer)
	{
		//lighting
		defineLighting();
		initBlendModes();
		
		useLighting(true,true,false,false);
		
		for (i=0;i<mp.systems.length;i++)
		{
			if (mp.systems[i] != null)
			{
				// translate to location of solar system
				gl.uniform3f(shaderProgram.emissiveColorUniform,2*mp.systems[i].sunColor.x,2*mp.systems[i].sunColor.y,2*mp.systems[i].sunColor.z);
				mvPushMatrix();
				mat4.rotate(mvMatrix,degToRad(mp.systems[i].rot.x),[1,0,0]);
				mat4.rotate(mvMatrix,degToRad(mp.systems[i].rot.y),[0,1,0]);
				mat4.rotate(mvMatrix,degToRad(mp.systems[i].rot.z),[0,0,1]);
				mat4.translate(mvMatrix,[mp.systems[i].pos.x,mp.systems[i].pos.y,mp.systems[i].pos.z]);
				mat4.scale(mvMatrix,[mp.systems[i].sunScale,mp.systems[i].sunScale,mp.systems[i].sunScale]);
				//
				for (k=0;k<models[mp.systems[i].sunModel].meshes.length;k++)
				{
					drawMesh(mp.systems[i].sunModel,k);
				}
				
				mvPopMatrix();
			}
		}

	}
	else
	{
		defineLighting();
		initBlendModes();
		useLighting(false,true,false,false);
		
		gl.blendFunc(gl.SRC_COLOR,gl.ONE);
		gl.enable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		
		for (i=0;i<mp.systems.length;i++)
		{
			if (mp.systems[i] != null)
			{
				gl.uniform3f(shaderProgram.emissiveColorUniform,2*mp.systems[i].sunColor.x,2*mp.systems[i].sunColor.y,2*mp.systems[i].sunColor.z);
				// translate to location of solar system
				mvPushMatrix();
				mat4.rotate(mvMatrix,mp.systems[i].sunHaloRot.y+Math.PI/2,[0,-1,0]);
				mat4.rotate(mvMatrix,mp.systems[i].sunHaloRot.x,[1,0,0]);
				mat4.rotate(mvMatrix,mp.systems[i].sunHaloRot.z,[0,0,1]);
				mat4.translate(mvMatrix,[mp.systems[i].pos.x,mp.systems[i].pos.y,mp.systems[i].pos.z]);
				mat4.scale(mvMatrix,[mp.systems[i].sunScale,mp.systems[i].sunScale,mp.systems[i].sunScale]);
				
				for (k=0;k<models[mp.systems[i].sunHaloModel].meshes.length;k++)
				{
					drawMesh(mp.systems[i].sunHaloModel,k);
				}
				
				mvPopMatrix();
			}
		}
		
		defineLighting();
		initBlendModes();
	}
}
*/
