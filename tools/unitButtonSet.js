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
		that.shownButtons = [];
		var atButton = 8 * that.page;
		var yLoc = 0;
		while(atButton < that.buttons.length && atButton < (8 * that.page + 8)){
			that.buttons[atButton].x = OptionBarX + 10 + ShipButtonWidth * (atButton%4);
			//If it's one of the first four buttons, show it at the top
			if (Math.floor(atButton%8 < 4)) {yLoc = 0;}
			//If it's one of the last four buttons, show it at the bottom.
			else {yLoc = ShipButtonHeight *2;}
			that.buttons[atButton].y = OptionBarY + 10 + yLoc;
			that.shownButtons.push(that.buttons[atButton]);
			atButton++;
		}	
		//See if you need arrow buttons.
		//If there are several pages...
		if (that.buttons > that.shownButtons){
			//If you're not on the first page you need a browse left button.
			if (that.page > 0){
				var arrowLeft = new Button();
				arrowLeft.x = OptionBarX + 10;
				arrowLeft.y = OptionBarY + 10 + ShipButtonHeight;
				arrowLeft.w = ShipButtonWidth;
				arrowLeft.h = ShipButtonHeight;
				arrowLeft.fill = '#4C7D7E';
				arrowLeft.title = "Browse Left";	
				arrowLeft.type = buttonType.BrowseShipsLeft;
				that.shownButtons.push(arrowLeft);
			}	
			//If you're not on the last page you need a browse right button.	
			if (that.buttons.length > (that.page + 1) * 8){
				var arrowRight = new Button();
				arrowRight.x = OptionBarX + 10 + 3 * ShipButtonWidth;
				arrowRight.y = OptionBarY + 10 + ShipButtonHeight;
				arrowRight.w = ShipButtonWidth;
				arrowRight.h = ShipButtonHeight;
				arrowRight.fill = '#4C7D7E';
				arrowRight.title = "Browse Right";	
				arrowRight.type = buttonType.BrowseShipsRight;
				that.shownButtons.push(arrowRight);
			}		
		}
	}
	
	that.checkClicked = function(mouseX, mouseY){
		clear(gctx);
		//Check normal buttons
		var l = that.shownButtons.length;
		for (var i = l-1; i >= 0; i--) {
			// draw shape onto ghost context
			that.shownButtons[i].draw(gctx);
		
			// get image data at the mouse x,y pixel
			var imageData = gctx.getImageData(mouseX, mouseY, 1, 1);
			var index = (mouseX + mouseY * imageData.width) * 4;

			// if the mouse pixel exists, select and break
			if (imageData.data[3] > 0) {
				var mySel = that.shownButtons[i];
				mySel.gotClicked();
				clear(gctx);
				return true;
			}
		}
		// havent returned means we have selected nothing
		mySel = null;
		// clear the ghost canvas for next time
		clear(gctx);
		return false;
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
		var type = 0;
		var col_ref = 0;
		//Find the right numbers & images
		switch(that.shipType){
			case "Frigates":
				remaining = selectedPlanet.myFleet.Frigates.length;
				selected = selectedPlanet.selectedFleet.Frigates.length;
				type = "frigate";
				col_ref = 3;
				break;
			case "FrigatesMoved":
				remaining = selectedPlanet.myFleet.FrigatesMoved.length;
				selected = selectedPlanet.selectedFleet.FrigatesMoved.length;
				type = "frigate";
				col_ref = 2;
				break;
			case "Cruisers":
				remaining = selectedPlanet.myFleet.Cruisers.length;
				selected = selectedPlanet.selectedFleet.Cruisers.length;
				type = "cruiser";
				col_ref = 3;
				break;
			case "CruisersMoved":
				remaining = selectedPlanet.myFleet.CruisersMoved.length;
				selected = selectedPlanet.selectedFleet.CruisersMoved.length;
				type = "cruiser";
				col_ref = 2;
				break;
			case "Capitals":
				remaining = selectedPlanet.myFleet.Capitals.length;
				selected = selectedPlanet.selectedFleet.Capitals.length;
				type = "capital";
				col_ref = 3;
				break;
			case "CapitalsMoved":
				remaining = selectedPlanet.myFleet.CapitalsMoved.length;
				selected = selectedPlanet.selectedFleet.CapitalsMoved.length;
				type = "capital";
				col_ref = 2;
				break;	
			case "Default":
				break;		
		}		

		//draws box behind - if I don't the button clicks don't work
		targetCanvas.fillStyle = 'black';
		targetCanvas.fillRect(that.x+2, that.y+2, that.w-4, that.h-4);
		
		//draws button w/ numbers
		img.drawShipButton(type,that.x,that.y,remaining,selected,col_ref,targetCanvas);
		
	}	
	return that;
}
