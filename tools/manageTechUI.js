function techUI()
{
	this.pos = 0;
	this.maxPos = 800;
	this.basePos = 1300;
	this.speed = 15;
	this.hideMe = false;
	this.showMe = false;
}

techUI.prototype.pullTechValues = function()
{
	if ($('#useNewScrollVals').val())
	{
		cam.scrollMult = parseInt($('#scrollMult').val());
		cam.nearDist = parseInt($('#nearDist').val());
		cam.farDist = parseInt($('#farDist').val());
		cam.closeFactor = parseInt($('#closeFactor').val());
		cam.farFactor = parseInt($('#farFactor').val());
		cam.farFade = parseFloat($('#farFade').val());
		cam.scrollDecel = parseFloat($('#scrollDecel').val());
		cam.maxScrollSpeed = parseInt($('#maxScrollSpeed').val());
	}
	if ($('#useNewFlyingVals').val())
	{
		cam.flyingTimeThreshold = parseInt($('#fTimeThreshold').val());
		cam.flyingFinalPitch = parseInt($('#fFinalPitch').val());
		cam.flyingFinalYaw = parseInt($('#fFinalYaw').val());
	}

}

techUI.prototype.update = function()
{
	if (this.hideMe)
		this.disappear();
	else if (this.showMe)
		this.unhide();
}


techUI.prototype.hide = function()
{
	this.hideMe = true;
}
techUI.prototype.show = function()
{
	this.showMe = true;
}
techUI.prototype.toggle = function()
{
	if (this.pos > this.speed)
	{
		this.hideMe = false;
		this.showMe = true;
	}
	else if (this.pos < this.maxPos - this.speed)
	{
		this.hideMe = true;
		this.showMe = false;
	}
}
techUI.prototype.disappear = function()
{
	if (this.pos < this.maxPos)
	{
		this.pos += this.speed;
		this.definePos();
	}
	else
	{
		document.getElementById("optionsBar").style.display = "none";
		this.hideMe = false;
		this.pos = this.maxPos;
		this.definePos();
	}
}
techUI.prototype.hideImmediate = function()
{
	this.pos = this.maxPos;
	document.getElementById("optionsBar").style.display = "none";
	this.definePos();
}
techUI.prototype.unhide = function()
{
	if (this.pos > 0)
	{
		this.pos -= this.speed;
		document.getElementById("optionsBar").style.display = "block";
		this.definePos();
	}
	else
	{
		this.showMe = false;
		this.pos = 0;
		this.definePos();
	}
}
techUI.prototype.showImmediate = function()
{
	this.pos = 0;
	document.getElementById("optionsBar").style.display = "block";
	this.definePos();
}

techUI.prototype.definePos = function()
{
	var amt = this.basePos - this.pos;
	document.getElementById("optionsBar").style.left = "" + amt + "px";
}