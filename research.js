//Research Planets

function shipProj( i_type ){
	this.type = i_type;
	switch(this.type) {
		case "laser":
			this.credits = 200;
			this.timer = 2;
			break;
		case "shields":
			this.credits = 300;
			this.timer = 3;
			break;
		case "advMissile":
			this.credits = 500;
			this.timer = 4;
		break;
		case "reactor":
			this.credits = 500;
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
	//console.log("add new research project, type: " + type);
	switch(type) { //must research one by one
		
		case "laser":
			if(this.laser == true ) return true;
			var newProj = new shipProj(type);
			if (players[owner].credits < newProj.credits ){
				console.log("credits not enough for laser research ");
				return false;
			}
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
			
		case "shields":
			if(this.shields == true ) return true;
			var newProj = new shipProj(type);
			if(!this.laser){
				console.log("must have laser before research shields");
				return false;
			}
			if (players[owner].credits < newProj.credits ){
				console.log("credits not enough for shields research");
				return false;
			}
		
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
			
		case "advMissile":
			if(this.capital == true ) return true;
			var newProj = new shipProj(type);
			if(!this.shields){ //prerequisite
				console.log("must have shields before research advMissile");
				return false;
			}
			if (players[owner].credits < newProj.credits ){
				console.log("credits not enough for advMissile research");
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
			if (players[owner].credits < newProj.credits ){
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