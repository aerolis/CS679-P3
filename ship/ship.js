
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
	
	
	switch(this.type) {
		case "scout":
			this.laser = 0;
			this.missile = 5;
			this.armor = 0;
			this.shield = 0;
			
			this.maxShield = 0;
			this.currentHp = 50;
			this.maxHp = 50;

			this.credits = 40;
			this.steel = 0;
			this.plasma = 0;
			this.antiMatter = 0;

			this.period = 1;
			break;
			
		case "frigate":
			//Damage and defense value of this ship
			this.laser = 0;
			this.missile = 10;
			this.armor = 25;
			this.shield = 0;
			//Frigate ship has no shield
			this.maxShield = 0;

			this.currentHp = 100;
			this.maxHp = 100;

			//resources consumed to build ship
			this.credits = 75;
			this.steel = 50;
			this.plasma = 0;
			this.antiMatter = 0;
			//turns it takes to build this ship
			this.period = 1;
			break;
			
		case "fighter":
			this.laser = 25;
			this.missile = 10;
			this.armor = 25;
			this.shield = 0;
			
			this.maxShield = 0;
			this.currentHp = 150;
			this.maxHp = 150;

			this.credits = 100;
			this.steel = 50;
			this.plasma = 0;
			this.antiMatter = 0;

			this.period = 1;
			break;
			
		case "dreadnaught":
			this.laser = 40;
			this.missile = 10;
			this.armor = 25;
			this.shield = 50;
			
			this.maxShield = 50;
			this.currentHp = 150;
			this.maxHp = 150;

			this.credits = 150;
			this.steel = 50;
			this.plasma = 50;
			this.antiMatter = 0;

			this.period = 2;
			break;
			
		case "cruiser":
			this.laser = 5;
			this.missile = 50;
			this.armor = 25;
			this.shield = 50;
			this.maxShield = 50;

			this.currentHp = 200;
			this.maxHp = 200;

			this.credits = 200;
			this.steel = 70;
			this.plasma = 50;
			this.antiMatter = 10;
			//turns it takes to build this ship
			this.period = 2;
			break;
			
		case "capital":
			this.laser = 50;
			this.missile = 50;
			this.armor = 50;
			this.shield = 75;
			this.maxShield = 75;

			this.currentHp = 400;
			this.maxHp = 400;

			this.credits = 400;
			this.steel = 80;
			this.plasma = 60;
			this.antiMatter = 40;
			//turns it takes to build this ship
			this.period = 3;
			break;
	}

	
}
/*
ship.prototype.moveTo = function(i_pos){
	this.pos = i_pos;
}
*/
/*
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
	
	damage -= Math.min(this.armor, .75 * damage);
	target.currentHp -= damage;
	
	/*
	if(damage > target.armor) {
		if (useMissile){
			damage = damage * 1.5;	
		}
		damage -= this.armor;	//Armor negates some damage.
		
	} 
	*/
	//See if you're still alive.
	if (target.currentHp <= 0){
		target.alive = false;	
	}
	//console.log("End hpUpdate; currentHP = " + this.currentHp);	
}