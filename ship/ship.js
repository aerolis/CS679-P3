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
	//console.log("this new ship's owner is: " + i_owner); 
	this.laser = 0;
	this.missile = 0;
	this.armor = 0;
	this.shield = 0;  //Frigate ship has no shield
	
	this.currentHp = 0;
	this.maxHp = 0;
	this.alive = true;
	
	//resources consumed to build ship
	this.steel = 0;
	this.plasma = 0;
	this.antiMatter = 0;
	//turns it takes to build this ship
	this.period = 1; 
	//this.pos = i_pos;
	//hardcode 3 kinds of ships, dont need shiptype.js anymore
	
	if(this.type == "Frigate" )
	{
		//Damage and defense value of this ship
		this.laser = 10;
		this.missile = 20;
		this.armor = 10;
		this.shield = 0;  //Frigate ship has no shield
		this.maxShield = 0;
		
		this.currentHp = 100;
		this.maxHp = 100;
		
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
		this.maxShield = 50;
		
		this.currentHp = 300;
		this.maxHp = 300;		
		
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
		this.maxShield = 100;
		
		this.currentHp = 700;
		this.maxHp = 700;		
		
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
<<<<<<< HEAD

=======
/*
>>>>>>> d57eb8046ef0199d2a492af9dd8a0276d3755f4f
ship.prototype.attack = function(target){ //target is the target ship, estimate total damage
	//console.log("inside ship.attack");
	var damage = 0;
	
	// !!! You shouldn't be shooting at a dead target anyway, but this is necessary for picking your target for now.
	if(!target.alive){ 
		//console.log("target status is 0");
		return damage;
	} //if target ship is already dead, possible damage is 0
	
	// !!! These numbers and calculations are weird/wrong too, but it should work for now.
	if( target.shield > 0){ //if target still has shield on, attack shield first
		//console.log("target has shield");
		if ( 1.5*this.laser > this.missile){ damage = 1.5*this.laser; } 
		else { damage = this.missile; }
	}
	else{
		//console.log("target does NOT have shield");
		if ( 1.5*this.missile > this.laser){ 
			//console.log("use missile");
			damage = 1.5*this.missile; 
			//console.log("missile: " + this.missile);
			//console.log("damage: " + damage);
			} 
		else {
			//console.log("use laser"); 
			damage = this.laser; 
			//console.log("damage: " + damage);
			}
	}
	//console.log("final damage: " + damage);
	return damage;
}
*/
ship.prototype.calculateBaseDamage = function(target){
	var damage = 0;
	
	//Necessary for picking a target
	if(!target.alive){ 
		//If ship is dead, possible damage = 0
		damage = 0;
	}	
	//Lasers do 1.5 *laser on shield and 1 * laser on health/armor.
	//Missiles do 1 * missile on shield and 1.5 * missile on health/armor.
	
	//If there is any shield left, focus on the shield.
	else if (target.shield > 0){
		//Whichever does more damage on the shield.
		if ( 1.5 * this.laser > this.missile){ 
			damage = 1.5 * this.laser; 
		} 
		else { 
			damage = this.missile; 
		}		
	}
	//If there is no shield, focus on armor/HP:
	else {//Whichever does more damage on the thing itself.
		if ( this.laser > 1.5 * this.missile){ 
			damage = this.laser; 
		} 
		else { 
			damage = 1.5 * this.missile; 
		}		
	}
	
	return damage;
}

//if this ship was attacked
<<<<<<< HEAD
// !!! Take a look at this.
ship.prototype.hpUpdate = function(damage){
	//console.log("Start hpUpdate; currentHP = " + this.currentHp + ", damage = " + damage);
	if(this.shield > 0 ){ // shield gets attacked first
		//If you damage less than the shield, just damage the shield.
		if (damage < this.shield){
			this.shield -= damage;
			damage = 0;
		}
		//Calculate damage left after killing the shield.
		else {
			damage -= this.shield;
			this.shield = 0;
		}
	}
	 
	// armor will negate the damage. 1 armor point =  1 less damage.
	// If you hit more than the available armor.
	if(damage > this.armor) {
		damage -= this.armor;	//Armor negates some damage.
		this.currentHp -= damage;	
	} 
	
	//See if you're still alive.
	if (this.currentHp <= 0){
		this.alive = false;	
=======
ship.prototype.attack = function(target){	
	
	var useLaser = false;
	var useMissile = false;
	
	//Lasers do 1.5 *laser on shield and 1 * laser on health/armor.
	//Missiles do 1 * missile on shield and 1.5 * missile on health/armor.
	
	//If there is any shield left, focus on the shield.
	if (target.shield > 0){
		//Whichever does more damage on the shield.
		if ( 1.5 * this.laser > this.missile){ 
			//Use laser.
			useLaser = true;
		} 
		else { 
			//Use Missile
			useMissile = true;
		}		
	}
	//If there is no shield, focus on armor/HP:
	else{ //Whichever does more damage on the thing itself.
		if ( this.laser > 1.5 * this.missile){ 
			useLaser = true;
		} 
		else { 
			useMissile = true; 
		}		
	}
	
	var damage = 0;
	
	// Add some randomness. (between 0.75 and 1.25 * normalDamage)
	if (useLaser){
		damage = (Math.random()/2 + 0.75) * this.laser; 
	}
	else if(useMissile){
		damage = (Math.random()/2 + 0.75) * this.missile; 
	}
	
	//Now do the actual damage.
	//If there is any shield left, hit that first.
	if(this.shield > 0){
		if (useLaser){
			//If you won't kill the shield
			if (damage * 1.5 < target.shield){
				target.shield -= damage * 1.5;
				damage = 0;
			}
			//Calculate damage left after killing the shield.
			else {
				var onArmor;
				onArmor = damage - (target.shield/1.5);
				damage = onArmor;
				target.shield = 0;			
			}
		}
		if (useMissile){
			//If you won't kill the shield
			if (damage < target.shield){
				target.shield -= damage;
				damage = 0;
			}
			//Calculate damage left after killing the shield.
			else {
				damage -= target.shield;
				target.shield = 0;
			}
		}		
	}
	
	// armor will negate the damage. 1 armor point =  1 less damage.
	// You will only reach the target if you hit more than the available armor.	
	if(damage > target.armor) {
		if (useMissile){
			damage = damage * 1.5;	
		}
		damage -= this.armor;	//Armor negates some damage.
		target.currentHp -= damage;
	} 
	
	//See if you're still alive.
	if (target.currentHp <= 0){
		target.alive = false;	
>>>>>>> d57eb8046ef0199d2a492af9dd8a0276d3755f4f
	}
	//console.log("End hpUpdate; currentHP = " + this.currentHp);	
}