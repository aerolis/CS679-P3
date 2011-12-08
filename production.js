/*function draftOrdr(i_type,i_amt){
	this.type = i_type;
	this.amt  = i_amt;
}
function draftPlan(){ //for display purpose only,will be cleared at the end of each turn
	this.plan = [];
}

draftPlan.prototype.addOrder = function(i_type,i_amt){
	this.plan.push(new draftOrder(i_type,i_amt));
}

draftPlan.prototype.clear = function(i_type,i_amt){
	for(var i=0; i < this.plan.length; i++)
	{
		var order = this.plan.pop();
		delete order;
	}
}
*/
function shipOrder(i_owner,i_type,i_amt){
	this.owner = i_owner;
	this.shipType = i_type;
	this.amt = 1;
	//sample ship for lookup purpose
	var sampleShip = new ship(-1,this.shipType);
	
	this.timer = sampleShip.period;
	//resources consumption
	this.steel = sampleShip.steel;
	this.plasma = sampleShip.plasma;
	this.antiMatter = sampleShip.antiMatter;
	
	delete sampleShip;
}

function productionPlan(){
	this.plan = [];
}

productionPlan.prototype.addOrder = function(i_owner,i_type,i_amt){ //add items into ship production plan
	console.log("parameter amt: " + i_amt);
	console.log("currentPlayer: " + players[i_owner].id);
	var newOrder = new shipOrder(i_owner,i_type,i_amt);
	console.log("newOrder Plasma: " + newOrder.plasma*newOrder.amt);
	console.log("newOrder steel: " + newOrder.steel*newOrder.amt);
	console.log("newOrder steel: " + newOrder.steel*newOrder.amt);
	console.log("currentPlayer plasma: " + players[i_owner].plasma);
	if (players[i_owner].plasma < newOrder.plasma*i_amt || players[i_owner].steel < newOrder.steel*i_amt ||players[i_owner].antimatter < newOrder.antiMatter*i_amt)
	{
		//delete newOrder;
		console.log("resources not enough");
		return "RESNOTENOUGH";
	}
	
	this.plan.push(newOrder);
	//consume resources
	console.log("consume resources");
	players[i_owner].plasma -= newOrder.plasma*newOrder.amt;
	console.log("currentPlayer plasma: " + players[i_owner].plasma);
	players[i_owner].steel -= newOrder.steel*i_amt;
	players[i_owner].antimatter -= newOrder.antiMatter*i_amt;
	
}


productionPlan.prototype.release = function(){ //return an array of ships
	var finishedOrders = [];
	if(this.plan.length <= 0)  return;
	for( var i=0; i<this.plan.length; i++){
	
		plan[i].timer -= 1;
		if (plan[i].timer == 0) 
		{
			var tmpOrder = plan.splice(i,1);
			for(var j =0; j< tmpOrder.amt; j++){ finishedOrders.push(new ship(this.owner,this.type));}	
		}
	}
	//return list of finished ships
	return finishedOrders;
}

productionPlan.prototype.clear = function(){ //if planet is occupied by enemy, clear everything in production
	for(var i=0; i < this.plan.length; i++)
	{
		var order = this.plan.pop();
		delete order;
	}
}
/*
productionPlan.prototype.logDraft = function(i_draftPlan){ //put draft to production
	for(var i=0; i< i_draftPlan.length; i++){
		var type = draftPlan.plan[i].type;
		var amt = draftPlan.plan[i].amt;
		this.addOrder(type,amt,currTurn); //current turn, to be finished
		//TODO: here deduct player's resources, after lookup table is finished
	}	
}

function sortItem(a,b){
	return a.period - b.period;
}

productionPlan.prototype.sort = function(){ //sort plan by their finish time
	this.plan.sort(sortItem);
}
*/

