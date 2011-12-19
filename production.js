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
	this.amt = i_amt;
	//sample ship for lookup purpose
	var sampleShip = new ship(-1,this.shipType);
	
	this.timer = sampleShip.period;
	//resources consumption
	this.credits = sampleShip.credits;
	this.steel = sampleShip.steel;
	this.plasma = sampleShip.plasma;
	this.antiMatter = sampleShip.antiMatter;
	
	delete sampleShip;
}

function productionPlan(){
	this.plan = [];
	//These numbers are to show on the build buttons.
	this.noScouts = 0;
	this.noFrigates = 0;
	this.noFighters = 0;
	this.noDreadnaughts = 0;
	this.noCruisers = 0;
	this.noCapitals = 0;
}

productionPlan.prototype.addOrder = function(i_owner,i_type,i_amt){ //add items into ship production plan

	var newOrder = new shipOrder(i_owner,i_type,i_amt);
	if (players[i_owner].credits < newOrder.credits*i_amt ||
		players[i_owner].plasma < newOrder.plasma*i_amt || 
		players[i_owner].steel < newOrder.steel*i_amt ||
		players[i_owner].antimatter < newOrder.antiMatter*i_amt)
	{
		//delete newOrder;
		console.log("resources not enough");
		return false;
	}
	
	this.plan.push(newOrder);
	//consume resources
	players[i_owner].credits -= newOrder.credits*newOrder.amt;
	players[i_owner].plasma -= newOrder.plasma*newOrder.amt;
	players[i_owner].steel -= newOrder.steel*newOrder.amt;
	players[i_owner].antimatter -= newOrder.antiMatter*newOrder.amt;
	
	if (newOrder.shipType == "scout"){
		this.noScouts++;	
	}
	else if (newOrder.shipType == "frigate"){
		this.noFrigates++;	
	}
	else if (newOrder.shipType == "fighter"){
		this.noFighters++;	
	}
	else if (newOrder.shipType == "dreadnaught"){
		this.noDreadnaughts++;	
	}
	else if (newOrder.shipType == "cruiser"){
		this.noCruisers++;	
	}
	else if (newOrder.shipType == "capital"){
		this.noCapitals++;	
	}	
	return true;	
}


productionPlan.prototype.release = function(){ //return an array of ships
	var finishedOrders = [];
	if(this.plan.length <= 0)  return finishedOrders;
	for( var i=0; i< this.plan.length; i++){
		this.plan[i].timer -= 1;
		if (this.plan[i].timer == 0) 
		{
			var tmpOrder = this.plan.splice(i,1);
			//console.log("tmporder amt: " + tmpOrder.amt);
			for(var j =0; j< tmpOrder[0].amt; j++){ 
				finishedOrders.push(new ship(tmpOrder[0].owner,tmpOrder[0].shipType));
				console.log("A ship was created. type: " + tmpOrder[0].shipType);
				//These counters are to show it on the buttons.
				if (tmpOrder[0].shipType == "scout"){
					this.noScouts--;	
				}
				else if (tmpOrder[0].shipType == "frigate"){
					this.noFrigates--;	
				}
				else if (tmpOrder[0].shipType == "fighter"){
					this.noFighters--;	
				}
				else if (tmpOrder[0].shipType == "dreadnaught"){
					this.noDreadnaughts--;	
				}
				else if (tmpOrder[0].shipType == "cruiser"){
					this.noCruisers--;	
				}
				else if (tmpOrder[0].shipType == "capital"){
					this.noCapitals--;	
				}
			}
			i = i-1; //index go back a unit
			
		}
	}
	//return list of finished ships
	return finishedOrders;
}

productionPlan.prototype.clear = function(){ //if planet is occupied by enemy, clear everything in production //!!! If you write a method like this, please make sure it gets called too :P.
	for(var i=0; i < this.plan.length; i++)
	{
		var order = this.plan.pop();
		delete order;
	}
}
