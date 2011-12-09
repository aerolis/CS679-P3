//game wide global var setup

//set up canvas and webgl vars
var canvas;
var canvas_b;
var ctx;
var gl;
var ui = new techUI();
var shaderProgram;
var shaderProgram_main;
var shaderProgram_flash;
var shaderProgram_post;
var mvMatrix = mat4.create();
var cMatrix = mat4.create();
var pMatrix = mat4.create();  
var mvMatrixStack = [];
var fBuffer; //frame buffer for rendering to
var rBuffer; //render buffer
var tBuffer; //texture containing frame buffer
var fBuffer_sub; //frame buffer for rendering to
var rBuffer_sub; //render buffer
var tBuffer_sub; //texture containing frame buffer
var aBuffer;
var usePostProcessing = false;

//path to textures/mesh files
var path = "";

//play state variables
var playState = 0;
var time = 0;
var cam = new camera();
var amtPlayers = 0;
var players = new Array();
var currentPlayer = 0;
var mp;
var selectedPlanet = null;
var selectedPlanetIndices = null;
//UNTIL WE GET MENUS AND STUFF,
//LOADING IN PLAY VARIABLES HERE
var levNum = 0;
//ENDING PLAY VARS

//load in model files for game
var models = new Array();
var meshNum = 0;
var modelsChecked = 0;
var modelsBound = 0;
var totalModels = 7;
var doOnceBind = false;
var doOnceLoad = false;
var startedBinding = false;
var initsComplete = 0;
var totalInits = 3;

//mouse position vars stored
var mousex = 0;
var mousez = 0;
var rPressed = false;
var lPressed = false;
var mPressed = false;
var mousexAtRPress = 0;
var mousezAtRPress = 0;
var mousexAtMPress = 0;
var mousezAtMPress = 0;
var maxRot = 60;
var rotAmt = 15;
var maxDiff = 300;

//draw vars
var zNear = 0.1;
var zFar = 5000;
var fov = 60;
var lightingPower = 4*Math.PI*Math.pow(400,2);

//global vars for level loader
var isLevelLoader = true;
var currentSS = null;
var currentPlanet = null;
var placingSS = false;
var placingPlanet = false;
var placingPlanetType = 0;
var planetTypeAmt = 7;
var posAtMouse = new v3(0,0,0);
var sunModel = 5;
var linkingPlanet = false;
var linkingStage = 0;
var lPlanetA = null;
var lPlanetB = null;
var drawDirectionalLine = false;
var directionalLineAnchor = null;
var dLinePosBuffer = null;
var dLineColBuffer = null;
var showPlayers = true;
var selectionType = -1;

//initialization functions
function initGame() //begin the "official" game initialization
{	
	gameLoop();	
	//set up drawing
	$.get("meshes/meshids.html", function(data){
		getMeshes(data);
	}, 'html');
	canvas = document.getElementById("3D_canvas");
	canvas_b = document.getElementById("2D_canvas");
	gl = canvas.getContext("experimental-webgl");
	ctx = canvas_b.getContext('2d');
	gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

	// now we can do webgl stuff
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

	window.addEventListener('keydown',handleKeyDown,true);
	window.addEventListener('keyup',handleKeyUp,true);
	window.addEventListener('mousemove',handleMouseMove,true);
	window.addEventListener('mousedown',handleMouseDown,true);
	window.addEventListener('mouseup',handleMouseUp,true);
	window.addEventListener('DOMMouseScroll', handleMouseWheel, false);

}

function setupGame() //loads models, lights, and shaders
{
	if (usePostProcessing)
		totalInits += 2;
	// make the shaders
	var p = setTimeout("initShadersLB();",1/30*1000);
	//initialize all loaded meshes
	var t = setTimeout("initObjects();",1/30*1000);
	// make the framebuffer
	if (usePostProcessing)
		var q = setTimeout("initBuffers();",1/30*1000);
	initDraw2d();
}
function checkLoaded() //checks that all models are loaded
{	
	//console.log("MC:"+modelsChecked+" TM:"+totalModels+" MB:"+modelsBound+" IC:"+initsComplete+" TI:"+totalInits);
	if (modelsChecked == totalModels && ((modelsBound < totalModels) || (initsComplete < totalInits)))
		return 1;
	else if ((modelsChecked < totalModels) || (modelsBound < totalModels) || (initsComplete < totalInits))
		return 0;
	else
		return 2;
}

//level loading functions
function nextLevel()
{
	playState = 1;
}
function setupLevel()
{
	/*$.get("levels/l"+levNum+".html", function(data){
	lev = load_level(data);
	levelLength = lev.length;
	}, 'html');*/
	
	mp = new map();
	mp.initBlank();
	cam.flyTo(new v3(0,0,0));
}

//game play loop
function gameLoop() //switches between game states and performs correct loop operations
{
	//play states will likely represent different things, so this is free to change (expect case 0 which should stay the similar for loading purposes)
	switch (playState)
	{
		case 0: //loading screen and instructions
			if (checkLoaded() == 1 && !doOnceBind)
			{
				setupGame();
				doOnceBind = true;
			}
			else if (checkLoaded() == 2 && !doOnceLoad)
			{
				setupLevel();
				doOnceLoad = true;
				playState = 1;
			}
			drawLoading();
			break;
		case 1: // play loop
			update();
			drawLB3d();
			drawLB2d();
			break;
		case 2: // ??
			break;
	}
	ui.update();
	T = setTimeout("gameLoop()", 1/30 * 1000);
}


function update(){
	//run update code here
	time += 1; //for shader effects
	time & 314; //for shader effects
	
	//lev.doEvents(); //do level events? is this still applicable? probably not
	var i;
	mp.update();
	cam.update();
}


function initObjects() //for binding meshes to GPU in webgl, leave as is
{	
	if (totalModels > 0)
		var t = setTimeout("models[0].bindModel(0)",1/20*1000);
	//drawLoading();
}

function drawLoading()
{
	var part_a = modelsChecked/totalModels;
	var part_b = modelsBound/totalModels;
	var part_c = initsComplete/totalInits;	
	
	//console.log("part_a:"+Math.round(10000*part_a)/100);
	//console.log("part_b:"+Math.round(10000*part_b)/100);
	//console.log("part_c:"+Math.round(10000*part_c)/100);
	//console.log("started binding: "+startedBinding);
	
	//var tmp = 100*modelsChecked/totalModels+100*doneSetup;
	//will want to draw the loading bar here. 0<tmp<200
	document.getElementById('loading').innerHTML = Math.round(10000*(part_a+part_b+part_c)/3)/100+"% loaded";
	pausecomp(50);
}
