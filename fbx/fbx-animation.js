var magicnumber = 1539538600;

function fbx_animation()
{	
	this.id = 0;
	this.model_id = 0;

	this.trans = new v3(0,0,0);
	this.rot = new v3(0,0,0);
	this.scale = new v3(1,1,1);

	this.trans_nodes = 0;
	this.hasTrans = false;
	this.rot_nodes = 0;
	this.hasRot = false;
	this.scale_nodes = 0;
	this.hasScale = 0;
}
fbx_animation.prototype.advance = function()
{
	//translations
	if (this.hasTrans)
	{
		this.trans_nodes.advance();
		this.trans = this.trans_nodes.val;
	}
	//rotations
	if (this.hasRot)
	{
		this.rot_nodes.advance();
		this.rot = this.rot_nodes.val;
	}
	//scales
	if (this.hasScale)
	{
		if (!this.scale_nodes.isNull)
		{
			this.scale_nodes.advance();
			this.scale = this.scale_nodes.val;
		}
		else
		{
			this.scale = new v3(1,1,1);
			this.hasScale = false;
		}
	}
}

function fbx_node()
{
	this.id = 0;
	this.curves = new v3(0,0,0);
	this.val = new v3(0,0,0);
	this.isNull = false;
}
fbx_node.prototype.advance = function()
{
	if (this.curves.x.maxFrame > 0)
		this.curves.x.advance();
	if (this.curves.y.maxFrame > 0)
		this.curves.y.advance();
	if (this.curves.z.maxFrame > 0)
		this.curves.z.advance();
	this.checkNull();
	this.val = new v3(this.curves.x.val,this.curves.y.val,this.curves.z.val);
}
fbx_node.prototype.checkNull = function()
{
	if (this.curves.x.maxFrame == 0 && this.curves.y.maxFrame == 0 && this.curves.z.maxFrame == 0)
		this.isNull = true;
}


function fbx_curve()
{
	this.id = 0;
	this.kf = new Array();
	this.ind = 0;
	this.t = new Array();
	this.frame = 0;
	this.maxFrame = 0;
	this.val = 0;
}
fbx_curve.prototype.advance = function()
{
	//move along keyframs
	if (this.kf.length > 1)
	{
		var kfa = this.kf[this.ind];
		var kfb = this.kf[this.ind+1];
		
		if (this.frame < kfb)
		{
			//deal with keyframe interpolation
			var inter = (this.frame-kfa)/(kfb-kfa);
			this.val = this.t[this.ind]+(this.t[this.ind+1]-this.t[this.ind])*inter;
		}
		else
		{
			this.ind++;
			if (this.ind > this.kf - 1)
				this.ind = 0;
			kfa = this.kf[this.ind];
			kfb = this.kf[this.ind+1];
			//deal with keyframe interpolation
			var inter = (this.frame-kfa)/(kfb-kfa);
			this.val = this.t[this.ind]+(this.t[this.ind+1]-this.t[this.ind])*inter;
		}
	}
	//now advance to next frame
	this.frame++;
	this.frame = this.frame % this.maxFrame;
}
