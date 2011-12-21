Readme

The main clas is Game. 
The game starts in playstate = 0. This is the loading & instructions state. playstate = 1 is the regular game state.

Gameloop() continually happens. What happens, depends on the playstate.
In playstate = 0, a check is made to see if things are loaded yet and draw2dloading() is called.
In playstate = 1 (the normal game) draw2d(), draw3d() and update() are called. This update() basically only does camera related things. Draw2D and draw3D pretty much do what you'd expect.

When the button 'nextTurn' is called the method 'nextTurn()' in the file Game.js is called. This method does all updates that should happen once each turn. It loops over all planets and each planet has it's own onTurn() method - add resources, see if any newly produced ships are ready...
If the new player is ai, nextTurn also calls player.doTurn(). This is where the AI decides what it will do.

io_handler handles all the user input. It handles all mouse clicks and movement. Once again, what it does depends on the playstate.

ship.js holds most things that have to do with ships. These ships are stored in a fleet. Each planet has a 'myFleet' and a 'selectedFleet'. Once ships are selected they move from myFleet to selectedFleet. If another planet is clicked, everything in selectedFleet is send to the target planet. This target planet then executes the method tryReceiveFleet(). 



We also build a levelBuilder. This can be accessed through levelBuilder.html. Sadly, as we kept adding to the game, the levelBuilder kept breaking and in it's current state it only works on some computers.