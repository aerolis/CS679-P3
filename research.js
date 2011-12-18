//Research Planets
//In the beginning players can build scout, frigate, fighter 
//Need to research on cruiser, dreadnaught and capital

function shipProj( i_type ){
	this.type = i_type;
	switch(this.type) {
		case "dreadnaught":
			this.credits = 200;
			this.timer  = 5;
			break;
		case "cruiser":
			this.credits = 300;
			this.timer = 6;
			break;
		case "capital":
			this.credits = 500;
			this.timer = 7;
		break;
	}

}

function researchPlan(){
	//in order of: scout, frigate, fighter,dreadnaught,cruiser and capital
	this.dreadnaught = false;
	this.cruiser = false;
	this.capital = false;
	this.plan = [];
}

researchPlan.prototype.addProject = function( type, owner ){
	//console.log("add new research project, type: " + type);
	switch(type) {
		
		case "dreadnaught":
			if(this.dreadnaught == true ) return true;
			var newProj = new shipProj(type);
			if (players[owner].credits < newProj.credits ){
				console.log("credits not enough for dreadnaught research ");
				return false;
			}
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
			
		case "cruiser":
			if(this.cruiser == true ) return true;
			var newProj = new shipProj(type);
			if (players[owner].credits < newProj.credits ){
				console.log("credits not enough for cruiser research");
				return false;
			}
			//must unlock dreadnaught before unlock cruiser
			if(!this.dreadnaught){
				console.log("must unlock dreadnaught before unlock cruiser");
				return false;
			}
			this.plan.push(newProj);
			players[owner].credits -=  newProj.credits;
			return true;
			break;
			
		case "capital":
			if(this.capital == true ) return true;
			var newProj = new shipProj(type);
			if (players[owner].credits < newProj.credits ){
				console.log("credits not enough for capital research");
				return false;
			}
			if(!this.cruiser){ //prerequisite
				console.log("must unlock cruiser before unlock capitak");
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
		
			case "dreadnaught":
				this.dreadnaught = true;
				break;
			
			case "cruiser":
				this.cruiser = true;
				break;
			
			case "capital":
				this.capital = true;
				break;
			
		}
	
	this.plan = [];
	}
	
}