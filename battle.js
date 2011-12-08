function battle(Fleet1, Fleet2)
{
	//var winner = [];
	var List1 = Fleet1.getList();
	var List2 = Fleet2.getList();
	
	var k=0;
	
	if (List1.length > 0 && List2.length > 0)
	{
		console.log("List1 owner: "+ List1[0].owner);
		console.log("List2 owner: "+ List2[0].owner);
	
		//For some reason, the program leaves this if loop without having reached the end
		console.log("Battle started");
		//As you return from within this loop, this just goes on until done.
		var battleGoing = true;
		while(battleGoing)
		//while( winner.length <= 0 )
		{	
			console.log("In while loop");
			//var attacker = List1[0];
			//var target = List2[0];
			var attacker;
			var target;
			var tIndex = 0;
			var damage = 0;
			var survivors = 0;
			
			//List1 gets to attack first.
			attackList(List1, List2);
			//If there are no defending surivors
			if (List2.length <= 0){
				console.log("BATTLE FINISHED. k: " + k);				
				return List1;				
			}
			
			//List2 gets to attack second.
			attackList(List2, List1);
			//If there are no attacking survivors
			if (List1.length <= 0){
				console.log("BATTLE FINISHED. k: " + k);				
				return List2;				
			}
			k++;
		}	

	}
	else{
		console.log("Returning empty winner. This is an error.");
		//return winner;	
	}
	console.log("I'm returning nothing and ending. This should not be possible.");
}

// !!! This is not a nice way to do this. But let's see how it works for now.
function selectTarget(i_ship,List){ 
	//console.log("inside selectTarget");
	var j=0;
	var maxDamage = 0;
	var targetIndex;
	for( j=0; j < List.length; j++){
		var target = List[j];
		var damage = i_ship.calculateBaseDamage(target);
		if ( damage > maxDamage){
			targetIndex = j;
			maxDamage = damage;
		}
	}
	return targetIndex;
}

function attackList(AttackerList, DefenderList){
	//List1 are aggressors,they go first
	for(var i=0; i<AttackerList.length; i++){
		attacker = AttackerList[i];
		if(attacker.alive == true){ //if this ship is still alive
			//Find your target
			tIndex = selectTarget(attacker,DefenderList);      // !!! Look at this.
			target = DefenderList[tIndex];
			//Calculate damage
			damage = attacker.attack(target);			// !!! Look at this.
			//target.hpUpdate(damage);   			
		}
	}	
	
	//Remove casualties from array.
	for (var i = DefenderList.length - 1; i > -1; i--){
		if (!DefenderList[i].alive){
			console.log("Someone died!");
			DefenderList.splice(i,1);
		}
	}
}