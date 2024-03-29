var shiftPressed = false;
var justRightClicked = false;

function handleMouseMove(evt)
{	
	mousex = Math.max(0,Math.min(canvas.width,evt.clientX-10));
	mousez = Math.max(0,Math.min(canvas.height,evt.clientY-10));
	
	//console.log("x:"+mousex+" y:"+mousez);
	
	if (playState == 0)
	{
		if (!drawTutorial)
		{
			//check for the start button
			if (mousex > 800 && mousex < 1000 && mousez > 660 && mousez < 720)
			{
				//hovering over button, change mouse pointer
				document.body.style.cursor = "pointer";
			}
			else
			{
				document.body.style.cursor = "default";
			}
		}
		else
		{
			//check for the start button
			if (mousex > 500 && mousex < 700 && mousez > 100 && mousez < 160)
			{
				document.body.style.cursor = "pointer";
			}
			else
			{
				document.body.style.cursor = "default";
			}
		}
	}
	else if (playState == 1) //handle during normal play
	{
		drawHover = -1;
		
		if (evt.clientX-10>canvas.width || evt.clientY-10>canvas.height)
		{
			rPressed = false;
			mPressed = false;
			lPressed = false;
		}
		
		if (rPressed)
		{
			//rotate the camera
			
			var dx = mousexAtRPress-mousex;
			var dz = mousezAtRPress-mousez;
			
			var dp,dy;
			dp = (Math.max(Math.min(dz,maxDiff),-maxDiff)/maxDiff)*rotAmt;
			dy = (Math.max(Math.min(dx,maxDiff),-maxDiff)/maxDiff)*rotAmt;
			
			//cam.pitch = Math.max(Math.min(dp+cam.pitch,-90+maxRot),-90-maxRot);
			//cam.yaw = Math.max(Math.min(dy+cam.yaw,maxRot),-maxRot);
			
			cam.pitch = dp+cam.pitch;
			cam.yaw = dy+cam.yaw;
			
			mousexAtRPress = Math.max(0,Math.min(canvas.width,evt.clientX-10));
			mousezAtRPress = Math.max(0,Math.min(canvas.height,evt.clientY-10));
			
		}
		if (mPressed)
		{
			//pass value of -1 to 1 for horizonatal and vertical components
			var dx = Math.min(Math.max(mousexAtMPress-mousex,-100),100);
			var dz = Math.min(Math.max(mousezAtMPress-mousez,-100),100);
			
			cam.translate(dz/100,-dx/100);
		}
		
		if (!lPressed && !rPressed && !mPressed && !anyButtonsPressed())
		{
			//hovering code
			//check hovering over buttons
			if (mousez > canvas.height - OptionBarHeight)
			{
				//now check which button set it might be over
				if (mousex > OptionBarX && mousex < (OptionBarX + OptionBarWidth) && mousez > OptionBarY && mousez < (OptionBarY + OptionBarHeight))
				{
					var foundTarget = null;
					if (selectedPlanet != null){
						//See if you hovered over an optionButton belonging to the selected planet.
						if (selectedPlanet.player == currentPlayer){
							foundTarget = selectedPlanet.optionButtons.checkHover(mousex, mousez);
							if (foundTarget != null)
							{
								console.log("foundTarget.type:"+foundTarget.type);
								switch (foundTarget.type){
									//this is for factories
									case buttonType.BuildScout:
										shipHover = "Scouts";
										drawHover = 0;
										break;
									case buttonType.BuildFrigate:
										shipHover = "Frigates";
										drawHover = 0;
									break;
										case buttonType.BuildFighter:
										shipHover = "Fighters";
										drawHover = 0;
										break;
									case buttonType.BuildDreadnaught:
										shipHover = "Dreadnaughts";
										drawHover = 0;
										break;
									case buttonType.BuildCruiser:
										shipHover = "Cruisers";
										drawHover = 0;
										break;
									case buttonType.BuildCapital:
										shipHover = "Capitals";
										drawHover = 0;
										break;
									//here are cases for academies
									case buttonType.ResearchLaser:
										researchHover = "Lasers";
										drawHover = 1;
										break;
									case buttonType.ResearchShields:
										researchHover = "Shields";
										drawHover = 1;
										break;
									case buttonType.ResearchAdvMissile:
										researchHover = "Adv_Missiles";
										drawHover = 1;
										break;
									case buttonType.ResearchReactor:
										researchHover = "Reactors";
										drawHover = 1;
										break;
									default:
										break;
								}
							}														
						}
						
						if (foundTarget == null){
							//See if you hovered over a unit available on the selected planet.
							foundTarget = selectedPlanet.shipButtons.checkHover(mousex, mousez);
							if (foundTarget != null)
							{
								drawHover = 0;
								shipHover = foundTarget.shipType;
							}
						}
					}
				}
			}
			else
			{ //planet hovers
				planetHover = pickObjectSimple();
				if (planetHover != -1)
				{
					//planetXY = mp.systems[planetHover.a].planets[planetHover.b].getPlanetXY();
					drawHover = 2;
				}
			}
		}
	}
}
function handleMouseDown(evt)
{
	if (playState == 1) //handle during normal play
	{
		if (evt.which == 1) //left mouse button
		{
			lPressed = true;
		}
		else if (evt.which == 2)
		{
			mPressed = true;
			mousexAtMPress = Math.max(0,Math.min(canvas.width,evt.clientX-10));
			mousezAtMPress = Math.max(0,Math.min(canvas.height,evt.clientY-10));
			if (evt.preventDefault)
				evt.preventDefault();
		}
		else if (evt.which == 3) //right mouse button
		{
			rPressed = true;
			mousexAtRPress = Math.max(0,Math.min(canvas.width,evt.clientX-10));
			mousezAtRPress = Math.max(0,Math.min(canvas.height,evt.clientY-10));
			if (evt.preventDefault)
				evt.preventDefault();
		}
	}
}
function handleMouseUp(evt)
{
	if (playState == 0)
	{
		if (!drawTutorial)
		{
			//check for the start button
			if (mousex > 800 && mousex < 1000 && mousez > 660 && mousez < 720)
			{
				//clicked on button
				drawTutorial = true;
				aud.startSong();
				//playState = 1;
			}
		}
		else
		{
			//check for the start button
			if (mousex > 500 && mousex < 700 && mousez > 100 && mousez < 160)
			{
				//clicked on button
				//drawTutorial = true;
				if (tutorialState < tutorialMaxState)
					tutorialState++;
				else
					playState = 1;
				
			}
		}
	}
	else if (playState == 1) //handle during normal play
	{
		var mouseX = Math.max(0,Math.min(canvas.width,evt.clientX-10));
		var mouseY = Math.max(0,Math.min(canvas.width,evt.clientY-10));
			
			
		if (evt.which == 1) //left mouse button
		{
			//If combat results are shown, only that is active.
			if (combatResultScreen.active){
				combatResultScreen.buttons.checkClicked(mouseX, mouseY);
			}
			else if (gameOverScreen.active){
				gameOverScreen.buttons.checkClicked(mouseX, mouseY);
			}
			//If you're in a 'button area', do these checks to see if a button was clicked
			else if (	(mouseX > OptionBarX && mouseX < (OptionBarX + OptionBarWidth) && mouseY > OptionBarY && mouseY < (OptionBarY + OptionBarHeight)) ||
						(mouseX > InfoBarX && mouseX < (InfoBarX + InfoBarWidth) && mouseY > InfoBarY && mouseY < (InfoBarY + InfoBarHeight)))
			{
				var foundTarget = false;
				if (selectedPlanet != null){
					//See if you clicked an optionButton belonging to the selected planet.
					foundTarget = selectedPlanet.optionButtons.checkClicked(mouseX, mouseY, 0);
					if (!foundTarget && selectedPlanet.player == currentPlayer){
						//See if you clicked a unit available on the selected planet.
						foundTarget = selectedPlanet.shipButtons.checkClicked(mouseX, mouseY, 0);
					}
				}	
				if (!foundTarget){
					//See if you clicked a general button (like next turn)
					foundTarget = permaButtons.checkClicked(mouseX, mouseY, 0);
				}				
			}
			//This really does need an else. You don't want to secretly select planets hiding under the option bar.
			else{
				//Only need to stop showing selection if there's a chance of deselection.
				if (selectedPlanet != null){
					//selectedPlanet.hideOptions();
					selectedPlanet.emptySelection();
					//selectedPlanet.hideShips();
				}
		
				var planet = pickObject();
				if (planet != -1)
				{
					selectedPlanetIndices = planet;
					selectedPlanet = mp.systems[planet.a].planets[planet.b];
					selectedPlanet.populateShipButtons();
					selectedPlanet.populateOptionButtons();
			
					//if (selectedPlanet.player == currentPlayer){
					//	selectedPlanet.fl_showOptions = true;
					//}
					//console.log("A planet was selected");
				}
				else
				{
					selectedPlanet = null;
					selectedPlanetIndices = null;
				}
				//console.log("found planet ss:"+planet.a+" pl:"+planet.b);
				//this will return the a c2 object (just a container for two objects to be carried together)
				//with: planet.a -> solar system number -> mp.systems[planet.a]
				//		planet.b -> planet number -> mp.systems[planet.a].planets[planet.b]
				//returns -1 if no planet is clicked
			}
			
			lPressed = false;
		}
		else if (evt.which == 2)
			mPressed = false;
		else if (evt.which == 3) //right mouse button
		{
			//console.log("Right clicked");
			if (justRightClicked)
			{
				//this is a double click
				rightDoubleClick();
			}
			rPressed = false;
			if (evt.preventDefault)
				evt.preventDefault();
			justRightClicked = true;
			var t = setTimeout("clearRightClick();",(1/4)*1000);
			
			//If it's in a button area
			 if (	(mouseX > OptionBarX && mouseX < (OptionBarX + OptionBarWidth) && mouseY > OptionBarY && mouseY < (OptionBarY + OptionBarHeight)) ||
						(mouseX > InfoBarX && mouseX < (InfoBarX + InfoBarWidth) && mouseY > InfoBarY && mouseY < (InfoBarY + InfoBarHeight)))
			{
				var foundTarget = false;
				if (selectedPlanet != null){
					//See if you clicked a shipButton 
					foundTarget = selectedPlanet.shipButtons.checkClicked(mouseX, mouseY, 1);
				}								
			}
			//Else it's in the universe
			else{		
				
				//If a planet is selected
				if (selectedPlanet != null){
					//See if you're sending out units. 
					var planet = pickObject();
					if (planet != -1)
					{
						targetPlanet = mp.systems[planet.a].planets[planet.b];
						targetPlanet.tryReceiveFleet();
					}
					//If no planet was clicked, just deselect your units.
					else
					{
						selectedPlanet.myFleet.addFleet(selectedPlanet.selectedFleet);
						selectedPlanet.selectedFleet.empty();
					}				
				}
			}
		}
	}
}
function handleMouseWheel(evt)
{
	if (!mPressed)
	{
		var delta = 0;
		cam.wheelUp = true;
		if (evt.detail)
			delta = evt.detail;
		if (delta)
		{
			cam.zoom(delta);
		}
		if (evt.preventDefault)
			evt.preventDefault();
	}
}
function handleKeyDown(evt) {
	switch (evt.keyCode) {
		case 87:  // w
			cam.fwd = true;
		break;
		case 83:  // s
			cam.bck = true;
		break;
		case 65:  // a
			cam.left = true;
		break;
		case 68:  // d
			cam.right = true;
		break;
		case 16: // ctrl
			shiftPressed = true;
		break;
		/*
		case 38:  // up
			cam.rup = true;
		break;
		case 40:  // down
			cam.rdown = true;
		break;
		case 37:  // left
			cam.rleft = true;
		break;
		case 39:  // right
			cam.rright = true;
		break;*/
	}
}
function handleKeyUp(evt) {
	switch (evt.keyCode) {
		case 32: //Space
			nextTurn();
		case 87:  // w
			cam.fwd = false;
		break;
		case 83:  // s
			cam.bck = false;
		break;
		case 65:  // a
			cam.left = false;
		break;
		case 68:  // d
			cam.right = false;
		break;
		case 84: //t for printing data
			/*
			var dx = cam.pos.x-cam.lookat.x;
			var dy = cam.pos.y-cam.lookat.y;
			var dz = cam.pos.z-cam.lookat.z;
			var tmp = Math.sqrt(dx*dx+dy*dy+dz*dz);
			console.log("camera>> yaw:"+cam.yaw+" pitch:"+cam.pitch+" roll:"+cam.roll);
			console.log("pos>> x:"+cam.pos.x+" y:"+cam.pos.y+" z:"+cam.pos.z);
			console.log("distance>> dist:"+cam.distance+" magn:"+tmp);*/
		break;
		case 85:
			if (shiftPressed)
			{
				ui.toggle();
			}
		break;
		case 16: // shift
			shiftPressed = false;
		break;
		case 80:
			if (shiftPressed)
			{
				lb_generateMap();
			}
		break;
		/*case 38:  // up
			cam.rup = false;
		break;
		case 40:  // down
			cam.rdown = false;
		break;
		case 37:  // left
			cam.rleft = false;
		break;
		case 39:  // right
			cam.rright = false;
		break;*/
	}
}

function clearRightClick()
{
	justRightClicked = false;
}
function rightDoubleClick()
{
	var loc = getClickLocationOnPlane();
	cam.flyTo(loc);
}
function anyButtonsPressed()
{
	if (cam.fwd || cam.bck || cam.left || cam.right || shiftPressed)
		return true;
	return false;
}