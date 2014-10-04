var scene3d = {
};

scene3d.yaw = 0;
scene3d.pitch = 0;
scene3d.lastX;
scene3d.lastY;
scene3d.dragging = false;
scene3d.colorDarkGreen = [0.0, 0.4, 0.0];

scene3d.scene = {
	type: "scene",
	id: "scene3d",
	canvasId: "canvas3d",
	
    nodes: [
    {
    	type: "lookAt",
    	eye : { x: 0.0, y: 10.0, z: -50 },
    	look : { y:1.0 },
    	up : { y: 1.0 },
    	
    	nodes: [
    	{
			type: "camera",
			optics: {
				type: "perspective",
				fovy : 30.0,
				aspect : 1.47,
				near : 0.10,
				far : 300.0
			},
			
			nodes: [
			{
				type: "light",
                mode:                   "dir",
                color:                  { r: 1.0, g: 0.5, b: 0.5 },
                diffuse:                true,
                specular:               true,
                dir:                    { x: 1.0, y: 1.0, z: -1.0 }
             },
	
			{
				type: "light",
				mode:                   "dir",
				color:                  { r: 0.5, g: 1.0, b: 0.5 },
				diffuse:                true,
				specular:               true,
				dir:                    { x: 0.0, y: 1.0, z: -1.0 }
			},
	
			{
				type: "light",
				mode:                   "dir",
				color:                  { r: 0.2, g: 0.2, b: 1.0 },
				diffuse:                true,
				specular:               true,
				dir:                    { x: -1.0, y: 0.0, z: -1.0 }
			},
	
			{
				type: "rotate",
				id: "pitch",
				angle: 0.0,
				x : 1.0,
	
				nodes: [
				{
					type: "rotate",
					id: "yaw",
					angle: 0.0,
					y : 1.0,
	
					nodes: [
					{
						id: "primitives",
					}]
				}]
			}]
		}]
	}]
}
 
/*
 * 
 */
function createGrid(nodeId, color, size, step) {
	var points = [];
	var index = [];
	var count = 0 ;
	for (var x=-size; x<=size; x+=step) {
		points.push(x, 0, -size, 
					x, 0, size, 
					-size, 0, x, 
					size, 0, x
		);
		index.push(count, count+1, count+2, count+3);
		count+=4;
	}
	
	SceneJS.Message.sendMessage({
		    command: "update",
		    target: "primitives",
		    add: {
		    	node:{
					id: nodeId,
					type: "material",
					emit: 0,
					baseColor: { r: color[0], g: color[1], b: color[2] },
					specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
				   	specular: 0.9,
					shine: 100.0,
					nodes: [{
						type: "translate",
						id: nodeId + ".position",
						x:0,
						y:0,
						z:0,
						nodes : [{
							type: "scale",
							id: nodeId + ".scale",
							x:1.0,
							y:1.0,
							z:1.0,
							nodes: [{
								type: "geometry",
								primitive: "lines",
								positions : points,
								indices : index
							}]
						}]
					}]
		    	}
		    }
	});
}

/*
 * 
 */
function Object3d(tag, color) {
	this.init(tag, color);
}

Object3d.prototype = {
	init: function(tag, color) {
		this.tag = tag;
		this.color = color;
		this.data = undefined;
	},
	
	getTag: function() {
		return this.tag;	
	},

	getData: function() {
		return this.data;
	}	
}

/*
 * 
 */
function Cube(tag, color) {
	this.init(tag, color);
	this.data = {
		node:{
			id: tag,
			type: "material",
			emit: 0,
			baseColor: { r: color[0], g: color[1], b: color[2] },
			specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
			specular: 0.9,
			shine: 100.0,
			nodes: [{
				type: "translate",
				id: tag + ".position",
				x:0.0,
				y:1.0,
				z:0.0,
				nodes : [{
					type: "scale",
					id: tag + ".scale",
					x:1.0,
					y:1.0,
					z:1.0,
					nodes: [{
						type : "cube"
					}]
				}]
			}]
		}
   };
}

Cube.prototype = new Object3d;

Cube.prototype.setPosition = function(position) {
	var newx = SceneJS.withNode(this.tag + ".position").get("x") + position.x;
	var newy = SceneJS.withNode(this.tag + ".position").get("y") + position.y;
	var newz = SceneJS.withNode(this.tag + ".position").get("z") + position.z;
	SceneJS.withNode(this.tag + ".position").set({x:newx, y:newy, z:newz});
}

Cube.prototype.getPosition = function() {
	var x = SceneJS.withNode(this.tag + ".position").get("x");
	var y = SceneJS.withNode(this.tag + ".position").get("y");
	var z = SceneJS.withNode(this.tag + ".position").get("z");
	return x, y, z;
}

/*
 * 
 */
function Table(tag, color) {
	this.init(tag, color);
	this.data = {
		node: {
			id: tag,
			type: "material",
			emit: 0,
			baseColor: { r: color[0], g: color[1], b: color[2] },
			specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
			specular: 0.9,
			shine: 100.0,
			nodes: [{
				type: "translate",
				id: tag + ".foot1.position",
				x: -2.0,
				y: 2.0,
				z: -2.0,
				nodes : [{
					type: "scale",
					id: tag + ".foot1.scale",
					x:0.25,
					y:2.0,
					z:0.25,
					nodes: [{
						type : "cube"
					}]
				}]
			},
			{
		        type: "translate",
		        id: tag + ".foot2.position",
		        x: 2.0,
		        y: 2.0,
		        z: - 2.0,
		        nodes : [{
		        	type: "scale",
			        id: tag + ".foot2.scale",
		            x:0.25,
		            y:2.0,
		            z:0.25,
					nodes: [{
						type : "cube"
					}]
				}]
			},
			{
		        type: "translate",
		        id: tag + ".foot3.position",
		        x: -2.0,
		        y: 2.0,
		        z: 2.0,
		        nodes : [{
		        	type: "scale",
			        id: tag + ".foot3.scale",
		            x:0.25,
		            y:2.0,
		            z:0.25,
					nodes: [{
						type : "cube"
					}]
				}]
			},
		    {
		        type: "translate",
		        id: tag + ".foot4.position",
		        x: 2.0,
		        y: 2.0,
		        z: 2.0,
		        nodes : [{
		        	type: "scale",
			        id: tag + ".foot4.scale",
		            x:0.25,
		            y:2.0,
		            z:0.25,
					nodes: [{
						type : "cube"
					}]
				}]
			},
		    {
		        type: "translate",
		        id: tag + ".top.position",
		        x: 0.0,
		        y: 4.0,
		        z: 0.0,
		        nodes : [{
		        	type: "scale",
			        id: tag + ".top.scale",
		            x:4.0,
		            y:0.25,
		            z:4.0,
					nodes: [{
						type : "cube"
					}]
				}]
			}]
        }
    }
}

Table.prototype = new Object3d;

Table.prototype.setPosition = function(position) {
	var newx = SceneJS.withNode(this.tag + ".foot1.position").get("x") + position.x;
	var newy = SceneJS.withNode(this.tag + ".foot1.position").get("y") + position.y;
	var newz = SceneJS.withNode(this.tag + ".foot1.position").get("z") + position.z;
	SceneJS.withNode(this.tag + ".foot1.position").set({x:newx, y:newy, z:newz});
	
	newx = SceneJS.withNode(this.tag + ".foot2.position").get("x") + position.x;
	newy = SceneJS.withNode(this.tag + ".foot2.position").get("y") + position.y;
	newz = SceneJS.withNode(this.tag + ".foot2.position").get("z") + position.z;
	SceneJS.withNode(this.tag + ".foot2.position").set({x:newx, y:newy, z:newz});
	
	newx = SceneJS.withNode(this.tag + ".foot3.position").get("x") + position.x;
	newy = SceneJS.withNode(this.tag + ".foot3.position").get("y") + position.y;
	newz = SceneJS.withNode(this.tag + ".foot3.position").get("z") + position.z;
	SceneJS.withNode(this.tag + ".foot3.position").set({x:newx, y:newy, z:newz});
	
	newx = SceneJS.withNode(this.tag + ".foot4.position").get("x") + position.x;
	newy = SceneJS.withNode(this.tag + ".foot4.position").get("y") + position.y;
	newz = SceneJS.withNode(this.tag + ".foot4.position").get("z") + position.z;
	SceneJS.withNode(this.tag + ".foot4.position").set({x:newx, y:newy, z:newz});
	
	newx = SceneJS.withNode(this.tag + ".top.position").get("x") + position.x;
	newy = SceneJS.withNode(this.tag + ".top.position").get("y") + position.y;
	newz = SceneJS.withNode(this.tag + ".top.position").get("z") + position.z;
	SceneJS.withNode(this.tag + ".top.position").set({x:newx, y:newy, z:newz});
}


/*
 * 
 */
function addToScene3d(object, position) {
	SceneJS.Message.sendMessage({
		command: "update",
		target: "primitives",
		add: object.getData()
	});
	// 
	object.setPosition(position);
}

/*
 * 
 */
function removeFromScene3d(id) {
	SceneJS.withNode("primitives")
    	.remove({
        	node: id
    });	
}
 
/*
 * 
 */
function initScene3d(){

	// create the scene
	SceneJS.createNode(scene3d.scene);

	// create a grid
	createGrid("grid", scene3d.colorDarkGreen, 20, 2);
	
	// render the scene	
	SceneJS.withNode("scene3d").render();
	
	// add UI
	var canvas = document.getElementById("canvas3d");
	canvas.addEventListener('mousedown', mouseDown, true);
	canvas.addEventListener('mousemove', mouseMove, true);
	canvas.addEventListener('mouseup', mouseUp, true);
}

/*
 * 
 */
function renderScene3d() {
	// render
	SceneJS.withNode("scene3d").render();
}

/*
 * 
 */
function mouseDown(event) {
    scene3d.lastX = event.clientX;
    scene3d.lastY = event.clientY;
    scene3d.dragging = true;
}

/*
 * 
 */
function mouseUp() {
    scene3d.dragging = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (scene3d.dragging) {
        scene3d.yaw += (event.clientX - scene3d.lastX) * 0.5;
        scene3d.pitch += (event.clientY - scene3d.lastY) * -0.5;

        SceneJS.withNode("yaw").set("angle", scene3d.yaw);
        SceneJS.withNode("pitch").set("angle", scene3d.pitch);

        SceneJS.withNode("scene3d").render();

        scene3d.lastX = event.clientX;
        scene3d.lastY = event.clientY;
    }
}

function renderScene3d() {
	SceneJS.withNode("scene3d").render();
}
