// we use a fake canvas to draw individual shapes for selection testing
var ghostcanvas;
var gctx;
var HEIGHT;
var WIDTH;

function buttonset(){
	var that = {};
	
	that.buttons = [];

	//Initialize things
	HEIGHT = canvas.height;
  	WIDTH = canvas.width;
  	ghostcanvas = document.createElement('canvas');
  	ghostcanvas.height = HEIGHT;
  	ghostcanvas.width = WIDTH;
  	gctx = ghostcanvas.getContext('2d');
	
  	//Padding problem fix
  	if (document.defaultView && document.defaultView.getComputedStyle) {
		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
	    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
	    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
	    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
	
	//Replace the mousedown function
	//canvas.onmousedown = myDown;  => Is the other handleMouseUp function

	that.backgColor = "rgb(255, 255, 255)";

	//Function to add buttons.
	// x, y, w, h  = location + dimenseions
	// fill = color
	// title = text on button
	// type = what function the button has
	// owner = the planet that owns it.
	that.addButton = function(x, y, w, h, fill, title, type){
		var item = new Button();
  		item.x = x;
  		item.y = y;
  		item.w = w
  		item.h = h;
  		item.fill = fill;
  		item.title = title;	
		item.type = type;
  		that.buttons.push(item);		
	} ;

	that.draw = function(){
		for (var i = 0; i < that.buttons.length; i++){
			that.buttons[i].draw(ctx);
		}
	};
	
	//Remove everything
	that.clear = function(){
		clear(ctx);
		that.buttons = [];
	}
	
	that.checkClicked = function(mouseX, mouseY){
		clear(gctx);
		var l = that.buttons.length;
		for (var i = l-1; i >= 0; i--) {
			// draw shape onto ghost context
			that.buttons[i].draw(gctx);
		
			// get image data at the mouse x,y pixel
			var imageData = gctx.getImageData(mouseX, mouseY, 1, 1);
			var index = (mouseX + mouseY * imageData.width) * 4;

			// if the mouse pixel exists, select and break
			if (imageData.data[3] > 0) {
				var mySel = that.buttons[i];
				mySel.gotClicked();
				// owner.handleButton(mySel);
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
	
	that.checkHover = function(mouseX,mouseY) {
		clear(gctx);
		var mySel = null;
		var l = that.buttons.length;
		for (var i = l-1; i >= 0; i--) {
			// draw shape onto ghost context
			that.buttons[i].draw(gctx);
		
			// get image data at the mouse x,y pixel
			var imageData = gctx.getImageData(mouseX, mouseY, 1, 1);
			var index = (mouseX + mouseY * imageData.width) * 4;

			// if the mouse pixel exists, select and break
			if (imageData.data[3] > 0) {
				mySel = that.buttons[i];
				clear(gctx);
			}
		}
		// havent returned means we have selected nothing
		// clear the ghost canvas for next time
		clear(gctx);
		return mySel;
	}

	return that;
}


function clear(c){
	c.clearRect(0, 0, WIDTH, HEIGHT);
}