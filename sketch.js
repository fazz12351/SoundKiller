

//we crete our global variable. enemies stroes the number of class objects of Enemy
//similary to enemies,players also stores the number of players on the cnavas;
//speed controls the speed movement of the players around the canvas. you can adjust it here to simply make it slower or faster;
//posision is currently an empty global variable which will become an object later on to store the x and y position of the enemies which have been eaten

let enemies = [],
	players = [],
	speed = 1.0,
	EnemyLocationFound = [],
	positions,
	//label sotres the possible letter or word being said into the mic;
	//we have an object
	//global variable called confidence to sotre the value of the  label per frame
	classifier,
	options = {
		probabilityThreshold: 0.7
	},
	label = "",
	confidence = 0.0;



//preload is called before the programme is run  or started to ensure files and paths are ready and loaded before anything is executed.
function preload() {
	// load in classifier - provide options
	classifier = ml5.soundClassifier("SpeechCommands18w", options);
}

function setup() {

	//we create our canvas of 500 pixels in width and 500px in height
	createCanvas(500, 500);

	//we add a single object of the Player class into the array called "players"
	for (var j = 0; j < 1; j++) {
		players.push(new Player);
	}
	//we loop through that array and we call the each object class method called setup in the setip function. as there is only one object,we only call one .setup methoid.
	for (var k = 0; k < players.length; k++) {
		players[k].setup();
	}


	//similarly to above, we push 100 enemies into the enemies array, These object will be stored and drawn on the canvas

	for (var i = 0; i < 100; i++) {
		enemies.push(new Enemy());

	}
	//we also call each enemies elemnts method called setup.
	for (var j = 0; j < enemies.length; j++) {
		enemies[j].setup();
	}


	// start classification, tell ml5.js to call gotResult when we have an idea what this is
	classifier.classify(gotResult);
}

//this function is called whenever a key is pressed
function keyPressed() {
	//wehn the user clicks the up arrow, we change the global variable "label" to the corresing arrow direction
	if (keyCode == UP_ARROW) {
		label = "up"
	}
	//wehn the user clicks the up arrow, we change the global variable "label" to the corresing arrow direction
	if (keyCode == DOWN_ARROW) {
		label = "down"

	}
	//wehn the user clicks the up arrow, we change the global variable "label" to the corresing arrow direction
	if (keyCode == RIGHT_ARROW) {
		label = "right"
	}
	//wehn the user clicks the up arrow, we change the global variable "label" to the corresing arrow direction
	if (keyCode == LEFT_ARROW) {
		label = "left"
	}

}


function draw() {
	//	background(lerpColor(color(255, 0, 0), color(0, 255, 0), confidence));
	background(0);


	// draw label
	fill(255);
	textSize(20);
	textAlign(CENTER);

	text(label, 0, 200, width, 50);
	// identifiedSound.push(label);
	// if(mouseIsPressed){
	//   for(var i=0;i<ident	ifiedSound.length;i++){
	//     if(identifiedSound[i] == ""){
	//       identifiedSound.splice(i,2)
	//     }
	//   }
	//   console.log(identifiedSound);
	// }


	// draw confidence
	textSize(20);
	textAlign(LEFT);
	text(confidence, 10, 470, width - 10, 20);

	//we use the push and pop method to ensure any changes being made ion that frame, do not alter other elements on the canvas. We create our boarded around the canvas with a strokeweifht of 10;
	push();
	fill(255, 0, 0);
	strokeWeight(10);
	stroke(0, 0, 255);
	line(0, 0, 0, height);
	line(0, 0, width, 0);
	line(width, 0, width, height);
	line(0, height, width, height);
	pop();

	//we loop through each elemtns of the players array and we call the run method. this method contains sub methods such as draw , boarder ect which alos are called in the draw function.
	for (var j = 0; j < players.length; j++) {
		players[j].run();
		//when the user has won a game, we set the variable of the players called start to false. we then check if it is false from the code below. if so we execute the winnni g process of our game.
		if (players[j].start == false) {
			for (var t = 0; t < EnemyLocationFound.length; t++) {
				text("Here are the location of enemies found", 0, height / 2 - 40);
				text("x: " + EnemyLocationFound[t].x, EnemyLocationFound[t].x - 50, EnemyLocationFound[t].y + 10);
				text("y: " + EnemyLocationFound[t].y, EnemyLocationFound[t].x - 50, EnemyLocationFound[t].y - 10);
				ellipse(EnemyLocationFound[t].x, EnemyLocationFound[t].y, 10);
			}
		}

	}

	//here we draw run each element of our eneies array and call the run method. similarly to the players behaviour.

	for (var i = 0; i < enemies.length; i++) {
		enemies[i].run();
	}
}



// A function to run when we get any errors and the results
function gotResult(error, results) {
	if (error) {
		// check for error
		return console.log(error);
	}

	// console.log(results);

	// save these values
	label = results[0].label;
	confidence = nf(results[0].confidence, 0, 2); // Round the confidence to 0.01
}


//we create our player class 

function Player() {
	//this is our players setup. these are the methods needed in the setup function. we initialise the bool start to true so the game can run below. we assighnt a vector to 'this.loc' which has randpom x and y coordinate around the canvas.
	//we alos set the diam of the enemies to 50 which will change depending on player interaction. 
	// The warning bool is used to monitor the distance between the player and the wall. when the plyaer is close to the boarders, the bool is true and will behave differently.
	this.setup = function () {
		this.start = true;
		this.loc = createVector(width / 2, height / 2);
		this.diam = 50;
		this.warning = false;
	}
	//this method will be used to call the other sub classes. We call the draw method used to draw the physical elemtns of the player. CheckForEnemies is used to chech the distance between the player and the nemies.CheckForWinnersOrLoosers is used to check if the players has won or lost.
	this.run = function () {
		this.draw();
		this.checkForEnemies();
		this.CheckForWinnerOrLooser();

	}

	//this method is used to draw elemtnes on the canvas. the bool checks if the the bool is true, if so we can draw. if not, we wont see the plaeyers on the canvas.
	this.draw = function () {
		if (this.start == true) {
			//this method uses the voice instructions which alters the value of "label" we change the position of the player first then draw so it can mopve posisions before drawing the actual shape per frame.
			this.voiceInstructions();
			//this is used to check if the players are close towards the wall, if so the player will repel back and damage is caused.
			this.checkBoarder();
			//by default, the player is empty, if the bool called warning is true, we change the fill color to red. the outterline remains white(stroke);
			fill(0);
			if (this.warning == true) {
				background(0);
				fill(255, 0, 0);
			}
			stroke(255);
			ellipse(this.loc.x, this.loc.y, this.diam);


		}

	}


	//this method is used to manage the label variable. as we input new data per frmae, from ml5.js, we take actions of the enemies position based on the input for instance:
	this.voiceInstructions = function () {


		//if the up label is identified, the location on the y axis of the pet will make the pet go up 
		if (label == "up") {
			this.loc.y -= speed
		}

		// down is identified, we increment the y posision

		if (label == "down") {
			this.loc.y += speed
		}
		// left is identified, we decrenment the x posision
		if (label == "left") {
			this.loc.x -= speed
		}
		// right is identified, we increment the x posision
		if (label == "right") {
			this.loc.x += speed
		}




	}
	//this method is used to work out the distance between the current player and all the enemies in the enemy array
	this.checkForEnemies = function () {
		//we check each elemnts of the array of enemies. we create a local variable called distance whcih works out the distance between the single player with all the enems. If the distance is less than 5, we set each of the enemies bool calles 'iseaten' to true and we call the functio is eating which stores the value of the enemies x and y pos as an object. these object are pushed into an array which displays the ellipse towards the end when .start is false
		for (var i = 0; i < enemies.length; i++) {
			let distance = dist(this.loc.x, this.loc.y, enemies[i].loc.x, enemies[i].loc.y);
			if (distance <= 5) {
				enemies[i].iseaten = true;
				enemies[i].eaten();
				this.diam += 5;




			}
		}
	}
	this.checkBoarder = function () {

		let distancefromwall = 8
		//		if (this.loc.y <= distancefromwall || this.loc.y >= height - distancefromwall) {
		//			this.warning = true;
		//		} else if (this.loc.x <= distancefromwall || this.loc.x >= width - distancefromwall) {
		//			this.warning = true;
		//		} else {
		//			this.warning = false;
		//		}

		//we use the players position to check how close they are towards the wall boundaries. If the hit the wall in a certain direction, an opppsite behaviour will accure causing a repell affect.

		//for instance,when hte player hits the left wall, we set the bool warning to true and we changge the diam of the shape. this is the same for the other 3 sides.

		if (this.loc.x <= distancefromwall) {
			label = "right";
			this.warning = true;
			this.diam -= 2.5;
		} else if (this.loc.x >= width - distancefromwall) {
			label = "left";
			this.warning = true;
			this.diam -= 2.5;
		} else if (this.loc.y <= distancefromwall) {
			label = "down";
			this.warning = true;
			this.diam -= 2.5
		} else if (this.loc.y >= height - distancefromwall) {
			label = "up";
			this.warning = true;
			this.diam -= 2.5;
		} else {
			this.warning = false;
		}
	}

	//this methods is used to check if we have winners or loosers. These are based on the diameter of the player. 
	this.CheckForWinnerOrLooser = function () {

		//we loop through the enemies and players array. when the playerd diameter is grater than 90, we set the start bool of each object to false. this start the draw function calling the object draw methid., we also display a simplt text message

		for (var i = 0; i < enemies.length; i++) {
			for (var j = 0; j < players.length; j++) {
				for (var k = 0; k < EnemyLocationFound.length; k++) {
					if (this.diam >= 90) {
						background(0, 255, 0);
						stroke(0)
						text("CONGRATULATIONS", width / 2 - 100, height / 2)
						enemies[i].start = false;
						players[j].start = false;


					}

					//this checks if the diam is less than 0(invisible), if so we stop the game by setting the start bool to false and display a simplt text message.
					if (this.diam <= 0) {
						background(0);
						text("OHH Look Like You	 Lost!", width / 2 - 100, height / 2)
						enemies[i].start = false;
						players[j].start = false;

					}
				}
			}
		}



	}
}


//this is the enemy class.
function Enemy() {
	//similarly to our players object, we also have the same setup,run draw function. these are called in the corresponding global function. 

	this.setup = function () {
		//we set the start bool to true which gives the game heads up on to starting the game;
		this.start = true;
		//we also set tje iseaten bool to false, when a player is within the distance of this enemy, this bool will be set to true from the players "checkforEnemies"method. We set the bool to true which allows the eaten function to be called.
		this.iseaten = false;
		//we store each enemies posision using vectors
		this.loc = createVector(random(width), random(height));

	}
	this.run = function () {
		//this methods is used to call the other sub methods in the draw function.
		this.draw();
		this.eaten();


	}
	this.draw = function () {
		//used to draw the physical element son the screen
		if (this.start == true) {
			stroke(255, 0, 0);
			ellipse(this.loc.x, this.loc.y, 10, 10);
		}

	}
	this.eaten = function (){ //use do diplay the location of enemies which have been eaten
	if (this.iseaten == true) {

		for (var i = 0; i < enemies.length; i++) {
			if (enemies[i].iseaten) {
				positions = {
					x: enemies[i].loc.x,
					y: enemies[i].loc.y
				}
				EnemyLocationFound.push(positions);





				enemies.splice(i, 1)
			}

		}
	}
}

}