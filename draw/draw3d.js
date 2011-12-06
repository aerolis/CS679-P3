//for 3D drawing.
//separated from 2D since Nate will be doing mostly 3D
//and Tessa will be doing a bunch of 2D, so it will make
//git merging easier if we aren't both editing the same thing

//keep track of blend/opaque layer
var blendLayer = false;

function draw3d()
{	
	//to draw when the file is run from a local directory
	//must set about:config security.fileuri.strict_origin_policy=false
	//in firefox, else it has an out of context error
	//set up viewport
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(fov, gl.viewportWidth / gl.viewportHeight, zNear, zFar*5, pMatrix);
	shaderProgram = shaderProgram;
	gl.useProgram(shaderProgram);
	
	//sets up some shader variables. chances are these won't be
	//used but I left them for reference for now anyway
	
	switch (playState)
	{
		case 0:
			//draw loading screen
			break;
		case 1:
			//first - draw to frame buffer
			if (usePostProcessing)
			{
				gl.bindFramebuffer(gl.FRAMEBUFFER,fBuffer);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		 
				setupMV();
				//first draw opaque objects
				blendLayer = false;		
				initBlendModes();
				if (mp.drawReady)
					drawMap();
				drawSkybox();
				//now draw blend objects
				blendLayer = true;
				initBlendModes();
				if (mp.drawReady)
					drawMap();
				
				//second - post processing and draw framebuffer to screen
				//post process
				writeFrameBuffer(1);
				writeFrameBuffer(2);
			}
			else
			{
				setupMV();
				//first draw opaque objects
				blendLayer = false;		
				initBlendModes();
				if (mp.drawReady)
					drawMap();
				drawSkybox();
				//now draw blend objects
				blendLayer = true;
				initBlendModes();
				if (mp.drawReady)
					drawMap();
			}
			break;
		case 2: // ??
			break;
		case 3: // ??
			break;
	}
	
}
function setupMV()
{
	mat4.identity(mvMatrix);
	mat4.identity(cMatrix);
	mat4.rotate(cMatrix,degToRad(cam.pitch),[-1,0,0]);
	mat4.rotate(cMatrix,degToRad(cam.yaw),[0,-1,0]);
	mat4.rotate(cMatrix,degToRad(cam.roll),[0,0,-1]);
	mat4.translate(cMatrix,[-cam.pos.x,-cam.pos.y,-cam.pos.z]);
}
function initBlendModes()
{
	if (blendLayer) {
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		//sdgl.blendEquationSeparate(gl.FUNC_ADD,gl.FUNC_SUBTRACT);
		gl.enable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
	} else {
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);		
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		//gl.blendFunc(gl.SRC_COLOR, gl.ONE);
	}
}
function defineLighting()
{
	gl.uniform3f(shaderProgram.ambientColorUniform,0.25,0.25,0.25);
	gl.uniform3f(shaderProgram.emissiveColorUniform,0.0,0.0,0.0);
	var lightingDirection = [-0.25,-0.25,0.0];
	var adjustedLD = vec3.create();
	vec3.normalize(lightingDirection, adjustedLD);
	vec3.scale(adjustedLD, -1);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
	gl.uniform3f(shaderProgram.directionalColorUniform,0.0,0.0,0.0);
	gl.uniform1f(shaderProgram.lightingPower,lightingPower);
	gl.uniform3f(shaderProgram.pointColorUniform,0.0,0.0,0.0);
	gl.uniform1i(shaderProgram.useEmissive,0);
	gl.uniform1i(shaderProgram.useDirectional,0);
	gl.uniform1i(shaderProgram.usePoint,0);
}
function useLighting(a,e,d,p)
{
	if (a)
		gl.uniform1i(shaderProgram.useAmbient,1);
	else
		gl.uniform1i(shaderProgram.useAmbient,0);
	if (e)
		gl.uniform1i(shaderProgram.useEmissive,1);
	else
		gl.uniform1i(shaderProgram.useEmissive,0);
	if (d)
		gl.uniform1i(shaderProgram.useDirectional,1);
	else
		gl.uniform1i(shaderProgram.useDirectional,0);
	if (p)
		gl.uniform1i(shaderProgram.usePoint,1);
	else
		gl.uniform1i(shaderProgram.usePoint,0);
}
function writeFrameBuffer(pass)
{
	//draws the generated frame buffer to a rectangle filling the screen

	shaderProgram = shaderProgram_post;
	gl.useProgram(shaderProgram);
	
	mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0, 0.0, -1.7]);
		
	gl.uniform1f(shaderProgram.hasMaterial,1.0);
	if (pass == 1) //bloom effect
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER,fBuffer_sub);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tBuffer);
		gl.uniform1i(shaderProgram.samplerDiffuseUniformA, 0);
	}
	else if (pass == 2) //final render pass
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tBuffer);
		gl.uniform1i(shaderProgram.samplerDiffuseUniformA, 0);
		
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, tBuffer_sub);
		gl.uniform1i(shaderProgram.samplerDiffuseUniformB, 1);
	}
	gl.uniform1f(shaderProgram.texWidth, canvas.width);
	gl.uniform1f(shaderProgram.texHeight, canvas.height);
	gl.uniform1fv(shaderProgram.kernel,[1.0,4.0,6.0,4.0,1.0]);
	gl.uniform1f(shaderProgram.kernelMax, 256.0);
	gl.uniform1f(shaderProgram.blurScale, 0.2);
	gl.uniform1i(shaderProgram.renderPass, pass);
			
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER,squareVertexUVBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexUVAttribute,squareVertexUVBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
	gl.getError();
	
	setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

function drawSkybox()
{
	//draws skybox
	mvPushMatrix();
	var i;
	//shader setup
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	//lighting
	defineLighting();
	initBlendModes();
	useLighting(false,true,false,false);
	gl.uniform3f(shaderProgram.emissiveColorUniform,0.5,0.5,0.5);
	//follow the camera
	mat4.translate(mvMatrix,[cam.pos.x,cam.pos.y,cam.pos.z]);
	
	for (i=0;i<models[4].meshes.length;i++)
	{
		drawMesh(4,i);
	}
	mvPopMatrix();
}

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
			mvPushMatrix();
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
			mvPopMatrix();
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
				mat4.translate(mvMatrix,[mp.systems[i].pos.x,mp.systems[i].pos.y,mp.systems[i].pos.z]);
				mat4.rotate(mvMatrix,degToRad(mp.systems[i].rot.x),[1,0,0]);
				mat4.rotate(mvMatrix,degToRad(mp.systems[i].rot.y),[0,1,0]);
				mat4.rotate(mvMatrix,degToRad(mp.systems[i].rot.z),[0,0,1]);
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
				mat4.translate(mvMatrix,[mp.systems[i].pos.x,mp.systems[i].pos.y,mp.systems[i].pos.z]);
				mat4.rotate(mvMatrix,mp.systems[i].sunHaloRot.y+Math.PI/2,[0,-1,0]);
				mat4.rotate(mvMatrix,mp.systems[i].sunHaloRot.x,[1,0,0]);
				mat4.rotate(mvMatrix,mp.systems[i].sunHaloRot.z,[0,0,1]);
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
function drawMesh(modelID,meshID)
{
	var mesh = models[modelID].meshes[meshID];
	var material = models[modelID].materials[mesh.material];
	//if ((blendLayer && material.hasTransparent == 1) || (!blendLayer && material.hasTransparent == 0))
	if ((false) || (!blendLayer && material.hasTransparent == 0) || (blendLayer && mesh.blendColor))
	{
		if (mesh.material != -1)
		{
			var diffuseTexture = models[modelID].textures[material.diffuseTexture];
			var transparentTexture = models[modelID].textures[material.transparentTexture];
			if (material.hasDiffuse == 1 && diffuseTexture.bound)
			{
				gl.uniform1f(shaderProgram.hasMaterial,1.0);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, diffuseTexture.gl_text);
				gl.uniform1i(shaderProgram.samplerDiffuseUniform, 0);
			}
			else
				gl.uniform1f(shaderProgram.hasMaterial,0.0);
			if (material.hasTransparent == 1 && transparentTexture.bound)
			{
				gl.uniform1f(shaderProgram.hasTransparent,1.0);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, transparentTexture.gl_text);
				gl.uniform1i(shaderProgram.samplerTransparentUniform, 0);
			}
			else
			{
				gl.uniform1f(shaderProgram.hasTransparent,0.0);
			}
		}
		else
		{
			gl.uniform1f(shaderProgram.hasMaterial,0.0);
			gl.uniform1f(shaderProgram.hasTransparent,0.0);
		}
		mvPushMatrix();
		mat4.translate(mvMatrix,[mesh.locTrans.x,mesh.locTrans.y,mesh.locTrans.z]); //translate mesh local pos
		mat4.rotate(mvMatrix,degToRad(mesh.locRot.x-90),[1,0,0]);
		mat4.rotate(mvMatrix,degToRad(mesh.locRot.z),[0,1,0]);
		mat4.rotate(mvMatrix,degToRad(mesh.locRot.y),[0,0,1]);
		mat4.scale(mvMatrix,[mesh.locScale.x,mesh.locScale.y,mesh.locScale.z]);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexPosBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,mesh.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,mesh.vertexColBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexNormBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,mesh.vertexNormBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexUVBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexUVAttribute,mesh.vertexUVBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
		gl.getError();
				
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexPosBuffer.numItems);
		mvPopMatrix();
	}
}




//shader functions
//these are very separate from the above

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
	  return null;
	}
	
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
	  if (k.nodeType == 3)
		  str += k.textContent;
	  k = k.nextSibling;
	}
	
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
	  shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	  shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	  return null;
	}
	
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  alert(gl.getShaderInfoLog(shader));
	  return null;
	}
	
	return shader;
}
function createProgram(fragmentShaderID, vertexShaderID) {
	var fragmentShader = getShader(gl, fragmentShaderID);
	var vertexShader = getShader(gl, vertexShaderID);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	gl.enableVertexAttribArray(program.vertexPositionAttribute);
	program.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
	gl.enableVertexAttribArray(program.vertexColorAttribute);
    program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
	gl.enableVertexAttribArray(program.vertexNormalAttribute);
    program.vertexUVAttribute = gl.getAttribLocation(program, "aVertexUV");
	gl.enableVertexAttribArray(program.vertexUVAttribute);

	program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
	program.cMatrixUniform = gl.getUniformLocation(program, "uCMatrix");
	program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
	program.samplerDiffuseUniform = gl.getUniformLocation(program, "uDiffuseSampler");
	program.samplerTransparentUniform = gl.getUniformLocation(program, "uTransparentSampler");
	program.useTexturesUniform = gl.getUniformLocation(program, "uUseTextures");
	//for post processing
	program.samplerDiffuseUniformA = gl.getUniformLocation(program, "uDiffuseSamplerA");
	program.samplerDiffuseUniformB = gl.getUniformLocation(program, "uDiffuseSamplerB");
	program.renderPass = gl.getUniformLocation(program, "uRenderPass");
	
	//for lighting
	program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
	program.lightingDirectionUniform = gl.getUniformLocation(program, "uLightingDirection");
	program.directionalColorUniform = gl.getUniformLocation(program, "uDirectionalColor");
	program.pointLocationUniform = gl.getUniformLocation(program, "uPointLightingLocation");
	program.lightingPower = gl.getUniformLocation(program, "uLightingPower");
	program.pointColorUniform = gl.getUniformLocation(program, "uPointLightingColor");
	program.emissiveColorUniform = gl.getUniformLocation(program, "uEmissiveColor");
	
	program.useAmbient = gl.getUniformLocation(program, "useAmbient");
	program.useEmissive = gl.getUniformLocation(program, "useEmissive");
	program.useDirectional = gl.getUniformLocation(program, "useDirectional");
	program.usePoint = gl.getUniformLocation(program, "usePoint");
	
	//other
	program.time = gl.getUniformLocation(program, "uTime");
	program.phaseOut = gl.getUniformLocation(program, "uPhaseOut");
	//texturing details
	program.hasMaterial = gl.getUniformLocation(program, "hasMaterial");
	program.hasTransparent = gl.getUniformLocation(program, "hasTransparent");
	program.texHeight = gl.getUniformLocation(program, "texHeight");
	program.texWidth = gl.getUniformLocation(program, "texWidth");
	program.kernel = gl.getUniformLocation(program, "kernel");
	program.blurScale = gl.getUniformLocation(program, "blurScale");
	program.kernelMax = gl.getUniformLocation(program, "kernelMax");
	//for halo coloring
	program.haloColor = gl.getUniformLocation(program, "haloColor");
	program.drawingHalo = gl.getUniformLocation(program, "drawingHalo");
	
	shaderProgram = program;
	initLights();
	initsComplete++;
	drawLoading();
	pausecomp(50);
	return program;
}
function initShaders() {
	totalInits += 3; //how many shaders there are
    shaderProgram_main = createProgram("shader-fs", "shader-vs");
	shaderProgram_flash = createProgram("shader-fs-flash", "shader-vs-flash");
	shaderProgram_post = createProgram("shader-fs-post", "shader-vs-post");
	initsComplete += 2;
	drawLoading();
}
function initLights()
{
	gl.uniform3f(shaderProgram.ambientColorUniform,0.25,0.25,0.25);
	var lightingDirection = [-0.25,-0.25,0.0];
	var adjustedLD = vec3.create();
	vec3.normalize(lightingDirection, adjustedLD);
	vec3.scale(adjustedLD, -1);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
	gl.uniform3f(shaderProgram.directionalColorUniform,0.0,0.0,0.0);
	gl.uniform1f(shaderProgram.lightingPower,lightingPower);
	drawLoading();
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, cMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}