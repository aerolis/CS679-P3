//Enum to store shiptypes
// !!! Not in use currently, but this is the better practice way to do this...
var shipTypes = { 	"Frigate": 0,
					"Cruiser": 1,
					"Capital": 2,
					};

function shipCatalog(i_owner){ //add testing catalog items for now
	this.owner = i_owner;
	this.catalog = [];
	this.catalog.push(new ship(i_owner, "Frigate")); 
	this.catalog.push(new ship(i_owner, "Cruiser"));
	this.catalog.push(new ship(i_owner, "Capital"));
}
//Basic ship class
function ship(i_owner,i_type){
	//basic information initialized in the factory
	this.owner = i_owner;
	this.type = i_type;
	//this.pos = i_pos;
	//hardcode 3 kinds of ships, dont need shiptype.js anymore
	this.moved = false;
	
	if(this.type == "Frigate" )
	{
		//Damage and defense value of this ship
		this.laser = 10;
		this.missile = 20;
		this.armor = 10;
		this.shield = 0;  //Frigate ship has no shield
		
		this.currentHp = 100;
		this.maxHp = 100;
		this.status = 1; // alive 1, dead 0   => This is what booleans were invented for!
		
		//resources consumed to build ship
		this.steel = 20;
		this.plasma = 20;
		this.antiMatter = 20;
		//turns it takes to build this ship
		this.period = 1; 
	}
	else if(this.type == "Cruiser" ){	
		this.laser = 30;
		this.missile = 40;
		this.armor = 30;
		this.shield = 50;
		
		this.currentHp = 300;
		this.maxHp = 300;		
		this.status = 1; // alive 1, dead 0
		
		this.steel = 40;
		this.plasma = 40;
		this.antiMatter = 40;
		//turns it takes to build this ship
		this.period = 2; 
	}
	else if(this.type == "Capital" ){
		this.laser = 80;
		this.missile = 100;
		this.armor = 80;
		this.shield = 100;
		
		this.currentHp = 700;
		this.maxHp = 700;		
		this.status = 1; // alive 1, dead 0
		
		this.steel = 80;
		this.plasma = 80;
		this.antiMatter = 80;
		//turns it takes to build this ship
		this.period = 3; 
	}
	
}
/*
ship.prototype.moveTo = function(i_pos){
	this.pos = i_pos;
}
*/

ship.prototype.attack = function(target){ //i_target is the target ship, estimate total damage
	var damage = 0;
	if( target.status = 0){ return damage;} //if target ship is already, possible damage is 0
	if( target.shield > 0){ //if target still has shield on, attack shield first
		if ( 1.5*this.laser > this.missile){ damage = 1.5*this.laser; } 
		else { damage = this.missile; }
	}
	else{
		if ( 1.5*this.missile > this.laser){ damage = 1.5*this.missile; } 
		else { damage = this.laser; }
	}
	return damage;
}

//if this ship was attacked
ship.prototype.hpUpdate = function(damage){
	if(this.shield > 0 ){ // shield get attacked first
		this.shield -= damage;
	}
	else{ 
		if(this.currentHp + this.armor > damage) { this.currentHp = this.currentHp - damage + this.armor;} //armor will reflect/absorb part of damage
		else { 
			this.currentHp = 0;
			this.status = 0;
		}
	}
}