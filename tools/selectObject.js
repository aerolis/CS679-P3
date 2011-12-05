function pickObject()
{
	var rays = getRay();
	var ray = rays.slice(0,4);
	var ray_sp = rays.slice(4,7);
	var pl = findObject(ray_sp,ray);
	return pl;
}

function getRay()
{	
	setupMV();
	var x = mousex;
	var y = mousez;
	var centered_y = (gl.viewportHeight - y) - gl.viewportHeight/2;
	var centered_x = x - gl.viewportWidth/2;
	var unit_x = centered_x/(gl.viewportWidth/2);
	var unit_y = centered_y/(gl.viewportHeight/2);
	var aspect = gl.viewportWidth / gl.viewportHeight;

	var near_height = zNear * Math.tan( fov * Math.PI / 360.0 );
	var ray = [unit_x*near_height*aspect, unit_y*near_height, -zNear, 0];
	var ray_start_point = [0, 0, 0, 1];
	
	var inv_MV = mat4.create(cMatrix);
	mat4.multiply(inv_MV,mvMatrix,false);
	mat4.inverse(inv_MV,false);
	mat4.multiplyVec4(inv_MV, ray, false);
	mat4.multiplyVec4(inv_MV, ray_start_point, false);
	//ray[1] = -ray[1];
	return ray.concat(ray_start_point);
}

function findObject(sp,r)
{
	//normalize ray
	var ray = new v3(r[0],r[1],r[2]);
	ray = ray.normalize();
	//create list of possible planets
	var collisions = new Array();
	var planetCollisions = new Array();
	var i,j;
	
	//now find all that the ray collides with
	var pos = new v3(sp[0],sp[1],sp[2]);
	for (i=0;i<zFar;i+=3)
	{
		for (j=0;j<mp.planetPos.length;j++)
		{
			var dist = pos.distance(mp.planetPos[j]);
			if (dist<50)
			{
				if (planetCollisions.indexOf(j) == -1)
				{
					collisions.push(new c2(j,dist));
					planetCollisions.push(j);
				}
			}
		}
		pos.x = sp[0] + i*ray.x;
		pos.y = sp[1] + i*ray.y;
		pos.z = sp[2] + i*ray.z;
	}
	//now determine which is the closest
	var pl = null;
	var minDist = 5000;
	for (i=0;i<collisions.length;i++)
	{
		if (collisions[i].b < minDist)
		{
			minDist = collisions[i].b;
			pl = mp.planetList[collisions[i].a];
		}
	}
	if (pl != null)
		return pl;
	else
		return -1;
}

function getClickLocationOnPlane()
{	
	var rays = getRay();
	var ray = rays.slice(0,4);
	var ray_sp = rays.slice(4,7);
		
	//now find all that the ray collides with
	var nray = new v3(ray[0],ray[1],ray[2]);
	nray = nray.normalize();
	var pos = new v3(ray_sp[0],ray_sp[1],ray_sp[2]);
	var i = 0;
	while(pos.y > -10)
	{
		if (checkNear(pos.y,0,2))
		{
			return pos;
		}
		pos.x = ray_sp[0] + i*nray.x;
		pos.y = ray_sp[1] + i*nray.y;
		pos.z = ray_sp[2] + i*nray.z;
		i += 3;
	}
}

function checkNear(test,val,amt)
{
	if (test < val+amt && test > val-amt)
		return true;
	return false;	
}