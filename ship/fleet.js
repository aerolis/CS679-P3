function fleet(){

	this.amtFrigate = 0;
	this.amtCruiser = 0;	
	this.amtCapital = 0;
};

//This can be a negative amount too ofcourse, so no decrease methods are needed.
fleet.prototype.addFrigates = function(amt){
	this.amtFrigate += amt;
}

fleet.prototype.addCruisers = function(amt){
	this.amtCruiser += amt;
}

fleet.prototype.addCapitals = function(amt){
	this.amtCapital += amt;
}

//For easily combining two fleets
fleet.prototype.addFleet = function(toAdd){
	this.amtFrigate += toAdd.amtFrigate;
	this.amtCruiser += toAdd.amtCruiser;
	this.amtCapital += toAdd.amtCapital;
}

fleet.prototype.empty = function(){
	this.amtFrigate = 0;
	this.amtCruiser = 0;	
	this.amtCapital = 0;
}

fleet.prototype.getTotal = function(){
	var total = this.amtFrigate + this.amtCruiser + this.amtCapital;
	return total;
}