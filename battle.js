function battle(Fleet1, Fleet2)
{
	console.log("Fleet1, Fleet2: " + Fleet1.getTotal() + ", " + Fleet2.getTotal());
	var winner = [];
	var List1 = Fleet1.getList();
	var List2 = Fleet2.getList();
	console.log("List1, List2: " + List1.length + ", " + List2.length);
	//console.log("List1 length: "+List1.length);
	//console.log("List2 length: "+List1.length);
	
	//console.log("List1 owner: "+ List1[0].owner);
	//console.log("List2 owner: "+ List2[0].owner);
	var k=0;
	
	if (List1.length > 0 && List2.length > 0)
	{
		//For some reason, the program leaves this if loop without having reached the end
		console.log("Battle started");
		while( winner.length <= 0 )
		{	
			console.log("In while loop");
			var attacker = List1[0];
			var target = List2[0];
			var tIndex = 0;
			var damage = 0;
			var survivor = 0;
			//console.log("attacker owner:" + attacker.owner);
			//console.log("attacker status:" + attacker.status);
			
			//console.log("target owner:" + target.owner);
			//console.log("target status:" + target.status);
			
			//List1 are aggressors,they go first
			for(var i=0; i<List1.length; i++){
				attacker = List1[i];
				if(attacker.status > 0){ //if this ship is till alive
					//console.log("target index:" + tIndex);
					tIndex = selectTarget(attacker,List2);
					target = List2[tIndex];
					//console.log("target index:" + tIndex);
					damage = attacker.attack(target);
					target.hpUpdate(damage);
					//console.log("target hp:" + target.owner);
					
				}
			}
			//after List1 finished their moves, check if entire List2 was destroyed
			for(var j=0; j<List2.length; j++){
				survivor += List2[j].status; 
			}
			//if List2 was destroyed
			if(survivor == 0){
				//return remaining ships in List1
				for(var i=0; i<List1.length; i++)
				{
					if(List1[i].status > 0){
					List1[i].currentHp = List1[i].maxHp;
					List1[i].shield = List1[i].maxShield;
					winner.push(List1[i]);
					}
				}
				console.log("BATTLE FINISHED. k: " + k);
				return winner;
			}
			
			//List2 make their moves
			for(var i=0; i<List2.length; i++){
				attacker = List2[i];
				if(attacker.status > 0){ //if this ship is till alive
					tIndex = selectTarget(attacker,List1);
					target = List1[tIndex];
					damage = attacker.attack(target);
					target.hpUpdate(damage);
				}
			}
			//after List2 finish their moves, check if entire List1 was destroyed
			for(var j=0; j<List1.length; j++){
				survivor += List1[j].status; 
			}
			//if List1 was destroyed
			if(survivor == 0){
				//return remaining ships in List2
				for(var i=0; i<List2.length; i++)
				{
					if(List2[i].status > 0) 
					{
						List2[i].currentHp = List2[i].maxHp;
						List2[i].shield = List2[i].maxShield;
						winner.push(List2[i]);
						
					}
					
				}
				console.log("BATTLE FINISHED. in : " + k +" rounds");
				return winner;
			}
			k++;
		}	

	}
	else{
		console.log("Returning empty winner.");
		return winner;	
	}
	console.log("I'm returning nothing and ending. This should not be possible.");
}

function selectTarget(i_ship,List){ 
	//console.log("inside selectTarget");
	var j=0;
	var maxDamage = 0;
	var targetIndex;
	for( j=0; j < List.length; j++){
		var target = List[j];
		var damage = i_ship.attack(target);
		if ( damage > maxDamage){
			targetIndex = j;
		}
	}
	return targetIndex;
}