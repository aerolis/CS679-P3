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
