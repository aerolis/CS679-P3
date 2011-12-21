//Research Planets

function shipProj( i_type ){
	this.type = i_type;
	switch(this.type) {
		case "laser":
			this.credits = 200;
			this.steel = 0;
			this.plasma = 0;
			this.antimatter = 0;
			this.timer = 2;
			//this.credits = 0;
			//this.timer = 1;
			break;
		case "shields":
			this.credits = 300;
			this.steel = 0;
			this.plasma = 50;
			this.antimatter = 0;
			this.timer = 3;
			break;
		case "advMissile":
			this.credits = 400;
			this.steel = 20;
			this.plasma = 30;
			this.antimatter = 0;
			this.timer = 4;
		break;
		case "reactor":
			this.credits = 500;
			this.steel = 50;
			this.plasma = 20;
			this.antimatter = 20;
			this.timer = 5;
		break;
	}

}

function researchPlan(){
	//in order of: scout, frigate, fighter,dreadnaught,cruiser and capital
	this.laser = false;
	this.shields = false;
	this.advMissile = false;
	this.reactor = false;
	this.plan = [];
}

researchPlan.prototype.addProject = function( type, owner ){
	console.log("add new research project, type: " + type);
	switch(type) { //must research one by one
		
		case "laser":
			if(this.laser == true ) return true;
			var newProj = new shipProj(type);
			if (!players[owner].hasResources(newProj.credits,newProj.steel,newProj.plasma,newProj.antimatter) ){
				console.log("credits not enough for laser research ");
				return false;
			}
			else if (this.findProject("laser") > -1)
			{
				console.log("already in production, don't do again");
				return false;
			}
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
			
		case "shields":
			if(this.shields == true ) return true;
			var newProj = new shipProj(type);
			/*if(!this.laser){
				console.log("must have laser before research shields");
				return false;
			}*/
			if (!players[owner].hasResources(newProj.credits,newProj.steel,newProj.plasma,newProj.antimatter) ){
				console.log("credits not enough for shields research");
				return false;
			}
			else if (this.findProject("shield") > -1)
			{
				console.log("already in production, don't do again");
				return false;
			}
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
			
		case "advMissile":
			if(this.capital == true ) return true;
			var newProj = new shipProj(type);
			/*if(!this.shields){ //prerequisite
				console.log("must have shields before research advMissile");
				return false;
			}*/
			if (!players[owner].hasResources(newProj.credits,newProj.steel,newProj.plasma,newProj.antimatter) ){
				console.log("credits not enough for advMissile research");
				return false;
			}
			else if (this.findProject("advMissile") > -1)
			{
				console.log("already in production, don't do again");
				return false;
			}
			
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
		
		case "reactor":
			if(this.reactor == true ) return true;
			var newProj = new shipProj(type);
			if(!this.advMissile){ //prerequisite
				console.log("must have advMissile before research reactor");
				return false;
			}
			else if (this.findProject("reactor") > -1)
			{
				console.log("already in production, don't do again");
				return false;
			}
			if (!players[owner].hasResources(newProj.credits,newProj.steel,newProj.plasma,newProj.antimatter) ){
				console.log("credits not enough for reactor research");
				return false;
			}
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
		
		break;
		
		
	}
	
}

researchPlan.prototype.release = function(){
	if( this.plan.length <= 0 ) return;
	this.plan[0].timer -= 1;
	if(this.plan[0].timer == 0){
		switch(this.plan[0].type) {
		
			case "laser":
				this.laser = true;
				break;
			
			case "shields":
				this.shields = true;
				break;
			
			case "advMissile":
				this.advMissile = true;
				break;
			
			case "reactor":
				this.reactor = true;
				break;
		}
	
	this.plan = [];
	}	
}

researchPlan.prototype.findProject = function(type)
{
	var i;
	for (i=0;i<this.plan.length;i++)
	{
		if (this.plan[i].type == type)
			return i;
	}	
	return -1;
}