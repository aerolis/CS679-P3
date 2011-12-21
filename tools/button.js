var buttonType = { 	"EndTurn": 0,
					"Send": 1,
					"Upgrade": 2,
					"RemoveCR":3,
					"Empty":4,
					"RemoveGO":5,
					"BrowseShipsLeft":5,
					"BrowseShipsRight":6,
					"Scouts":10,
					"Frigates":11,
					"Fighters":12,
					"Dreadnaughts":13,
					"Cruisers":14,
					"Capitals":15,
					"BuildScout":20,					
					"BuildFrigate": 21,
					"BuildFighter":22,
					"BuildDreadnaught":23,
					"BuildCruiser": 24,					
					"BuildCapital": 25,
					"ResearchLaser": 30,
					"ResearchShields":31,
					"ResearchAdvMissile":32,
					"ResearchReactor":33
					};

//Button object to hold data for all buttons
//Do not use this method for creation!
function Button(){ 
	var that = {};
		
  	that.x = 0;
  	that.y = 0;
  	that.w = 1; 
  	that.h = 1;
	that.fontStyle = "12pt Calibri";
  	that.fill = '#444444';
  	that.title = "";
	that.type = buttonType.Empty;

	//targetCanvas = either real canvas or ghostcanvas. ghostcanvas for checking if selected.
  	that.draw = function(targetCanvas){
		switch (that.type)
		{
			//Some button types only get drawn in certain cases.
			case buttonType.EndTurn:
				targetCanvas.drawImage(img.end_turn,that.x,that.y);
			break;
			case buttonType.Upgrade:
				//Only draw upgrade buttons if the planet is still upgradable.
				if(selectedPlanet.upgradeStats.maxUpgradeLevel > selectedPlanet.upgradeLevel){
					targetCanvas.drawImage(img.upgrade_planet,that.x+20,that.y);
				}
			break;
			case buttonType.RemoveCR:
				targetCanvas.drawImage(img.ok_button,that.x,that.y);
			break;
			case buttonType.RemoveGO:
				targetCanvas.drawImage(img.ok_button,that.x,that.y);
			break;
			
			//Build ship buttons
			case buttonType.BuildScout:
				img.drawBuildShipButton("scout",that.x,that.y, selectedPlanet.productionPlan.noScouts, targetCanvas);
			break;			
			case buttonType.BuildFrigate:
				img.drawBuildShipButton("frigate",that.x,that.y, selectedPlanet.productionPlan.noFrigates, targetCanvas);
			break;
			case buttonType.BuildFighter:
				img.drawBuildShipButton("fighter",that.x,that.y, selectedPlanet.productionPlan.noFighters, targetCanvas);
			break;
			case buttonType.BuildDreadnaught:
				img.drawBuildShipButton("dreadnaught",that.x,that.y, selectedPlanet.productionPlan.noDreadnaughts, targetCanvas);
			break;
			case buttonType.BuildCruiser:
				img.drawBuildShipButton("cruiser",that.x,that.y, selectedPlanet.productionPlan.noCruisers, targetCanvas);
			break;
			case buttonType.BuildCapital:
				img.drawBuildShipButton("capital",that.x,that.y, selectedPlanet.productionPlan.noCapitals, targetCanvas);
			break;
			
			//Research buttons
			case buttonType.ResearchLaser:
				img.drawResearchButton("laser", that.x, that.y, targetCanvas);
				break;	
				
			case buttonType.ResearchShields:
				img.drawResearchButton("shield", that.x, that.y, targetCanvas);
				break;
				
			case buttonType.ResearchAdvMissile:
				img.drawResearchButton("adv_missile", that.x, that.y, targetCanvas);
				break;
				
			case buttonType.ResearchReactor:
				img.drawResearchButton("reactor", that.x, that.y, targetCanvas);
				break;	
			
			
			case buttonType.BrowseShipsLeft:
				targetCanvas.fillStyle = 'black';
				targetCanvas.fillRect(that.x, that.y+20, that.w, that.h-20);
				targetCanvas.drawImage(img.left_arrow,that.x,that.y+20);
			break;
			case buttonType.BrowseShipsRight:
				targetCanvas.fillStyle = 'black';
				targetCanvas.fillRect(that.x, that.y+20, that.w, that.h-20);
				targetCanvas.drawImage(img.right_arrow,that.x,that.y+20);
			break;
			default:
				that.drawThis(targetCanvas);
		}
	}
	
	that.drawThis = function(targetCanvas){
		targetCanvas.fillStyle = that.fill;
		targetCanvas.fillRect(that.x, that.y, that.w, that.h);
		targetCanvas.fillStyle = 'black';
		ctx.font = that.fontStyle;
		targetCanvas.fillText(that.title, that.x + 2, that.y + 15);	
	}
	
	that.gotClicked = function(button){
		//if button = 0; it was a leftClick
		//if button = 1; it was a rightClick.
		console.log(that.title + " got clicked.");
		
		switch (that.type){
				//General buttons
			case buttonType.EndTurn:
				nextTurn();
				break;
				
			case buttonType.Upgrade:
				selectedPlanet.tryUpgrade();
				break;
				
			case buttonType.RemoveCR:
				combatResultScreen.hide();			
				break;
				
			case buttonType.RemoveGO:
				if (gameFinished){
					playState = 0;	
				}
				else{
					gameOverScreen.active = false;	
				}
				
			case buttonType.BrowseShipsLeft:
				selectedPlanet.shipButtons.page--;
				selectedPlanet.shipButtons.layOutButtons();
				break;
				
			case buttonType.BrowseShipsRight:
				selectedPlanet.shipButtons.page++;
				selectedPlanet.shipButtons.layOutButtons();
				break;
			
				//Build buttons.	
			case buttonType.BuildScout:
				console.log("This planet wants to build a Scout");
				selectedPlanet.buildShip("scout", 1);
				break;	
						
			case buttonType.BuildFrigate:
				console.log("This planet wants to build a Frigate");
				selectedPlanet.buildShip("frigate",1);
				break;
				
			case buttonType.BuildFighter:
				selectedPlanet.buildShip("fighter", 1);
				break;
				
			case buttonType.BuildDreadnaught:
				selectedPlanet.buildShip("dreadnaught", 1);
				break;
				
			case buttonType.BuildCruiser:
				//console.log("This planet wants to build a Cruiser");
				selectedPlanet.buildShip("cruiser",1);

				break;
				
			case buttonType.BuildCapital:
				//console.log("This planet wants to build a Capital");
				selectedPlanet.buildShip("capital",1);
				break;
				
			//Selecting units buttons
			case buttonType.Scouts:
				if (button == 0){
					selectedPlanet.selectAllScouts();
				}
				else{
					selectedPlanet.deselectScout();
				}
				break;
				
			case buttonType.Frigates:
				if (button == 0){
					//console.log("This planet wants to select a Frigate");
					selectedPlanet.selectAllFrigates();
				}
				else{
					selectedPlanet.deselectFrigate();
				}
				break;
				
			case buttonType.Fighters:
				if (button == 0){
					selectedPlanet.selectAllFighters();
				}
				else{
					selectedPlanet.deselectFighter();
				}
				break;
				
			case buttonType.Dreadnaughts:
				if (button == 0){
					selectedPlanet.selectAllDreadnaughts();
				}
				else{
					selectedPlanet.deselectDreadnaught();
				}
				break;
				
			case buttonType.Cruisers:
				if (button == 0){
					//console.log("This planet wants to select a Cruisers");
					selectedPlanet.selectAllCruisers();	
				}
				else{
					selectedPlanet.deselectCruiser();	
				}
				break;
				
			case buttonType.Capitals:
				if (button == 0){
					//console.log("This planet wants to select a Capitals");
					selectedPlanet.selectAllCapitals();		
				}
				else{
					selectedPlanet.deselectCapital();	
				}
				break;
				
			//Research buttons
			case buttonType.ResearchLaser:
				selectedPlanet.researchPlan.addProject( "laser", currentPlayer );
				break;	
				
			case buttonType.ResearchShields:
				selectedPlanet.researchPlan.addProject( "shields", currentPlayer );
				break;
				
			case buttonType.ResearchAdvMissile:
				selectedPlanet.researchPlan.addProject( "advMissile", currentPlayer );
				break;
				
			case buttonType.ResearchReactor:
				selectedPlanet.researchPlan.addProject( "reactor", currentPlayer );
				break;	
				
			case buttonType.Empty:
				//For the moved ships buttons; they don't actually do anything.
				break;
				
			default:
				break;
		
		}
		
		//If it was a right click.		
	}

	return that;
}
