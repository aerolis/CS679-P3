function fleet(){

	this.Scouts = [];
	this.ScoutsMoved = [];
	this.Frigates = [];
	this.FrigatesMoved = [];
	this.Fighters = [];
	this.FightersMoved = [];
	this.Dreadnaughts = [];
	this.DreadnaughtsMoved = [];
	this.Cruisers = [];	
	this.CruisersMoved = [];
	this.Capitals = [];
	this.CapitalsMoved = [];
};

//For easily combining two fleets
fleet.prototype.addFleet = function(toAdd){
	this.Scouts = this.Scouts.concat(toAdd.Scouts);
	this.Frigates = this.Frigates.concat(toAdd.Frigates);
	this.Fighters = this.Fighters.concat(toAdd.Fighters);
	this.Dreadnaughts = this.Dreadnaughts.concat(toAdd.Dreadnaughts);
	this.Cruisers = this.Cruisers.concat(toAdd.Cruisers);
	this.Capitals = this.Capitals.concat(toAdd.Capitals);
	
	this.ScoutsMoved = this.ScoutsMoved.concat(toAdd.ScoutsMoved);	
	this.FrigatesMoved = this.FrigatesMoved.concat(toAdd.FrigatesMoved);
	this.FightersMoved = this.FightersMoved.concat(toAdd.FightersMoved);
	this.Dreadnaughts = this.DreadnaughtsMoved.concat(toAdd.DreadnaughtsMoved);
	this.CruisersMoved = this.CruisersMoved.concat(toAdd.CruisersMoved);
	this.CapitalsMoved = this.CapitalsMoved.concat(toAdd.CapitalsMoved);
	
}

fleet.prototype.empty = function(){
	
	this.Scouts = [];
	this.ScoutsMoved = [];
	this.Frigates = [];
	this.FrigatesMoved = [];
	this.Fighters = [];
	this.FightersMoved = [];
	this.Dreadnaughts = [];
	this.DreadnaughtsMoved = [];
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

fleet.prototype.getWeightedMovableLength = function(){
	var total = this.Scouts.length * 0.5 + this.Frigates.length + this.Fighters.length + this.Dreadnaughts.length * 2 + this.Capitals.length*2 + this.Cruisers.length*4;	 
	return total;
}

//Combine everything into one list.
fleet.prototype.getList = function(){
	var list = [];
	list = list.concat(this.Scouts, this.ScoutsMoved, this.Frigates, this.FrigatesMoved, this.Fighters, this.FightersMoved, this.Dreadnaughts, this.DreadnaughtsMoved, this.Cruisers, this.CruisersMoved, this.Capitals, this.CapitalsMoved);
	//list = list.concat(this.Frigates, this.Cruisers,  this.Capitals);
	return list;
}

//Set all ships as moved. 
fleet.prototype.setMoved = function(){
	this.ScoutsMoved = this.Scouts.concat(this.ScoutsMoved);
	this.FrigatesMoved = this.Frigates.concat(this.FrigatesMoved);
	this.FightersMoved = this.Fighters.concat(this.FightersMoved);
	this.DreadnaughtsMoved = this.Dreadnaughts.concat(this.DreadnaughtsMoved);
	this.CruisersMoved = this.Cruisers.concat(this.CruisersMoved);
	this.CapitalsMoved = this.Capitals.concat(this.CapitalsMoved);
	
	this.Scouts = [];
	this.Frigates = [];
	this.Fighters = [];
	this.Dreadnaughts = [];
	this.Cruisers = [];	
	this.Capitals = [];
}

//Set all ships as not-moved (e.g. upon start of turn)
fleet.prototype.setUnMoved = function(){
	this.Scouts = this.Scouts.concat(this.ScoutsMoved);
	this.Frigates = this.Frigates.concat(this.FrigatesMoved);
	this.Fighters = this.Fighters.concat(this.FightersMoved);
	this.Dreadnaughts = this.Dreadnaughts.concat(this.DreadnaughtsMoved);
	this.Cruisers = this.Cruisers.concat(this.CruisersMoved);
	this.Capitals = this.Capitals.concat(this.CapitalsMoved);
	
	this.ScoutsMoved = [];
	this.FrigatesMoved = [];
	this.FightersMoved = [];
	this.DreadnaughtsMoved = [];
	this.CruisersMoved = [];	
	this.CapitalsMoved = [];
}

//Add a single ship that hasn't moved to the fleet (e.g. upon creation).
fleet.prototype.addNewShip = function(newShip){
		if (newShip.type == "scout"){
			this.Scouts.push(newShip);
		}
		else if (newShip.type == "frigate"){
			this.Frigates.push(newShip);
		}
		else if (newShip.type == "fighter"){
			this.Fighters.push(newShip);
		}
		else if (newShip.type == "dreadnaught"){
			this.Dreadnaughts.push(newShip);
		}
		else if (newShip.type == "cruiser"){
			this.Cruisers.push(newShip);
		}
		else if (newShip.type == "capital"){
			this.Capitals.push(newShip);
		}	
	
}

//Add a single ship that has moved to the fleet.
fleet.prototype.addMovedShip = function(movedShip){
	
	if (movedShip.type == "scout"){
		this.ScoutsMoved.push(movedShip);
	}
	else if (movedShip.type == "frigate"){
		this.FrigatesMoved.push(movedShip);
	}
	else if (movedShip.type == "fighter"){
		this.FightersMoved.push(movedShip);
	}
	else if (movedShip.type == "dreadnaught"){
		this.DreadNaughtsMoved.push(movedShip);
	}
	else if (movedShip.type == "cruiser"){
		this.CruisersMoved.push(movedShip);
	}
	else if (movedShip.type == "capital"){
		this.CapitalsMoved.push(movedShip);
	}
}

fleet.prototype.clone = function(){
	var newFleet = new fleet();
	var thisList = this.getList();
	for (var i = 0; i < thisList.length; i++){
		newFleet.addNewShip(new ship(thisList[i].player, thisList[i].type));	
	}
	return newFleet;
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

//Make a fleet out of a list of ships.
function makeFleetNotMoved(list){
	var newFleet = new fleet();
		
	var ship;
	for (var i = 0; i < list.length; i++){
		newFleet.addNewShip(list[i]);
	}	
	return newFleet;
}
