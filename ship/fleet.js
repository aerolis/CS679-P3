function fleet(){

	this.Frigates = [];
	this.FrigatesMoved = [];
	this.Cruisers = [];	
	this.CruisersMoved = [];
	this.Capitals = [];
	this.CapitalsMoved = [];
};

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

//Set all ships as moved. 
fleet.prototype.setMoved = function(){
	this.FrigatesMoved = this.Frigates.concat(this.FrigatesMoved);
	this.CruisersMoved = this.Cruisers.concat(this.CruisersMoved);
	this.CapitalsMoved = this.Capitals.concat(this.CapitalsMoved);
	this.Frigates = [];
	this.Cruisers = [];	
	this.Capitals = [];
}

//Set all ships as not-moved (e.g. upon start of turn)
fleet.prototype.setUnMoved = function(){
	this.Frigates = this.Frigates.concat(this.FrigatesMoved);
	this.Cruisers = this.Cruisers.concat(this.CruisersMoved);
	this.Capitals = this.Capitals.concat(this.CapitalsMoved);
	this.FrigatesMoved = [];
	this.CruisersMoved = [];	
	this.CapitalsMoved = [];
}

//Add a single ship that hasn't moved to the fleet (e.g. upon creation).
fleet.prototype.addNewShip = function(newShip){
	if (newShip.type == "Frigate"){
			this.Frigates.push(newShip);
		}
		else if (newShip.type == "Cruiser"){
			this.Cruisers.push(newShip);
		}
		else if (newShip.type == "Capital"){
			this.Capitals.push(newShip);
		}	
	
}

//Add a single ship that has moved to the fleet.
fleet.prototype.addMovedShip = function(movedShip){
	if (movedShip.type == "Frigate"){
		this.FrigatesMoved.push(movedShip);
	}
	else if (ship.type == "Cruiser"){
		this.CruisersMoved.push(movedShip);
	}
	else if (ship.type == "Capital"){
		this.CapitalsMoved.push(movedShip);
	}
}

//Make a fleet out of a list of ships.
function makeFleetMoved(list){
	var newFleet = new fleet();
		
	var ship;
	for (var i = 0; i < list.length; i++){
		newFleet.addMovedShip(list[i]);
	}	
	return newFleet;
}