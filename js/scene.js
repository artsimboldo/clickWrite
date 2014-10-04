/*
 * WYSIWYM Story / Beat manager (controller)
 */
// namespace
var scene = {};

scene.colorBlack = [0.3, 0.3, 0.3];
scene.colorWhite = [0.9, 0.9, 0.9];
scene.colorRed = [0.9, 0.3, 0.3];
scene.colorGreen = [0.3, 0.9, 0.3];
scene.colorBlue = [0.3, 0.3, 0.9];
scene.colorDarkBlue = [0.1, 0.1, 0.5];
scene.colorBrown = [0.6, 0.3, 0.2];
scene.colorYellow = [0.9, 0.9, 0.3];
scene.colorOrange = [0.9, 0.45, 0.3];

/*
 * init story, 1st beat with menus
 */
function createScene(game) {
	scene.game = game;
	scene.actions = [];
	scene.line = 0;
	scene.mentalModelSize = 10;
	scene.mentalModel = createMentalModel(scene.mentalModelSize);

	// create initial scene 3d	
	initScene3d();

	// create objects	
	scene.objects = [];
	scene.objects[0] = new Cube("cube rouge", scene.colorRed);
	scene.objects[1] = new Cube("cube vert", scene.colorGreen);
	scene.objects[2] = new Cube("cube bleu", scene.colorBlue);
	scene.objects[3] = new Cube("cube jaune", scene.colorYellow);
	scene.objects[4] = new Cube("cube orange", scene.colorOrange);
	scene.objects[5] = new Table("table", scene.colorBrown);

	// create initial assertion
	scene.actions[0] = {id: 'action1', stemma: [], undo: [], data: [], valid: true};
	scene.actions[1] = {id: 'action2', stemma: [], undo: [], data: [], valid: true};
	scene.actions[2] = {id: 'action3', stemma: [], undo: [], data: [], valid: true};
	scene.actions[3] = {id: 'action4', stemma: [], undo: [], data: [], valid: true};
	scene.actions[4] = {id: 'action5', stemma: [], undo: [], data: [], valid: true};
	scene.actions[5] = {id: 'action6', stemma: [], undo: [], data: [], valid: true};
	
	// create initial  menu
	createMenu(scene.game, scene.actions);
}

/*
 * 
 */
function createMentalModel(size) {
	var mm = new Array(size);
	for (var i=0; i<size; i++) {
		mm[i] = new Array(size);
	}
	return mm;
}

/*
 * 
 */
function getPos(X) {
	for (var i=0; i<scene.mentalModelSize; i++) {
		for (var j=0; j<scene.mentalModelSize; j++) {
			if (scene.mentalModel[i][j] == X) {
				return [i,j];
			}
		}
	}
	return undefined;
}

/*
 * 
 */
function getRandomPos() {
	var i = scene.mentalModelSize * 0.5;
	var j = scene.mentalModelSize * 0.5;
	var range = scene.mentalModelSize - 2;
	while(scene.mentalModel[i-1][j-1] != undefined || scene.mentalModel[i-1][j] != undefined || scene.mentalModel[i-1][j+1] != undefined ||
		scene.mentalModel[i][j-1] != undefined || scene.mentalModel[i][j] != undefined || scene.mentalModel[i][j+1] != undefined ||
		scene.mentalModel[i+1][j-1] != undefined || scene.mentalModel[i+1][j] != undefined || scene.mentalModel[i+1][j+1] != undefined)
	{
		i = 1 + Math.floor(Math.random() * range);
		j = 1 + Math.floor(Math.random() * range);
	};
	return [i,j] ;
}

/*
 * 
 */
function isFree(I,J) {
	return (scene.mentalModel[I][J] === undefined);
}

/*
 *
 */
 function direction(u) {
 	var v = [(u[0] != 0 ? u[0] / Math.abs(u[0]) : 0), (u[1] != 0 ? u[1] / Math.abs(u[1]) : 0)];
 	return v;
 }
 
/*
 * 
 */
function normalize(u) {
	var v = u.slice();
	var norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
	v[0] = v[0] / norm;
	v[1] = v[1] / norm;
	return v;
}
 
/*
 * Compare two directions u and v.
 * Return:
 * 	-1: u and v are in the opposite direction
 * 	 0: u and v are orthogonal
 * 	+1: u and v are in the same direction

function compare(u,v) {
	var u1 = normalize(u);
	var v1 = normalize(v);
	var dot = u1[0] * v1[0] + u1[1] * v1[1];
	if (dot > 0) {
		console.log("dot = 1 (" + dot + ")");
		return 1;
	}
	else if (dot < 0) {
		console.log("dot = -1 (" + dot + ")");
		return -1;
	}
	console.log("dot = 0");
	return 0;
}
*/

/*
 * 
 */
function isContrary(u,v) {
	var u1 = normalize(u);
	var v1 = normalize(v);
	var dot = u1[0] * v1[0] + u1[1] * v1[1];
	//console.log("dot = " + dot);
	return (dot < 0? true : false);
}

/*
 * 
 */
function isDirection(u,v) {
	var u1 = normalize(u);
	var v1 = normalize(v);
	var dot = u1[0] * v1[0] + u1[1] * v1[1];
	console.log("dot = " + dot);
	return (dot > 0? true : false);
//	return (Math.abs(dot) > 0? true : false);
}

/*
 * 
 */
function isOrthogonal(u,v) {
	var u1 = normalize(u);
	var v1 = normalize(v);
	var dot = u1[0] * v1[0] + u1[1] * v1[1];
	console.log("dot = " + dot);
//	return (dot == 0? true : false);
	return (Math.abs(dot) != 1? true : false);
}


/*
 * 
 */
function verify(posX, posY, R) {
	var dir = direction([posY[0] - posX[0], posY[1] - posX[1]]);
	if (dir[0] == R[0] && dir[1] == R[1]) {
		return true;
	}
	return false;
}

/*
 * 
 */
function remake(X, Y, dir, assertions) {
	console.log("** REMAKE(X = " + X + ", Y = " + Y + ", dir = " + dir + ")");
	var posX = getPos(X);
	var posY = getPos(Y);
	var newX = posX[0] + dir[0];
	var newY = posX[1] + dir[1];

	if (assertions) {
		// Rule 1: if there is a premise relating X and Y that is contrary to X's required move
		// then return the value false, and exit.
		for (var pos in assertions) {
			var assert = assertions[pos];
			var R = (assert[0] == X && assert[1] == Y) ? utils.mulArray(assert[2], -1) : ((assert[0] == Y && assert[1] == X) ? assert[2] : undefined) ;
			if (R) {
				console.log("rule 1 (contrary) with R = " + R);
				if (isContrary(dir,R)) {
					console.log("REMAKE EXITS with false due to rule 1.");
					return false;
				}
			}
		}

		for (var pos in assertions) {
			var assert = assertions[pos];
			var Z = assert[0] == X ? assert[1] : (assert[1] == X ? assert[0] : undefined) ;
			if (Z) {
				var R = assert[1] == X ? utils.mulArray(assert[2], -1) : assert[2];
				
				// Rule 2: if there is a premise relating X to an item in the direction in which X has to move then:
				// 	if this item occupies the location to which X is supposed to move then:
				//	if REMAKE cannot relocate the item then return the value false, and exit.
				if (isDirection(dir, R)) {
					console.log("Rule 2 (direction) with Z = " + Z + " and R = " + R);
					var posZ = getPos(Z);
					if (posZ[0] == newX && posZ[1] == newY) {
						// check for cycles (Z != Y)
						// normalize dir to not throw away Z
						var shiftdir = direction(dir);
						if (Z != Y && remake(Z, X, shiftdir, assertions) == false) {
							console.log("REMAKE EXITS with false due to rule 2.");
							return false;
						}
					}
				}
				// Rule 3: if there is a premise relating X to an item orthogonal to the direction in which X has to move then:
				// 	if REMAKE cannot relocate this item to maintain its relative position to X then return the value false, and exit.
				else if (isOrthogonal(dir, R)) {
					console.log("Rule 3 (orthogonal) with Z = " + Z + " and R = " + R);
					// check for cycles (Z != Y)
					// use dir to keep Z relative to X's position
					if (Z != Y && remake(Z, X, dir, assertions) == false) {
						console.log("REMAKE EXITS with false due to rule 3.");
						return false;
					}
				}
				else {
					if ( Z != Y ) {
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					console.log("!! X = " + X);
					console.log("!! Y = " + Y);
					console.log("!! Z = " + Z + " and R = " + R);
					var u1 = normalize(dir);
					var v1 = normalize(R);
					var dot = u1[0] * v1[0] + u1[1] * v1[1];
					console.log("!! dot = " + dot);
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					// check for cycles (Z != Y)
					// use dir to keep Z relative to X's position
//					if (Z != Y && remake(Z, Z, dir, assertions) == false) {
//						console.log("REMAKE EXITS with false due to rule 3.");
//						return false;
//					}
					}
				}
			}
		}

		/*
		for (var pos in assertions) {
			var assert = assertions[pos];
			var Z = assert[0] == X ? assert[1] : (assert[1] == X ? assert[0] : undefined) ;
			if (Z) {
				var R = assert[1] == X ? utils.mulArray(assert[2], -1) : assert[2];

				// remove assertion to avoid cycles
				var newAssertions = assertions.slice();
				var a = newAssertions.splice(pos,1);
				console.log("assertion {" + a + "} removed");
				
				// Rule 2: if there is a premise relating X to an item in the direction in which X has to move then:
				// 	if this item occupies the location to which X is supposed to move then:
				//	if REMAKE cannot relocate the item then return the value false, and exit.
				if (isDirection(dir, R)) {
					console.log("considering rule 2 (direction) with Z = " + Z + " and R = " + R);
					var posZ = getPos(Z);
					if (posZ[0] == newX && posZ[1] == newY) {
						// normalize dir to not throw away Z
						var shiftdir = direction([newX - posX[0], newY - posX[1]]);
//						if (Z != Y && remake(Z, X, shiftdir, assertions) == false) {
						if (Z != Y && remake(Z, X, shiftdir, newAssertions) == false) {
							console.log("REMAKE EXITS with false due to rule 2.");
							return false;
						}
					}
				}
				// Rule 3: if there is a premise relating X to an item orthogonal to the direction in which X has to move then:
				// 	if REMAKE cannot relocate this item to maintain its relative position to X then return the value false, and exit.
				else if (isOrthogonal(dir, R)) {
					console.log("considering rule 3 (orthogonal) with Z = " + Z + " and R = " + R);
					// check for cycles (Z != Y)
					// use dir to keep Z relative to X's position
//					if (Z != Y && remake(Z, X, dir, assertions) == false) {
					if (Z != Y && remake(Z, X, dir, newAssertions) == false) {
						console.log("REMAKE EXITS with false due to rule 3.");
						return false;
					}
				}
				else if (isDirection(dir, R) == false) {
					console.log("considering rule 2 (but with opposite directions) with Z = " + Z + " and R = " + R);
					// check for cycles (Z != Y)
					// use dir to keep Z relative to X's position
//					if (Z != Y && remake(Z, Z, dir, assertions) == false) {
					if (Z != Y && remake(Z, X, dir, newAssertions) == false) {
						console.log("REMAKE EXITS with false due to rule 3.");
						return false;
					}
				}
			}
		}
		*/
	}
	
	// Rule 4: if there is an item Z in the array at the position to which X is to be shifted then:
	var Z = scene.mentalModel[newX][newY];
	if (Z) {
		console.log("rule 4:");
		// 	if REMAKE cannot shift this item out of the way then return the value false, and exit.
		var shiftdir = [newX - posY[0], newY - posY[1]];
		console.log("shiftdir = " + shiftdir);
		if (remake(Z, Y, shiftdir, assertions) == false) {
			console.log("REMAKE EXITS with false due to rule 4.");
			return false;
		}
	}
	
	// 5. Shift X to its required location, return the value true, and exit.
	cleanScene3d(X);
	scene.mentalModel[newX][newY] = X;
	place3d(X, newX, newY);
	console.log("REMAKE PUTS " + X + " at (" + newX + ", " + newY + ").");
	return true;
}

 /*
function remake(X, Y, dir, assertions) {
	console.log("REMAKE(X = " + X + ", Y = " + Y + ", dir = " + dir + ")");
	var posX = getPos(X);
	var posY = getPos(Y);
	var newX = posX[0] + dir[0];
	var newY = posX[1] + dir[1];

	if (assertions) {
		// Rule 1: if there is a premise relating X and Y that is contrary to X's required move
		// then return the value false, and exit.
		for (var pos in assertions) {
			var assert = assertions[pos];
			var R = (assert[0] == X && assert[1] == Y) ? utils.mulArray(assert[2], -1) : ((assert[0] == Y && assert[1] == X) ? assert[2] : undefined) ;
			if (R) {
				console.log("rule 1 (contrary):");
				if (isContrary(dir,R)) {
					console.log("REMAKE EXITS with false due to rule 1.");
					return false;
				}
			}
		}

		// Rule 2: if there is a premise relating X to an item in the direction in which X has to move then:
		// 	if this item occupies the location to which X is supposed to move then:
		//	if REMAKE cannot relocate the item then return the value false, and exit.
		for (var pos in assertions) {
			var assert = assertions[pos];
			var Z = assert[0] == X ? assert[1] : (assert[1] == X ? assert[0] : undefined) ;
			if (Z) {
				var R = assert[1] == X ? utils.mulArray(assert[2], -1) : assert[2];
				console.log("rule 2 found Z = " + Z + " and R = " + R);
				if (isDirection(dir, R)) {
					console.log("rule 2 (direction) with Z = " + Z + " and R = " + R);
					var posZ = getPos(Z);
					if (posZ[0] == newX && posZ[1] == newY) {
						// normalize dir to not throw away Z
						var shiftdir = direction([newX - posX[0], newY - posX[1]]);
						if (remake(Z, Y, shiftdir, assertions) == false) {
							console.log("REMAKE EXITS with false due to rule 2.");
							return false;
						}
					}
				}
			}
		}
		
		// Rule 3: if there is a premise relating X to an item orthogonal to the direction in which X has to move then:
		// 	if REMAKE cannot relocate this item to maintain its relative position to X then return the value false, and exit.
		for (var pos in assertions) {
			var assert = assertions[pos];
			var Z = assert[0] == X ? assert[1] : (assert[1] == X ? assert[0] : undefined) ;
			if (Z) {
				var R = assert[1] == X ? utils.mulArray(assert[2], -1) : assert[2];
				console.log("rule 3 found Z = " + Z + " and R = " + R);
				if (isOrthogonal(dir, R)) {
					console.log("rule 3 (orthogonal) with Z = " + Z + " and R = " + R);
					// remove assertion to avoid cycles
					var newAssertions = assertions.slice();
					var a = newAssertions.splice(pos,1);
					console.log("assertion {" + a + "} removed");
					// use dir to keep Z relative to X's position
					if (remake(Z, Y, dir, newAssertions) == false) {
//					// check Z is not actually Y to avoid infinite cycles
//					if (Z != Y && remake(Z, X, dir, assertions) == false) {
						console.log("REMAKE EXITS with false due to rule 3.");
						return false;
					}
				}
//				else if (isDirection(dir, R) ==  false) {
//					console.log("isDirection is FALSE!!!!!!!!!!!!!!!!!");
//					if (remake(Z, Y, dir, newAssertions) == false) {
//						console.log("REMAKE EXITS with false due to rule 3.");
//						return false;
//					}							
//				}
			}
		}
	}
	
	// Rule 4: if there is an item Z in the array at the position to which X is to be shifted then:
	var Z = scene.mentalModel[newX][newY];
	if (Z) {
		console.log("rule 4:");
		// 	if REMAKE cannot shift this item out of the way then return the value false, and exit.
		var shiftdir = [newX - posY[0], newY - posY[1]];
		console.log("shiftdir = " + shiftdir);
		if (remake(Z, Y, shiftdir, assertions) == false) {
			console.log("REMAKE EXITS with false due to rule 4.");
			return false;
		}
	}
	
	// Rule 5: if X is Y, don't move Y, return the value false, and exit.
	if (X == Y) {
		console.log("REMAKE EXITS with false due to rule 5.");
		return false;
	}
	
	// 5. Shift X to its required location, return the value true, and exit.
	cleanScene3d(X);
	scene.mentalModel[newX][newY] = X;
	place3d(X, newX, newY);
	console.log("REMAKE PUTS " + X + " at (" + newX + ", " + newY + ").");
	return true;
}
*/

/*
 * 
 */
function place(X, Y, R, assertions) {
	// 1. X and Y referenced (implies R as been defined due to input system)
	if (X && Y) {
		var posX = getPos(X);
		var posY = getPos(Y);
		// 1.1 X exists but not Y
		if (posX && posY == undefined) {
			put(Y, posX, R[0], R[1]);
			console.log("PUT " + Y + " next to " + X + " (" + R + ").");
			return true;
		}
		// 1.2 Y exists but not X
		else if (posY && posX == undefined) {
			put(X, posY, -R[0], -R[1]);
			console.log("PUT " + X + " next to " + Y + " (-1)(" + R + ").");
			return true;
		}
		// X and Y can't NOT exist at the same time due to a proper cleanScene3d 
		// 1.3 Finally X and Y exist
		else {
			// Verify assertion is not true
			if (verify(posX, posY, R) == false) {
				var dir = [];
				dir[0] = posX[0] + R[0] - posY[0];
				dir[1] = posX[1] + R[1] - posY[1];
				console.log("---------------------------------------------------------------------");
				console.log("ASSERTION [" + X + "," + Y + "," + R + "] is false.");
				return remake(Y, X, dir, assertions);
			}
			console.log("ASSERTION [" + X + "," + Y + "," + R + "] is already true.");
			return true;
		}
	}
	// 2. Only X is referenced (so no Y has been found)
	else if (X) {
		var posX = getPos(X);
		if (posX == undefined) {
			put(X, getRandomPos(), 0, 0);
			console.log("PLACE " + X + ".");
		}
		return true;
	}
	return false;
}

/*
 * 
 */
function put(X, pos, DI, DJ) {
	var I = pos[0];
	var J = pos[1];
	do {
		I += DI;
		J += DJ;
	}
	while(isFree(I,J) == false);
	scene.mentalModel[I][J] = X;
	place3d(X, I, J);
}

/*
 * 
 */
function place3d(id, I, J) {
	var obj = findObject(id);
	if (obj) {	
		var offset = scene.mentalModelSize *.5;		
		X = -3 * (I - offset);
		Y = -3 * (J - offset);
		addToScene3d(obj, {x:X, y:0.0, z:Y});
	}
}

/*
 * 
 */
function cleanScene3d(id) {
	if (scene.mentalModel != undefined) {
		for (var i=0; i<scene.mentalModelSize; i++) {
			for (var j=0; j<scene.mentalModelSize; j++) {
				if (scene.mentalModel[i][j] == id) {
					var obj = findObject(id);
					// if object exists
					if (obj) {
						// remove object and update mental model
						console.log("REMOVE " + id + ".");
						removeFromScene3d(id);
						scene.mentalModel[i][j] = undefined;
						return;
					}
				}
			}
		}
	}
}

/*
 * 
 */
function buildScene3d() {
	// Place objects
	var assertions = [];				// record assertions done
	for (var key in scene.actions) {
		var rf = [];					// referent objects found
		var sr = undefined;				// spatial relation found
		// copy and revert stemma to get referent object first
		var stemma = scene.actions[key].stemma.slice().reverse();
		for (var pos in stemma) {
			var node = stemma[pos];
			// things
			if (node instanceof Subst && findObject(node.getText()) != undefined) {
				rf.push(node.getText());
			}
			// spatial preposition
			else if (node instanceof Prep) {
				sr = node.getData();
			}
		}
		if (rf.length > 0) {
			var result = place(rf[0], rf[1], sr, assertions);
			if (result) {
				// if an assertion is valid, record it
				assertions.push([rf[0], rf[1], sr]);
//				console.log(assertions);
			}
			scene.actions[key].valid = result;
		}
	}
	renderScene3d();
}

/*
 * 
 */
function findObject(id) {
	for (var key in scene.objects) {
		var object = scene.objects[key];
		if (id.indexOf(object.getTag()) != -1) {
			return object;
		}
	}
	return undefined;
}