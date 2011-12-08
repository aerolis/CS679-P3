//some vector classes just to store vectors and do simple vector ops
//much of this can be done with gl-matrix functions but some of this
//may be called elsewhere so I've left it

// vector types
function v2(x,y)
{
	this.x = x;
	this.y = y;
}
v2.prototype.add = function(v)
{
	var ret = new v2(0,0);
	ret.x = this.x+v.x;
	ret.y = this.y+v.y;
	return ret;
}
v2.prototype.subtract = function(v)
{
	var ret = new v2(0,0,0);
	ret.x = this.x-v.x;
	ret.y = this.y-v.y;
	ret.z = this.z-v.z;
	return ret;
}
v2.prototype.mult = function(v)
{
	var ret = new v2(0,0);
	ret.x = this.x*v.x;
	ret.y = this.y*v.y;
	return ret;
}
v2.prototype.div = function(v)
{
	var ret = new v2(0,0);
	ret.x = this.x/v.x;
	ret.y = this.y/v.y;
	return ret;
}
v2.prototype.normalize = function()
{
	var ret = new v2(0,0);
	var mag = this.magnitude();
	ret.x = this.x/mag;
	ret.y = this.y/mag;
	return ret;
}
v2.prototype.magnitude = function()
{
	return Math.sqrt(this.x*this.x+this.y*this.y);
}

function v3(x,y,z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}
v3.prototype.add = function(v)
{
	var ret = new v3(0,0,0);
	ret.x = this.x+v.x;
	ret.y = this.y+v.y;
	ret.z = this.z+v.z;
	return ret;
}
v3.prototype.subtract = function(v)
{
	var ret = new v3(0,0,0);
	ret.x = this.x-v.x;
	ret.y = this.y-v.y;
	ret.z = this.z-v.z;
	return ret;
}
v3.prototype.mult = function(v)
{
	var ret = new v3(0,0,0);
	ret.x = this.x*v;
	ret.y = this.y*v;
	ret.z = this.z*v;
	return ret;
}
v3.prototype.multiply = function(v)
{
	var ret = new v3(0,0,0);
	ret.x = this.x*v.x;
	ret.y = this.y*v.y;
	ret.z = this.z*v.z;
	return ret;
}
v3.prototype.div = function(v)
{
	var ret = new v3(0,0,0);
	ret.x = this.x/v;
	ret.y = this.y/v;
	ret.z = this.z/v;
	return ret;
}
v3.prototype.normalize = function()
{
	var ret = new v3(0,0,0);
	var mag = this.magnitude();
	ret.x = this.x/mag;
	ret.y = this.y/mag;
	ret.z = this.z/mag;
	return ret;
}
v3.prototype.distance = function(v)
{
	var val = 0;
	var dx = v.x-this.x;
	var dy = v.y-this.y;
	var dz = v.z-this.z;
	val = Math.sqrt(dx*dx+dy*dy+dz*dz);
	return val;
}
v3.prototype.magnitude = function()
{
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}
v3.prototype.limit = function(val)
{
	var ret = new v3(this.x,this.y,this.z);
	var mag = ret.magnitude();
	if (mag > val)
	{
		return ret.normalize().mult(val);
	}
	return ret;
}

function v4(x,y,z,a)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.a = a;
}
v4.prototype.add = function(v)
{
	var ret = new v4(0,0,0,0);
	ret.x = this.x+v.x;
	ret.y = this.y+v.y;
	ret.z = this.z+v.z;
	ret.a = this.a+v.a;
	return ret;
}
v4.prototype.subtract = function(v)
{
	var ret = new v4(0,0,0,0);
	ret.x = this.x-v.x;
	ret.y = this.y-v.y;
	ret.z = this.z-v.z;
	ret.a = this.a-v.a;
	return ret;
}
v4.prototype.mult = function(v)
{
	var ret = new v4(0,0,0,0);
	ret.x = this.x*v.x;
	ret.y = this.y*v.y;
	ret.z = this.z*v.z;
	ret.a = this.a*v.a;
	return ret;
}
v4.prototype.div = function(v)
{
	var ret = new v4(0,0,0,0);
	ret.x = this.x/v.x;
	ret.y = this.y/v.y;
	ret.z = this.z/v.z;
	ret.a = this.a/v.a;
	return ret;
}
v4.prototype.normalize = function()
{
	var ret = new v4(0,0,0,0);
	var mag = this.magnitude();
	ret.x = this.x/mag;
	ret.y = this.y/mag;
	ret.z = this.z/mag;
	ret.a = this.a/mag;
	return ret;
}
v4.prototype.magnitude = function()
{
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.a*this.a);
}

function c1(a)
{
	this.a = a;
}
function c2(a,b)
{
	this.a = a;
	this.b = b;
}
function c3(a,b,c)
{
	this.a = a;
	this.b = b;
	this.c = c;
}
function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
} 