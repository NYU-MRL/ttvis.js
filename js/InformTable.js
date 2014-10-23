var TABLE_WIDTH = 32;
var TABLE_HEIGHT = 32;
var SPACING = 0.3;
var MAX_HEIGHT = 4;

InformTable = function()
{
	THREE.Object3D.call(this);

	this.cubes = [];
	this.table = {};
	this.dampSpeed = 0;

	this.showClipping = false;
}

InformTable.prototype = Object.create(THREE.Object3D.prototype);

InformTable.prototype.init = function()
{
	// create the big table
	var geo = new THREE.CubeGeometry(TABLE_WIDTH + TABLE_WIDTH*SPACING + 4,
			TABLE_HEIGHT + TABLE_HEIGHT*SPACING + 4, 3.9);
	this.table = new THREE.Mesh(geo, resMgr.materials.gray);
	this.add(this.table);

	// create the pixels
	var topLeft = {};
	topLeft.x = -(TABLE_WIDTH+TABLE_WIDTH*SPACING)/2 + 0.5;
	topLeft.y = -(TABLE_HEIGHT+TABLE_HEIGHT*SPACING)/2 + 0.5;

	geo = new THREE.CubeGeometry(1, 1, MAX_HEIGHT);
	for (var y=0; y<TABLE_HEIGHT; y++)
	{
		for (var x=0; x<TABLE_WIDTH; x++)
		{
			var cube = new THREE.Mesh(geo, resMgr.materials.white);
			cube.position.set(topLeft.x + x + SPACING*x, topLeft.y + y + SPACING*y, 0);
			this.cubes[(TABLE_HEIGHT-y-1)*TABLE_WIDTH + x] = cube;
			this.table.add(cube);
			cube.castShadow = true;
			cube.receiveShadow = true;
		}
	}
}

// heights should be an array of values ranging 0 - 1
InformTable.prototype.applyHeights = function(heights)
{
	for (var i=0; i<heights.length; i++)
	{
		var cube = this.cubes[i];
		if (!cube) {
			continue;
		}

		cube.position.z += (heights[i]*MAX_HEIGHT - cube.position.z) * (1-this.dampSpeed);

		if (this.showClipping) {
			if (heights[i] == 0 || heights[i] == MAX_HEIGHT) {
				cube.material = resMgr.materials.black;
			}
			else {
				cube.material = resMgr.materials.white;
			}
		}
	}
}

InformTable.prototype.refreshClipping = function()
{
	if (this.showClipping) {
		return;
	}

	for (var i=0; i<this.cubes.length; i++)
	{
		var cube = this.cubes[i];
		cube.material = resMgr.materials.white;
	}
}

InformTable.prototype.transform = function(func)
{
	for (var y=0; y<TABLE_HEIGHT; y++)
	{
		for (var x=0; x<TABLE_WIDTH; x++)
		{
			var cube = this.cubes[y*TABLE_WIDTH + x];
			cube.position.z = func(x, y);
			if (cube.position.z < 0) {
				cube.position.z = 0;
			}
			else if (cube.position.z > 4) {
				cube.position.z = 4;
			}
		}
	}
}

