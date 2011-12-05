var buttonType = { 	"EndTurn": 0,
					"Send": 1,
					"Upgrade": 2,
					"BuildUnit1": 3,
					"BuildUnit2": 4,
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
	that.type = buttonType.Send;

	//targetCanvas = either real canvas or ghostcanvas. ghostcanvas for checking if selected.
  	that.draw = function(targetCanvas){
		targetCanvas.fillStyle = that.fill;
  		targetCanvas.fillRect(that.x, that.y, that.w, that.h);
  		targetCanvas.fillStyle = 'black';
		ctx.font = that.fontStyle;
		targetCanvas.fillText(that.title, that.x + 2, that.y + 10);
	}
	
	that.gotClicked = function(){
		console.log(that.title + " got clicked.");
		switch (that.type){
			case buttonType.EndTurn:
				//Do ending turn stuff				
				nextTurn();
				break;
			
			case buttonType.Send:
				//Do stuff
				// ==========
				// selectedPlanet.sendArmy;
				// mouseMode = MouseModes.sendArmyTo;
				// =============
				console.log("This planet wants to send out an army");
				break;
				
			case buttonType.Upgrade:
				//Do stuff
				console.log("This planet wants to upgrade");
				break;
				
			case buttonType.BuildUnit1:
				//Do stuff
				console.log("This planet wants to build a unit type 1");
				break;
				
			case buttonType.BuildUnit2:
				//Do stuff
				console.log("This planet wants to build a unit type 2");
				break;
			default:
				console.log("I do go through the switch. that.type = " + that.type);
				break;
		
		}
	}

	return that;
}
