
function initBuffers()
{
	//set up the frame buffer
	fBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer);
    fBuffer.width = canvas.width;
    fBuffer.height = canvas.height;
	
	//set up texture for frame buffer
	tBuffer = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tBuffer);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fBuffer.width, fBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	//set up render buffer
	rBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fBuffer.width, fBuffer.height);
						   
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tBuffer, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rBuffer);
	
	//return settings to default
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	
	//set up the frame buffer
	fBuffer_sub = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer_sub);
    fBuffer_sub.width = canvas.width;
    fBuffer_sub.height = canvas.height;
	
	//set up texture for frame buffer
	tBuffer_sub = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tBuffer_sub);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fBuffer_sub.width, fBuffer_sub.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	//set up render buffer
	rBuffer_sub = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rBuffer_sub);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fBuffer_sub.width, fBuffer_sub.height);
						   
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tBuffer_sub, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rBuffer_sub);

	
	initScreen();
}

//for post processing
var squareVertexPositionBuffer;
var squareVertexColorBuffer;
var squareVertexUVBuffer;

function initScreen()
{
	//sets up screen for drawing
	//enables preprocessing
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	var aspect = canvas.width/canvas.height;
	var vertices = [
		 1.0*aspect,  1.0,  0.0,
		-1.0*aspect,  1.0,  0.0,
		 1.0*aspect, -1.0,  0.0,
		-1.0*aspect, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 3;
	squareVertexPositionBuffer.numItems = 4;
	
	squareVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
	var colors = []
	for (var i=0; i < 4; i++) {
		colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	squareVertexColorBuffer.itemSize = 4;
	squareVertexColorBuffer.numItems = 4;
	
	squareVertexUVBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexUVBuffer);
	var uv = [
		 1.0,  1.0,
		 0.0,  1.0,
		 1.0,  0.0,
		 0.0,  0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
	squareVertexUVBuffer.itemSize = 2;
    squareVertexUVBuffer.numItems = 4;
	
	//incr up loading vars
	initsComplete += 2;
	//drawLoading();
}
