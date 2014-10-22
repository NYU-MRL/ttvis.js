TestObject2 = function()
{
	THREE.Object3D.call(this);
	this.size = 60;

	this.initialPositions = [];
}
TestObject2.prototype = Object.create(THREE.Object3D.prototype);

TestObject2.prototype.init = function()
{
	var detail = 4;

	this.geo = new THREE.OctahedronGeometry( this.size, detail );
	// this.geo = new THREE.TetrahedronGeometry( 20, 3 );
	// this.geo = new THREE.SphereGeometry(20, 12, 12);
	// this.geo = new THREE.CylinderGeometry( 20, 20, 50, 18, 18, false);
	// this.geo = new THREE.CubeGeometry( 20, 20, 20, 12, 12, 12);
	// this.geo = new THREE.PlaneGeometry( 40, 40, 12, 12 );
	var mesh = new THREE.Mesh(this.geo, resMgr.materials.object);
	this.add(mesh);
	mesh.castShadow = true;
	mesh.receiveShadow = false;

	for (var i=0; i<this.geo.vertices.length; i++)
	{
		this.initialPositions[i] = this.geo.vertices[i].clone();
	}

	console.log("initial positions = " + this.initialPositions.length);
	console.log(ttForce.length);
}

TestObject2.prototype.update = function(dt)
{
	for (var i=0; i<this.geo.vertices.length; i++)
	{
		if (i >= ttForce.length) {
			// don't have a force assigned to this vertex
			continue;
		}

		var initialVec = this.initialPositions[i].clone();
		var outVec = this.geo.vertices[i].clone();
		outVec.normalize();
		outVec.multiplyScalar(ttForce[i]);
		outVec.multiplyScalar(dt);
		outVec.add(initialVec);
		this.geo.vertices[i] = outVec;
		this.geo.verticesNeedUpdate = true;
	}
}

TestObject2.prototype.reset = function()
{
}
