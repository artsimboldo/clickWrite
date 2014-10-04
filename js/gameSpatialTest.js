/*
 * 
 */
function testGame() {
	// graph
	var s = new Game();
	
	// NODES
	// things
	s.addSubst('0', "objet", gender.masculine, anchorType.mandatory);	// head
    s.addSubst('1', "cube rouge", gender.masculine);
    s.addSubst('2', "cube vert", gender.masculine);
    s.addSubst('3', "cube bleu", gender.masculine);
    s.addSubst('4', "cube jaune", gender.masculine);
    s.addSubst('5', "cube orange", gender.masculine);
    
//    s.addSubst('100', "table", gender.feminine);

	// anchors
    s.addNode('900', "quelque part", anchorType.optional);
    s.addNode('901', "quelque chose", anchorType.mandatory);

    // predicates
    s.addPred('1000', "est"); 
    
    // spatial prepositions
    s.addPrep('2000', "a droite", "de ");
    s.setData('2000',[1,0]);
    s.addPrep('2001', "a gauche", "de ");
    s.setData('2001',[-1,0]);
    s.addPrep('2002', "devant");
    s.setData('2002',[0,1]);
    s.addPrep('2003', "derriere");
    s.setData('2003',[0,-1]);
    
	// EDGES
	// expands
	s.addExpand('0', '1000');
    s.addExpand('1000', '900');
    s.addExpand('2000', '901');
    s.addExpand('2001', '901');
    s.addExpand('2002', '901');
    s.addExpand('2003', '901');
    
	// options
    s.addOption('0', '1');
    s.addOption('0', '2');
    s.addOption('0', '3');
    s.addOption('0', '4');
    s.addOption('0', '5');
    s.addOption('0', '100');

    s.addOption('900', '2000');
    s.addOption('900', '2001');
    s.addOption('900', '2002');
    s.addOption('900', '2003');

    s.addOption('901', '1');
    s.addOption('901', '2');
    s.addOption('901', '3');
    s.addOption('901', '4');
    s.addOption('901', '5');
//    s.addOption('901', '100');
    
    return s;
}
