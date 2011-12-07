function fleet(){

	this.Frigates = [];
	this.FrigatesMoved = [];
	this.Cruisers = [];	
	this.CruisersMoved = [];
	this.Capitals = [];
	this.CapitalsMoved = [];
};

/*
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
*/
//For easily combining two fleets
fleet.prototype.addFleet = function(toAdd){
	this.Frigates = this.Frigates.concat(toAdd.Frigates);
	this.Cruisers = this.Cruisers.concat(toAdd.Cruisers);
	this.Capitals = this.Capitals.concat(toAdd.Capitals);
	this.FrigatesMoved = this.FrigatesMoved.concat(toAdd.FrigatesMoved);
	this.CruisersMoved = this.CruisersMoved.concat(toAdd.CruisersMoved);
	this.CapitalsMoved = this.CapitalsMoved.concat(toAdd.CapitalsMoved);
}

fleet.prototype.empty = function(){
	this.Frigates = [];
	this.FrigatesMoved = [];
	this.Cruisers = [];	
	this.CruisersMoved = [];
	this.Capitals = [];
	this.CapitalsMoved = [];
}

// !!! Rewriting needed
fleet.prototype.getTotal = function(){
	var total = this.getList().length;
	return total;
}

//Combine everything into one list.
fleet.prototype.getList = function(){
	var list = [];
	list = list.concat(this.Frigates, this.FrigatesMoved, this.Cruisers, this.CruisersMoved, this.Capitals, this.CapitalsMoved);
	//list = list.concat(this.Frigates, this.Cruisers,  this.Capitals);
	return list;
}

fleet.prototype.setMoved = function(){
	this.FrigatesMoved = this.Frigates.concat(this.FrigatesMoved);
	this.CruisersMoved = this.Cruisers.concat(this.CruisersMoved);
	this.CapitalsMoved = this.Capitals.concat(this.CapitalsMoved);
	this.Frigates = [];
	this.Cruisers = [];	
	this.Capitals = [];
}

fleet.prototype.setUnMoved = function(){
	this.Frigates = this.Frigates.concat(this.FrigatesMoved);
	this.Cruisers = this.Cruisers.concat(this.CruisersMoved);
	this.Capitals = this.Capitals.concat(this.CapitalsMoved);
	this.FrigatesMoved = [];
	this.CruisersMoved = [];	
	this.CapitalsMoved = [];
}

//Make a fleet out of a list of ships.
function makeFleetMoved(list){
	var newFleet = new fleet();
		
	var ship;
	for (var i = 0; i < list.length; i++){
		ship = list[i];
		if (ship.type == "Frigate"){
			fleet.FrigatesMoved.push(ship);
		}
		else if (ship.type == "Cruiser"){
			fleet.CruisersMoved.push(ship);
		}
		else if (ship.type == "Capital"){
			fleet.CapitalsMoved.push(ship);
		}
	}	
	return newFleet;
}