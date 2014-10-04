/*
 * WYSIWYM Menus (view)
 */

// namespace
var menu = {
};

menu.colorRed = 'color:rgb(200,50,50)';
menu.colorGreen = 'color:rgb(50,200,50)';
menu.colorBlue = 'color:rgb(50,50,200)';
menu.timeout = 500;
menu.closetimer = 0;
menu.ddmenuitem = 0;
menu.undoText = "(choix précédent)"

// close layer when click-out
document.onclick = mclose; 

/*
 * createMenu()
 */
//function createMenu(id, game, stemma, undo, sceneBuilder) {
function createMenu(game, actions) {
	menu.game = game;
	menu.actions = actions;
	for (var pos in actions){
		var action = actions[pos];
		setMenu(action, game.getNode('0'), 0);
		renderMenu(action);
	}
}

/*
 * setMenu()
 */
function setMenu(action, node, pos) {
	// undo is an associative array with: key = new text, value = previous node.
	action.undo[node.getText()] = action.stemma[pos];

	// set new node in stemma slot	
	action.stemma[pos] = node;
	
	// check if transitive
	while(node.getExpand() != undefined)
	{
		// check if transitive
		node = node.getExpand();
		action.stemma.push(node);
		node.setData(undefined);
	}
}

/*
 * 
 */
function renderAllMenus() {
	for (var pos in menu.actions){
		renderMenu(menu.actions[pos]);
	}
}


/*
 * renderMenu()
 * HTML template:
 * 
 * ACTIONS:
 * <li><a href="#" style="color:rgb(R,G,B)" onmouseover="mopen('ID')" onmouseout="mclosetime()">Menu</a> 
 * 	<div id="ID" onmouseover="mcancelclosetime()" onmouseout="mclosetime()"> 
 * 		<a href="mSelect(undo, pos)">undo</a> 
 * 		<a href="mSelect(id, pos)">submenu 1</a> 
 * 		...
 * 		<a href="mSelect(id, pos)">submenu N</a> 
 * 	</div> 
 * </li> 
 * 
 * DIALOGS:
 * <li><input type="text" id="textbox" onblur="mupdateInput(id, nodeid)" placeholder=" (entrez votre dialogue)" /></li>
 */
function renderMenu(action) {
	// Build "action" element
	var obj = document.getElementById(action.id);
		
	// first clear childs 
	utils.removeChildrenFromNode(obj);

	//  Build menus & submenus for each pos in stemma
	var node = undefined;
	for (var pos in action.stemma) {
		var prevNode = node;
		node = action.stemma[pos] ;
		var type = node.getType();
		var id = 'm' + action.id + pos.toString();
		var li = document.createElement('li');
			
		switch(type) {
			// DIALOGS
			case anchorType.input:
				var input = document.createElement('input')
				input.setAttribute('type', 'text');
				input.setAttribute('id', id);
				input.setAttribute('onblur', "mupdateInput('" + id + "','" + node.getID() + "')");
				input.setAttribute('placeholder', getText(node, action.id));
				var len = getText(node, action.id).length;
				var dialog = node.getData();
				if (dialog) {
					input.value = dialog;
					len = dialog.length;
				}
				input.setAttribute('size', len);
				li.appendChild(input);
				break;
				
			// ACTIONS
			default:
				// Build submenu for that pos
				var div = document.createElement('div');
				div.setAttribute("id", id);
				div.setAttribute('onmouseover', 'mcancelclosetime()');
				div.setAttribute('onmouseout', 'mclosetime()');
					
				// Add undo if any
				if (action.undo[node.getText()] != undefined)
				{
					var subm = document.createElement('a');
					subm.setAttribute('href', "javascript:mSelect('" + action.id + "','" + menu.undoText + "'," + pos + ")");
					subm.innerHTML = menu.undoText ;
					div.appendChild(subm);
				}
					
				// Add a submenu with options if any
				var options = node.getOptions();
				var numOptions = 0;
				for (var i in options) {
					var option = options[i];
					// hypothesis: we can't have the two same nodes in the same phrase
					if (exist(option, action.stemma) == true){
						continue;
					}
					numOptions++;
					var subm = document.createElement('a');
					subm.setAttribute('href', "javascript:mSelect('" + action.id + "'," + option.getID() + "," + pos + ")");
					subm.innerHTML = getText(option, prevNode, action.id);
					div.appendChild(subm);
				}
					
				// Build attributes for that pos
				var a = document.createElement('a')
				var type = (numOptions == 0) ? anchorType.terminal : type;
				switch(type) {
					case anchorType.mandatory:
						a.setAttribute('href', '#');
						a.setAttribute('style', menu.colorRed);
						break;
					case anchorType.optional:
						a.setAttribute('href', '#');
						a.setAttribute('style', (action.valid == true) ? menu.colorGreen : menu.colorRed);
						break;
					case anchorType.terminal:
						a.setAttribute('style', (action.valid == true) ? menu.colorBlue : menu.colorRed);
						break;
				}
				
				a.setAttribute('onmouseover', 'mopen(\'' + id + '\')');
				a.setAttribute('onmouseout', 'mclosetime()');
			
				// Generate text for that pos in the menu
				var text = getText(node, prevNode, action.id);
				// first letter always upper case
				if (pos == 0) {
					text = text.substr(0,1).toUpperCase() + text.substr(1);
				}
				// last word always has an endpoint.
				else if (pos == action.stemma.length - 1) {
					text = text + '.';
				}
				a.innerHTML = text;
				
				// attach elements to list
				li.appendChild(a);
				li.appendChild(div);
				break;
		}
		// attach elements to action object
		obj.appendChild(li);
	}
}


/*
 * getText()
 * 	Return generated text
*/

function getText(node, prevNode, actionId) {
	if (node instanceof Subst) {
		// calculate context
		var context = contextSubst.none;
		// 1. check for co-reference
		if (checkCoref(node, actionId) == true) {
			context |= contextSubst.coref ;
		}
		// 2. check for prep determiner
		if ((prevNode instanceof Prep) && prevNode.getDet() != "") {
			context |= contextSubst.prepdet ;
		}
		return node.getText(context);
	}
	// case of indefinite nodes, with prepositional precedence
	else if (node instanceof Node && prevNode instanceof Prep) {
		return prevNode.getDet() + node.getText();
	}
	return node.getText();
}


/*
 * 
 */
function checkCoref(node, actionId) {
	for (var key in menu.actions){
		var action = menu.actions[key];
		if (action.id == actionId) {
			break;
		}
		if (exist(node, action.stemma)) {
			return true;
		}
	}
	return false;
 }

/*
 * Check for node duplication in the stemma
 */
function exist(node, stemma) {
	for (var pos in stemma) {
		if (node.getID() == stemma[pos].getID()) {
			return true;
		}
	}
	return false;
}

/*
 * 
 */
function findAction(id) {
	for (var pos in menu.actions) {
		var action = menu.actions[pos];
		if (action.id == id) {
			return action;
		}
	}
	return undefined;
}

/*
 * Select a submenu by id at position pos
 */
function mSelect(actionId, optionId, pos) {
	var action = findAction(actionId);
	if (action == undefined) {
		return;
	}
	// undo node?
	if (optionId === menu.undoText) {
		var node = action.stemma[pos];
		//
		if (node instanceof Subst) {
			cleanScene3d(node.getText());
		}
		//
		var expand = node.getExpand();
		if (expand != undefined) {
			// clear complement
			popped = action.stemma.pop();
			//
			if (popped instanceof Subst) {
				cleanScene3d(popped.getText());
			}
			//
		}
		var key = action.stemma[pos].getText();
		action.stemma[pos] = action.undo[key];
		action.undo[key] = undefined;
		//
		buildScene3d();
		//
		renderAllMenus(); // render all menus to update co-refs	
	}
	// else set new node
	else {
		var newNode = menu.game.getNode(optionId);
		if (newNode) {
			setMenu(action, newNode, pos);
			//
			buildScene3d();
			//
			renderAllMenus(); // render all menus to update co-refs
		}
	}
}

/*
 * 
 */
function mupdateInput(id, nodeId) {
	var obj = document.getElementById(id);
	var node = menu.game.getNode(nodeId);
	if (obj.value != "") {
		node.setData(obj.value);
		obj.setAttribute('size', obj.value.length);
	} else {
		node.setData(undefined);
	}
}

/*
 * Open hidden layer
 */
function mopen(id)
{	
	// cancel close timer
	mcancelclosetime();
			 
	// close old layer
	if (menu.ddmenuitem)
	{
		menu.ddmenuitem.style.visibility = 'hidden';
	}
			 
	// get new layer and show it
	menu.ddmenuitem = document.getElementById(id);
	menu.ddmenuitem.style.visibility = 'visible';
}
	
/*
 * Close showed layer
 */		
function mclose()
{
	if (menu.ddmenuitem) 
	{
		menu.ddmenuitem.style.visibility = 'hidden';
	}
}

/*
 * Go close timer
 */			 
function mclosetime()
{
	menu.closetimer = window.setTimeout(mclose, menu.timeout);
}

/*
 * Cancel close timer
 */			 
function mcancelclosetime()
{
	if(menu.closetimer)
	{
		window.clearTimeout(menu.closetimer);
		menu.closetimer = null;
	}
}
			 
