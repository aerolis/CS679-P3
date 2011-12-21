function audioDriver()
{
	this.songs = new Array();
	this.songs[0] = new Audio('audio/spaceexplorers.mp3');
	this.songs[1] = new Audio('audio/ir.mp3');
	this.songs[2] = new Audio('audio/procession.mp3');
	this.songs[0].load();
	this.songs[1].load();
	this.songs[2].load();
	this.playing = -1;
}

audioDriver.prototype.update = function()
{
	if (this.songs[this.playing].ended)
	{
		this.playing = -1;
		this.startSong();
	}
}

audioDriver.prototype.startSong = function()
{
	//document.getElementById('song_a').play();
	var a = Math.floor(Math.random()*2.999);
	this.songs[a].play();
	this.playing = a;
}