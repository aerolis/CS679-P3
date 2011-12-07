function draftOrdr(i_type,i_amt){
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
function shipOrder(i_type,i_amt,start){
	this.shipType = i_type;
	this.amt = i_amt;
	//look up ship in catalog and consume resources
	//this.period = fleet 
	//this.finish = this.ship.period + start;
}

function productionPlan(){
	this.plan = [];
}

productionPlan.prototype.addOrder = function(i_type,i_num,start){ //add items into ship production plan
	this.plan.push(new shipOrder(i_type,i_num,start));
}

productionPlan.prototype.sort = function(){ //sort plan by their finish time
	this.plan.sort(sortItem);
}

productionPlan.prototype.release = function(){ 
	if(this.plan.length <= 0)  return;
	while( this.plan[0].finish > currTurn){
	
		var newOrder = this.plan.shift();
		//add new orders to fleet's array
		//add ships to fleet here
		delete newOrder;
	}
}

productionPlan.prototype.clear = function(){ //if planet is occupied by enemy, clear everything in production
	for(var i=0; i < this.plan.length; i++)
	{
		var order = this.plan.pop();
		delete order;
	}
}

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

