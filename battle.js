function battle(Fleet1, Fleet2)
{
	var winner = [];
	var List1 = Fleet1.getList();
	var List2 = Fleet2.getList();
	/*
	if (List1.length > 0 && List2.length > 0){
		while(winner.length <=0)
		{	
			console.log("In while loop");
			var attacker = List1[0];
			var target = List2[0];
			var tIndex = 0;
			var damage = 0;
			var survivor = 0;
			console.log("Battle starts");
			
			//List1 are aggressors,they go first
			for(var i=0; i<List1.length; i++){
				attacker = List1[i];
				if(attacker.status > 0){ //if this ship is till alive
					tIndex = selectTarget(attacker,List2);
					target = List2[tIndex];
					damage = attacker.attack(target);
					target.hpUpdate(damage);
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
					if(List1[i].status > 0) winner.push(List1[i]);
					
				}
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
						winner.push(List2[i]);
						
					}
					
				}
				console.log("Battle fought.");
				return winner;
			}
		}	
	}*/
	return winner;
	// !!! Somehow split into a Fleet again.	
}

function selectTarget(i_ship,List){ 
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