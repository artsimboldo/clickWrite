/*
 * WYSIWYM Syntactico-semantic network (language game)
 */

/*
 * Anchor types
 */
var anchorType = {
	terminal :	0,
	mandatory :	1, 
	optional :	2,
	input : 	3
}

/*
 * Gender type
 */
var gender = {
	none : 		0, 
	masculine : 1, 
	feminine : 	2, 
	plural : 	3
}

/*
 * Possible contexts around a substance
 */
 var contextSubst = {
 	none :		1,
 	coref :		2,
 	prepdet :	4
 }

/*
 * Determiner data for French
 * Note: indef and def arrays indexed by genders
 */
var determiner = {
	//			none	masculine	feminine	plural
	indef : [	'',		'un ',		'une ',		'des '],
	def : 	[	'',		'le ',		'la ',		'les '],
	cont :  [   '',		'du ',		'de ',		'des '],
	elision : {
		pattern : 'aeéiouyh', 
		article : ["l'", "d'"]
	}
}

/*
 * Load a JSON game
 */
function loadGame(fname) {
	return utils.readFileHttp(fname, createGame);
}

/*
 * Node superclass prototype
 */

function Node(id, text, type) {
	this.init(id, text, type);
}

Node.prototype = {
	init: function(id, text, type) {
		this.id = id;
		this.text = text;
		this.type = (type == undefined) ? anchorType.terminal : type;
		this.edges = [];
		this.expand = undefined;
		this.data = undefined;
	},
	
	isHead: function() {
		return (this.id == '0') ? true : false;
	},
	
	getID: function() {
		return this.id;	
	},
	
	getText: function() {
		return this.text;	
	},
	
	getType: function() {
		return this.type;	
	},
	
	getOptions: function() {
		return this.edges;	
	},
	
	getExpand: function() {
		return this.expand;	
	},
	
    setData: function(data) {
    	this.data = data;
    },
    
	getData: function() {
		return this.data;	
	}
	
}

/*
 * Noun class prototype
 */
 
function Subst(id, text, gendr, type) {
	this.init(id, text, type);
	this.gender = (gendr == undefined) ? gender.none : gendr;
}

Subst.prototype = new Node;

Subst.prototype.getGender = function() {
		return this.gender;	
}

Subst.prototype.getDeterminer = function(context) {
	var det = '';
	if (context & contextSubst.coref) {
		// definite type
		if (context & contextSubst.prepdet) {
			det = determiner.cont[this.gender];
			if (this.gender == gender.feminine) {
				det = det + determiner.def[this.gender] ;
			}
		}
		else {
			det = determiner.def[this.gender];
		}
		// check for elided determiners.
		if (this.gender == gender.masculine || this.gender == gender.feminine) {
			if (determiner.elision.pattern.indexOf(this.text.substr(0,1)) != -1) {
				det = determiner.elision.article[0];
			}
		}
	}
	else if (context & contextSubst.none) {
		// indefinite type
		det = determiner.indef[this.gender];
		// check for elided prep. determiners.
		if (context & contextSubst.prepdet) {
			det = determiner.elision.article[1] + det;
		}
	}
	return det;
}

// override method to add determiners
Subst.prototype.getText = function(context) {
	return this.getDeterminer(context) + this.text;
}

/*
 * Verb class prototype
 */
 
function Pred(id, text, type) {
	this.init(id, text, type);
}

Pred.prototype = new Node;


/*
 * Preposition class prototype
 */
 
function Prep(id, text, det, type) {
	this.init(id, text, type);
	this.det = (det == undefined ? "" : det);
}

Prep.prototype = new Node;

Prep.prototype.getDet = function() {
		return this.det;	
}

/*
 * Language Game class prototype
 */ 
 
function Game() {
    this.nodes = [];
}

Game.prototype = {
	
	addSubst: function(id, text, gender, type) {
		this.nodes[id] = new Subst(id, text, gender, type);
		return this.nodes[id];
	},
	
	addPred: function(id, text, type) {
		this.nodes[id] = new Pred(id, text, type);
		return this.nodes[id];
	},
	
	addPrep: function(id, text, det, type) {
		this.nodes[id] = new Prep(id, text, det, type);
		return this.nodes[id];
	},
	
	addNode: function(id, text, type) {
		this.nodes[id] = new Node(id, text, type);
		return this.nodes[id];
	},
	
    getNode: function(id) {
    	return this.nodes[id];
    },
    
    addOption: function(source, target) {
        if((this.nodes[source] != undefined) && (this.nodes[target] != undefined)) {
        	this.nodes[source].edges.push(this.nodes[target]);
        }
    },
    
    addExpand: function(source, target) {
        if((this.nodes[source] != undefined) && (this.nodes[target] != undefined)) {
        	this.nodes[source].expand = this.nodes[target];
        }
    },
    
    setData: function(source, data) {
        if(this.nodes[source] != undefined) {
        	this.nodes[source].setData(data);
        }
    },
    
    clearData: function() {
    	for (var key in this.nodes) {
    		this.nodes[key].data = undefined;
    	}
    }
}
