//game wide global var setup

//set up canvas and webgl vars
var canvas;
var canvas_b;
var ctx;
var gl;
var ui = new techUI();
var shaderProgram;
var shaderProgram_main;
var shaderProgram_post;
var mvMatrix = mat4.create();
var mvtmpMatrix = mat4.create();
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
var usePostProcessing = true;

//path to textures/mesh files
var path = "";

//play state variables
var playState = 0;
var gameFinished = false;
var time = 0;
var cam = new camera();
var amtPlayers = 3;
var players = null;
var currentPlayer = 0;
var mp;
var selectedPlanet = null;
var selectedPlanetIndices = null;
//UNTIL WE GET MENUS AND STUFF,
//LOADING IN PLAY VARIABLES HERE
var levNum = 0;
//ENDING PLAY VARS
//add parameter for turns
var currTurn = 0;

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
//set up a few images we need immediately and some we don't need until later
var splash = new Image();
splash.src = "images/splash_screen.png";
var new_game_button = new Image();
new_game_button.src = "images/new_game_button.png";
var img = new images();

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
var planetHover = null;
var timecheck = new Date().getTime();
var fps;
var drawFPS = false;
var drawTutorial = false;
var tutorialState = 0;
var tutorialMaxState = 6;
var mapLoaded = false;
var checkMapComplete = false;
var allReady = false;

//audio??
var aud = new audioDriver();

//draw vars
var zNear = 0.1;
var zFar = 5000;
var fov = 60;
var lightingPower = 4*Math.PI*Math.pow(700,2);

//initialization functions
function initGame() //begin the "official" game initialization
{
	//first hide the initial vars
	ui.hideImmediate();
	
	gameLoop();	
	//set up drawing
	$.get("meshes/meshids.html", function(data){
		getMeshes(data);
	}, 'html');
	canvas = document.getElementById("3D_canvas");
	gl = canvas.getContext("experimental-webgl");
	canvas_b = document.getElementById("2D_canvas");
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
	var p = setTimeout("initShaders();",1/30*1000);
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
	currentPlayer = 0;
	
	$.get("levels/dan4.html", function(data){
		lb_parseMap(data);
		lb_parsePlayers(data);
	}, 'html');
	
	var t = setTimeout("checkGameBegin();",1/30*1000);
}
function checkGameBegin()
{
	if (mapLoaded && players != null)
	{
		startgame();
	}
	else	
		var t = setTimeout("checkGameBegin();",1/30*1000);
}
function startgame()
{
	mp.init();
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			var currPlanet = mp.systems[i].planets[j];
			if (currPlanet.player >= 0 &&
				currPlanet.player < players.length)
			{
				players[currPlanet.player].addPlanet(currPlanet);		
			}
		}
	}
	checkMapComplete = true;
	cam.flyToFull(players[currentPlayer].cPos,players[currentPlayer].cRot,players[currentPlayer].cDist);
}

//game play loop
function gameLoop() //switches between game states and performs correct loop operations
{
	var ms = new Date().getTime();
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
			}
			else if (checkMapComplete)
			{
				allReady = true;
			}
			/*
			else if (buttonpress && allReady)
			{
				playState = 1;
			}
			*/
			draw2DLoading();
			break;
		case 1: // play loop
			update();
			draw3d();
			draw2d();
			break;
		case 2: // ??
			break;
		case 3: // ??
			break;
		case 4: // Game Over
			break;
	}
	ui.update();
	
	var diff = (new Date().getTime())-timecheck;
	fps = Math.round(100*(1/(diff/1000)))/100;
	var diff2 = (new Date().getTime())-ms;
	timecheck = new Date().getTime();
	if (fps > 30)
		T = setTimeout("gameLoop()", (1/30)*1000-diff2);
	else
		T = setTimeout("gameLoop()", (1/240)*1000);
}


function update(){
	//run update code here
	time += 1; //for shader effects
	time & 314; //for shader effects
	
	//lev.doEvents(); //do level events? is this still applicable? probably not
	var i;
	mp.update();
	cam.update();
	aud.update();
	advance();
}
function advance()
{
	var i,j;
	for (i=0;i<models.length;i++)
	{
		models[i].advance();
	}
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
	//document.getElementById('loading').innerHTML = Math.round(10000*(part_a+part_b+part_c)/3)/100+"% loaded";
	//pausecomp(50);
}

function nextTurn()
{
	
	if (selectedPlanet != null){
		selectedPlanet.deselect();		
	}
	if (!players[currentPlayer].ai)
		players[currentPlayer].saveCameraPosition();
	
	currentPlayer = (currentPlayer + 1) % amtPlayers;
	console.log("Next turn got called. New current Player = " + currentPlayer);
	
	//update tech each turn
	players[currentPlayer].clearTech();
	
	//Loop through all planets
	var i,j;
	for (i=0;i<mp.systems.length;i++)
	{
		for (j=0;j<mp.systems[i].planets.length;j++)
		{
			// If they're yours, update it.
			if (mp.systems[i].planets[j].player == currentPlayer)
			{
				mp.systems[i].planets[j].onTurn();
			}
		}
	}	
	
	cam.flyToFull(players[currentPlayer].cPos,players[currentPlayer].cRot,players[currentPlayer].cDist);
	
	//If (it's AI)
	// do ai stuff. (including calling nextTurn)
	
	
	if (players[currentPlayer].ai) {
		//playState = 2;
		//Wait a bit so it seems like the turn actually takes some time
		setTimeout(function(){
			players[currentPlayer].doTurn();
			//For debugging, it may be useful to comment out the next
			//line so that you can see what the AI did (you must then
			//click the END TURN button to get back to the user's
			//turn...)
			nextTurn();
		},  1250); //i'd reocmmend setting this to 1 while you are testing...
		
		//playState = 1;
	}
	
	//check for game over
	var deadPlayerCount = 0;
	//var gameOver = false;
	for(i = 0; i < players.length; i++) {
		if (players[i].planets.length == 0) {	
			if (!players[i].gameOver){					
				players[i].gameOver = true;
				gameOverScreen.active = true;
			}
			deadPlayerCount++;
		}
	}
	
	if (players.length - deadPlayerCount < 2){
		gameFinished = true;
		//playState = 4;
	}
}