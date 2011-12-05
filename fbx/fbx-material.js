//classes for material and textures - leave me alone!

function fbx_material()
{
	this.id;
	this.ambientColor;
	this.diffuseColor;
	this.specularColor;
	this.shininess;
	this.emissive;
	this.ambient;
	this.diffuse;
	this.specular;
	this.specularFactor;
	this.opacity;
	this.emissiveFactor;
	this.diffuseTexture;
	this.transparentTexture;
	this.hasDiffuse = 0;
	this.hasTransparent = 0;
}

function fbx_texture()
{
	this.id;
	this.fileloc = "";
	this.uvScale;
	this.uvTranslate;
	this.gl_text;
	this.img = 0;
	this.type = 0;
	this.bound = false;
}
fbx_texture.prototype.initTexture = function(modelID,textureID)
{
	//console.log("modelID:"+modelID+" textureID:"+textureID);
	if (this.type == 1)
	{
		if (this.img.complete)
		{
			this.gl_text = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.gl_text);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
			this.bound = true;
		}
		else
		{
			var t = setTimeout("models["+modelID+"].textures["+textureID+"].initTexture("+modelID+","+textureID+")", 1/30 * 1000);
		}
	}
}