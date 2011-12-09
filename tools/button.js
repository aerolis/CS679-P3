var buttonType = { 	"EndTurn": 0,
					"Send": 1,
					"Upgrade": 2,
					"RemoveCR":3,
					"Empty":4,
					"BrowseShipsLeft":5,
					"BrowseShipsRight":6,
					"Frigates":10,
					"Cruisers":11,
					"Capitals":12,					
					"BuildFrigate": 20,
					"BuildCruiser": 21,					
					"BuildCapital": 22,
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
		switch (this.type)
		{
			//Some button types only get drawn in certain cases.
			case buttonType.EndTurn:
				targetCanvas.drawImage(img.end_turn,that.x,that.y);
			break;
			case buttonType.Upgrade:
				if(selectedPlanet.upgradeStats.maxUpgradeLevel > selectedPlanet.upgradeLevel){
					targetCanvas.drawImage(img.upgrade_planet,that.x+20,that.y);
				}
			break;
			case buttonType.RemoveCR:
				targetCanvas.drawImage(img.ok_button,that.x,that.y);
			break;
			case buttonType.BuildFrigate:
				// !!! if this buttontype is unlocked
				img.drawBuildShipButton("frigate",that.x,that.y,targetCanvas);
			break;
			case buttonType.BuildCruiser:
				// !!! if this buttontype is unlocked				
				img.drawBuildShipButton("cruiser",that.x,that.y,targetCanvas);
			break;
			case buttonType.BuildCapital:
				// !!! if this buttontype is unlocked				
				img.drawBuildShipButton("capital",that.x,that.y,targetCanvas);
			break;
			default:
				that.drawThis(targetCanvas);
			break;
		}
	}
	
	that.drawThis = function(targetCanvas){
		if (this.type = buttonType.BuildFrigate){
			console.log("that.drawThis is drawing a .BuildFrigate");
		}
		targetCanvas.fillStyle = that.fill;
		targetCanvas.fillRect(that.x, that.y, that.w, that.h);
		targetCanvas.fillStyle = 'black';
		ctx.font = that.fontStyle;
		targetCanvas.fillText(that.title, that.x + 2, that.y + 15);	
	}
	
	that.gotClicked = function(){
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
				
			case buttonType.BrowseShipsLeft:
				selectedPlanet.shipButtons.page--;
				selectedPlanet.shipButtons.layOutButtons();
				break;
				
			case buttonType.BrowseShipsRight:
				selectedPlanet.shipButtons.page++;
				selectedPlanet.shipButtons.layOutButtons();
				break;
				
				//Build buttons.				
			case buttonType.BuildFrigate:
				console.log("This planet wants to build a Frigate");
				selectedPlanet.buildShip("frigate",1);
				break;
				
			case buttonType.BuildCruiser:
				console.log("This planet wants to build a Cruiser");
				selectedPlanet.buildShip("cruiser",1);

				break;
				
			case buttonType.BuildCapital:
				console.log("This planet wants to build a Capital");
				selectedPlanet.buildShip("capital",1);
				break;
				
			//Selecting units buttons
			case buttonType.Frigates:
				console.log("This planet wants to select a Frigate");
				selectedPlanet.selectFrigate();
				break;
				
			case buttonType.Cruisers:
				console.log("This planet wants to select a Cruisers");
				selectedPlanet.selectCruiser();				
				break;
				
			case buttonType.Capitals:
				console.log("This planet wants to select a Capitals");
				selectedPlanet.selectCapital();				
				break;
				
			case buttonType.Empty:
				//For the moved ships buttons; they don't actually do anything.
				break;
				
			default:
				break;
		
		}
	}

	return that;
}
