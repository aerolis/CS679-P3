function camera ()
{
	this.yaw = 0;
	this.pitch = -90;
	this.roll = 0;
	this.pos = new v3(0,0,0);
	this.lookat = new v3(0,0,0);
	this.distance = 750;
	
	var baseDist = Math.cos(degToRad(this.pitch))*this.distance;
	this.pos.x = Math.cos(degToRad(this.yaw))*baseDist;
	this.pos.y = -Math.sin(degToRad(this.pitch))*this.distance;
	this.pos.z = Math.sin(degToRad(this.yaw))*baseDist;
	
	this.scrollamt = 10;
	this.scrollScale = 0.4;
	this.scrollVel = 0;
	this.scrollDecel = 1.5;
	this.scrollTimer = 0;
	this.maxScrollSpeed = 20;
	
	this.scrollMult = 10;
	this.nearDist = 50;
	this.farDist = 10000;
	this.closeFactor = 1000;
	this.farFactor = 2000;
	this.farFade = 0.9;
	
	//flying vars
	this.flying = false;
	this.flyToPos = new v3(0,0,0);
	this.flyToRot = new v3(45,-45,0);
	this.flyToDistance = 1200;
	this.flyToSteps = 60;
	this.flyingStep = 0;
	this.flyingTimeThreshold = 5000;
	this.flyingFinalPitch = -60;
	this.flyingFinalYaw = 45;
	//flying tracking vars
	this.fposAmt = new v3(0,0,0);
	this.frotAmt = new v3(0,0,0);
	this.fdAmt = 0;
	this.pPos;
	this.pRot;
	this.pD;
	
	//keyboard controls
	this.fwd;
	this.bck;
	this.right;
	this.left;
	this.rup;
	this.rdown;
	this.rleft;
	this.rright;
}

camera.prototype.update = function()
{
	ui.pullTechValues();
	//will depend on mouse/keyboard actions
	//scrolling with keyboard
	if (!this.flying)
	{	//if the camera is not flying on its own
		if (this.fwd)
		{
			this.lookat.z -= (this.distance/(750*this.scrollScale))*this.scrollamt*Math.cos(degToRad(this.yaw));
			this.lookat.x -= (this.distance/(750*this.scrollScale))*this.scrollamt*Math.sin(degToRad(this.yaw));
		}
		if (this.bck)
		{
			this.lookat.z += (this.distance/(750*this.scrollScale))*this.scrollamt*Math.cos(degToRad(this.yaw));
			this.lookat.x += (this.distance/(750*this.scrollScale))*this.scrollamt*Math.sin(degToRad(this.yaw));
		}
		if (this.right)
		{
			this.lookat.z -= (this.distance/(750*this.scrollScale))*this.scrollamt*Math.sin(degToRad(this.yaw));
			this.lookat.x += (this.distance/(750*this.scrollScale))*this.scrollamt*Math.cos(degToRad(this.yaw));
		}
		if (this.left)
		{
			this.lookat.z += (this.distance/(750*this.scrollScale))*this.scrollamt*Math.sin(degToRad(this.yaw));
			this.lookat.x -= (this.distance/(750*this.scrollScale))*this.scrollamt*Math.cos(degToRad(this.yaw));
		}
		//console.log("before: x:"+this.lookat.x+" z:"+this.lookat.z);
		var mapDistance = Math.sqrt(this.lookat.x*this.lookat.x + this.lookat.z*this.lookat.z);
		if (mapDistance > mp.size)
		{
			this.lookat.z = mp.size*(this.lookat.z/mapDistance);	
			this.lookat.x = mp.size*(this.lookat.x/mapDistance);	
			//console.log("after: x:"+this.lookat.x+" z:"+this.lookat.z);
		}
		var val = 1;	
		
		//slow down scrolling here
		if (this.scrollTimer > 0)
			this.scrollTimer--;
		else
		{
			if (this.scrollVel > 0)
				this.scrollVel -= this.scrollDecel;
			else if (this.scrollVel < 0)
				this.scrollVel += this.scrollDecel;
			if (this.scrollVel < this.scrollDecel+0.1 && this.scrollVel > -this.scrollDecel-0.1)
				this.scrollVel = 0;
		}
		this.updatePos();
	}
	else
	{
		//flyto code here
		this.updateFly();
	}
	
}

camera.prototype.updateFly = function()
{
	//check if we're there or not
	if (this.flyingStep >= this.flyToSteps)
	{
		this.flying = false;
		this.resetFlyTo();		
	}
	else
	{
		//fly us there
		var int = this.flyingStep/this.flyToSteps;
		this.lookat.x 	= this.pPos.x 	+ int * this.fposAmt.x;
		this.lookat.y 	= this.pPos.y 	+ int * this.fposAmt.y;
		this.lookat.z 	= this.pPos.z 	+ int * this.fposAmt.z;
		this.yaw 		= this.pRot.x 	+ int * this.frotAmt.x;
		this.pitch 		= this.pRot.y 	+ int * this.frotAmt.y;
		this.roll 		= this.pRot.z 	+ int * this.frotAmt.z;
		this.distance	= this.pD		+ int * this.fdAmt;
		this.flyingStep++;
	}
	//either way calculate the position update
	var baseDist = -Math.cos(degToRad(this.pitch))*this.distance;
	this.pos.x = this.lookat.x - Math.sin(degToRad(this.yaw))*baseDist;
	this.pos.y = this.lookat.y - Math.sin(degToRad(this.pitch))*this.distance;
	this.pos.z = this.lookat.z - Math.cos(degToRad(this.yaw))*baseDist;
	
}
camera.prototype.flyTo = function(pos)
{
	this.flying = true;
	this.flyToPos = new v3(pos.x,pos.y,pos.z);
	this.flyToRot = new v3(this.flyingFinalYaw,this.flyingFinalPitch,0);
	this.flyToDistance = 800;
	this.flyingStep = 0;
	var dx = this.flyToPos.x-this.lookat.x;
	var dy = this.flyToPos.y-this.lookat.y;
	var dz = this.flyToPos.z-this.lookat.z;
	var travelDistance = Math.sqrt(dx*dx+dy*dy+dz*dz);
	this.flyToSteps = 30*Math.max(Math.min(travelDistance/this.flyingTimeThreshold,2.0),0.1);
	
	//save initial position
	this.pPos = new v3(this.lookat.x,this.lookat.y,this.lookat.z);
	this.pRot = new v3(this.yaw,this.pitch,this.roll);
	this.pD = this.distance;
	//calculate the variance between the initial and final
	this.fposAmt = new v3(this.flyToPos.x-this.lookat.x,this.flyToPos.y-this.lookat.y,this.flyToPos.z-this.lookat.z);
	this.frotAmt = new v3(this.flyToRot.x-this.yaw,this.flyToRot.y-this.pitch,this.flyToRot.z-this.roll);
	this.fdAmt = this.flyToDistance - this.distance;
}
camera.prototype.flyToFull = function(pos,rot,dist)
{
	this.flying = true;
	this.flyToPos = new v3(pos.x,pos.y,pos.z);
	this.flyToRot = new v3(rot.x,rot.y,rot.z);
	this.flyToDistance = dist;
	this.flyingStep = 0;
	var dx = this.flyToPos.x-this.lookat.x;
	var dy = this.flyToPos.y-this.lookat.y;
	var dz = this.flyToPos.z-this.lookat.z;
	var travelDistance = Math.sqrt(dx*dx+dy*dy+dz*dz);
	this.flyToSteps = 60*Math.max(Math.min(travelDistance/this.flyingTimeThreshold,2.0),0.1);
	
	//save initial position
	this.pPos = new v3(this.lookat.x,this.lookat.y,this.lookat.z);
	this.pRot = new v3(this.yaw,this.pitch,this.roll);
	this.pD = this.distance;
	//calculate the variance between the initial and final
	this.fposAmt = new v3(this.flyToPos.x-this.lookat.x,this.flyToPos.y-this.lookat.y,this.flyToPos.z-this.lookat.z);
	this.frotAmt = new v3(this.flyToRot.x-this.yaw,this.flyToRot.y-this.pitch,this.flyToRot.z-this.roll);
	this.fdAmt = this.flyToDistance - this.distance;
}

camera.prototype.resetFlyTo = function()
{	
	this.flyToPos = new v3(0,0,0);
	this.flyToRot = new v3(this.flyingFinalYaw,this.flyingFinalPitch,0);
	this.flyToDistance = 800;
	this.flyingStep = 0;
	
	//save initial position
	this.pPos = new v3(0,0,0);
	this.pRot = new v3(0,0,0);
	this.pD = 0;
	//calculate the variance between the initial and final
	this.fposAmt = null;
	this.frotAmt = null;
	this.fdAmt = 0;
}
camera.prototype.zoom = function(delta)
{
	this.scrollVel += delta;
	this.scrollVel = Math.min(this.scrollVel,this.maxScrollSpeed);
	this.scrollVel = Math.max(this.scrollVel,-this.maxScrollSpeed);
	this.scrollTimer = 5;	
}
camera.prototype.translate = function(vert,horz)
{
	var scaleFactor = Math.max((this.distance/(750*this.scrollScale)),1.5);
	//vertical scrolling
	this.lookat.z -= scaleFactor*this.scrollamt*Math.cos(degToRad(this.yaw))*vert;
	this.lookat.x -= scaleFactor*this.scrollamt*Math.sin(degToRad(this.yaw))*vert;
	//horizontal scrolling
	this.lookat.z -= scaleFactor*this.scrollamt*Math.sin(degToRad(this.yaw))*horz;
	this.lookat.x += scaleFactor*this.scrollamt*Math.cos(degToRad(this.yaw))*horz;
	
	//check to make sure they are in bounds
	//console.log("before: x:"+this.lookat.x+" z:"+this.lookat.z);
	var mapDistance = Math.sqrt(this.lookat.x*this.lookat.x + this.lookat.z*this.lookat.z);
	if (mapDistance > mp.size)
	{
		this.lookat.z = mp.size*(this.lookat.z/mapDistance);	
		this.lookat.x = mp.size*(this.lookat.x/mapDistance);	
		//console.log("after: x:"+this.lookat.x+" z:"+this.lookat.z);
	}
	
	this.updatePos();
}
camera.prototype.updatePos = function()
{
	//update distance based on scrolling velocity
	if (this.scrollVel < 0)
		this.distance += this.scrollMult*((this.distance-this.nearDist)/this.closeFactor)*this.scrollVel
	else
	{
		if (this.distance < this.farDist*this.farFade)
			this.distance += this.scrollMult*this.scrollVel;
		else
		{
			var d = this.farDist*this.farFade;
			this.distance += this.scrollMult*((this.distance-d)/(this.farDist-d))*this.scrollVel;
		}
	}
	this.distance = Math.min(this.distance,this.farDist);
	this.distance = Math.max(this.distance,this.nearDist);
	
	
	//update y/p/r based on rotational velocity
	
	var baseDist = -Math.cos(degToRad(this.pitch))*this.distance;
	this.pos.x = this.lookat.x - Math.sin(degToRad(this.yaw))*baseDist;
	this.pos.y = this.lookat.y - Math.sin(degToRad(this.pitch))*this.distance;
	this.pos.z = this.lookat.z - Math.cos(degToRad(this.yaw))*baseDist;
}
