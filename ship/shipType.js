//Lists of weapons, defenses for each ship type
//factories with higher level will have a longer catalog 
function shipType(i_type)  //detailed information of each ship type
{
	this.type = i_type;
	this.weapon = ["laser"];
	this.defense = ["shield"];
	this.consumption = [["wood",10]];  // resources taken to bulid one ship
	this.maxHp  = 100;
	this.period = 1;  //# of turns taken to bulid
	
	if ( i_type == "corporal" ) 
	{
		this.weapon.push("missile");
		this.defense.push("armor");
		
		this.consumption.push(["copper",10]);
		
		this.maxHp = 200;
		this.period = 2;
	}
	
	if ( i_type == "captain" ) 
	{
		this.weapon.push("missile");
		this.weapon.push("neuclear");
		
		this.defense.push("armor");
		this.defense.push("carbonShell");
		
		this.consumption.push(["copper",10]);
		this.consumption.push(["iron",20]);
		
		this.maxHp = 300;
		this.period = 3;
	}
	
}
function shipCatalog(i_owner){//ship catalog of one player
	this.owner = i_owner;
	this.level = 1;
	this.shipList = [];
	this.shipList.push(new shipType("private"));

}

shipCatalog.prototype.upgrade = function(){ //one level per upgrade
	if ( this.level == 3 ){
		return;
	}
	this.level++;
	if( i_level > 1){
		this.shipList.push(new shipType("corporal"));
	}
	if( i_level > 2 ){
		this.shipList.push(new shipType("captain"));
	}
}

