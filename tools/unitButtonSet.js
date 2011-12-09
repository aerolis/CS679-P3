// JavaScript Document

function unitButtonSet(){	
	var that = buttonset.apply(this,arguments);
	
	//Keep track of at what page you are.
	that.page = 0;
	that.shownButtons = [];
	
	that.addUnitButton = function(fill, title, buttonType, shipType){
		var item = new unitButton();
  		item.fill = fill;
  		item.title = title;	
		item.type = buttonType;
		item.shipType = shipType;
  		that.buttons.push(item);
	} ;	
	
	that.draw = function(){
		for (var i = 0; i < that.shownButtons.length; i++){
			that.shownButtons[i].draw(ctx);
		}		
	}
	
	that.clear = function(){
		clear(ctx);
		that.buttons = [];
		that.shownButtons = [];
	}
	
	that.layOutButtons = function(){
		console.log("layOutbuttons, buttons.length: " + that.buttons.length);
		that.shownButtons = [];
		var atButton = 8 * that.page;
		var yLoc = 0;
		while(atButton < that.buttons.length && atButton < (8 * that.page + 8)){
			that.buttons[atButton].x = OptionBarX + 10 + ShipButtonWidth * (atButton%4);
			if (Math.floor(atButton%8 < 4)) {yLoc = 0;}
			else {yLoc = ShipButtonHeight *2;}
			that.buttons[atButton].y = OptionBarY + 10 + yLoc;
			that.shownButtons.push(that.buttons[atButton]);
			atButton++;
		}
		console.log("layOutbuttons, shownButtons.length: " + that.shownButtons.length);
			
	}

	return that;
}

function unitButton(){
	var that = Button.apply(this, arguments);
	that.shipType = "";
	that.w = ShipButtonWidth;
	that.h = ShipButtonHeight;
	
	that.draw = function(targetCanvas){
		var remaining = 0;
		var selected = 0;
	
		//Find the right numbers.
		switch(that.shipType){
			//Good numbers
			case "Frigates":
				remaining = selectedPlanet.myFleet.Frigates.length;
				selected = selectedPlanet.selectedFleet.Frigates.length;
				//Also draw the corresponding image right here. (For each shipType)
				break;
			case "FrigatesMoved":
				remaining = selectedPlanet.myFleet.FrigatesMoved.length;
				selected = selectedPlanet.selectedFleet.FrigatesMoved.length;
				break;
			case "Cruisers":
				remaining = selectedPlanet.myFleet.Cruisers.length;
				selected = selectedPlanet.selectedFleet.Cruisers.length;
				break;
			case "CruisersMoved":
				remaining = selectedPlanet.myFleet.CruisersMoved.length;
				selected = selectedPlanet.selectedFleet.CruisersMoved.length;
				break;
			case "Capitals":
				remaining = selectedPlanet.myFleet.Capitals.length;
				selected = selectedPlanet.selectedFleet.Capitals.length;
				break;
			case "CapitalsMoved":
				remaining = selectedPlanet.myFleet.CapitalsMoved.length;
				selected = selectedPlanet.selectedFleet.CapitalsMoved.length;
				break;	
			case "Default":
				break;		
		}		
		
		//Draw the good numbers.
		targetCanvas.fillStyle = that.fill;
		targetCanvas.fillRect(that.x, that.y, that.w, that.h);
		targetCanvas.fillStyle = 'black';
		targetCanvas.font = that.fontStyle;
		targetCanvas.fillText(remaining, that.x + 2, that.y + 15);
		targetCanvas.fillText(selected, that.x + that.w - 15, that.y + 15);
		// !!! This gets to go once there are images.
		targetCanvas.fillText(that.title, that.x + 2, that.y + 30);
		
	}	
	return that;
}
