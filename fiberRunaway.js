{
	var sceneWidth, sceneHeight;
	var camera, scene, renderer, dom;
	var sun, ground, rollingPath, tunnel, border, border1;
	var hero;
	var rollingSpeed = 0.01;
	var worldRadius  = 26;
	var heroRadius 	 = 0.2;
	var sphericalHelper, pathAngleValues;
	var heroBaseY 	 = 1.85;
	var bounceValue  = 0.1;
	var gravity 	 = 0.005;
	var leftLane 	 = -1.5;
	var rightLane 	 =  1.5;
	var middleLane 	 = 0;
	var currentLane;
	var clock, jumping;
	var objectReleaseInterval = 1.0;
	var objectsInPath, objectsPool;
	var particleGeometry;
	var particleCount 	= 20;
	var explosionPower  = 1.06;
	var particles;
	var scoreText, score;
	var hasCollided;
	var moving = false;
	var moonTexture;
	var count = 100;
	var isRestoring = false;
	var soundPowerUp;
	var soundHit;
	var soundObstacles;
	var background;
	var timeoutCollision = 300;
	var timePowerUp = 6000;
	var maxConesPool = 40;
	var lampadina = new THREE.Mesh();
	var cloud = new THREE.Mesh();
	var bomba = new THREE.Mesh();
	var pila = new THREE.Mesh();
	var ingranaggio = new THREE.Mesh();
}
function easy(){
	rollingSpeed = 0.005;
	objectReleaseInterval = 2.0;
	document.getElementById("easy").style.opacity = "1.0";
	document.getElementById("normal").style.opacity = "0.6";
	document.getElementById("hard").style.opacity = "0.6";
}
function medium(){
	rollingSpeed = 0.01;
	objectReleaseInterval = 1.0;
	document.getElementById("easy").style.opacity = "0.6";
	document.getElementById("normal").style.opacity = "1.0";
	document.getElementById("hard").style.opacity = "0.6";
}
function hard(){
	rollingSpeed = 0.02;
	objectReleaseInterval = 0.5;
	document.getElementById("easy").style.opacity = "0.6";
	document.getElementById("normal").style.opacity = "0.6";
	document.getElementById("hard").style.opacity = "1.0";
}
init();
function start(){
	moving = !moving;
	document.getElementById("MenuScreen").style.height = "0%";
	audioStart();
	update();
}
function restart(){
	count = 100;
	div = document.getElementById('gioco');
	div.parentNode.removeChild(div);
	audioStart();
	moving = !moving;
	init();
	document.getElementById("GameOverScreen").style.height = "0%";
}
function init() {
	
	createLamp();
	createCloud();
	createBomb();
	createPila();
	createGear();
	
	createScene();
	setTimeout(function(){
		defineObjectPool();
		update();
	},1500);
}
function createScene(){
	hasCollided = false;
	objectsInPath = [];
	objectsPool = [];
	clock = new THREE.Clock();
		clock.start();
	heroRollingSpeed = (rollingSpeed*worldRadius/heroRadius)/5;
	sphericalHelper = new THREE.Spherical();
	// Lanes position
	pathAngleValues = [1.52,1.57,1.62];
    sceneWidth  = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene();
    	scene.fog = new THREE.FogExp2( 0xcccccc, 0.05 ); 
    camera   = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 30 );
    renderer = new THREE.WebGLRenderer({alpha:true});
    	renderer.setClearColor(0x000000, 1); 
    	renderer.shadowMap.enabled = true;
    	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    	renderer.setSize( sceneWidth, sceneHeight );
    //aggiungi scene all'HTML
    dom = document.createElement( 'div' );
    	document.body.appendChild( dom);
    	dom.setAttribute("id", "gioco");
		dom.appendChild(renderer.domElement);


	addWorld();
	addHero();
	addLight();
	addExplosion();	

	camera.position.z = 8.5;
	camera.position.y = 3.5;

	//Orbit Control
		/*orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
		orbitControl.addEventListener( 'change', render );
		orbitControl.enableKeys = false;
		orbitControl.enablePan = false; // */
	
	window.addEventListener('resize', onWindowResize, false);
	document.onkeydown = handleKeyDown;
}
//crea pool di oggetti da aggiungere alla scena 
function defineObjectPool(){
	var choose = 0;
	var tempPool = [0,0,0,0,0,0];
	for(var i = 0; i < maxConesPool;i++){
		choose = Math.floor(Math.random()*100)+1;
		// console.log(choose);
		if(i == 0){
			objectsPool.push(cloud.clone());
			tempPool[2] +=1;
		}else if(i == 8){
			objectsPool.push(pila.clone());
			tempPool[4] +=1;
		}else if(i == 16){
			objectsPool.push(lampadina.clone());
			tempPool[1] +=1;
		}else if(i == 24){
			objectsPool.push(createOctahedron());
			tempPool[5] +=1;
		}else if(i == 32){
			objectsPool.push(bomba.clone());
			tempPool[3] +=1;
		}
		if(choose >= 40 && choose<60){
			newObject = ingranaggio.clone();
			tempPool[0] += 1;
		}else if(choose>=60 && choose<70){
			newObject = lampadina.clone();
			tempPool[1] += 1;
		}else if(choose>=70 && choose<80){
			newObject = cloud.clone();
			tempPool[2] += 1;
		}else if(choose>0 && choose<40){
			newObject = bomba.clone();
			tempPool[3] += 1;
		}else if(choose>=80 && choose<90){
			newObject = pila.clone();
			tempPool[4] += 1;
		}else{
			newObject = createOctahedron();
			tempPool[5] += 1;
		}	
		objectsPool.push(newObject);
	}
	console.log(tempPool);
}
function addWorld(){
	var sides = 100, tiers = 100;
	//sfera strada
	var pathTexture  = new THREE.TextureLoader().load("texture/raldo.jpg");
		pathTexture.wrapS = pathTexture.wrapT = THREE.RepeatWrapping; 
		pathTexture.repeat.set( 11, 11);
	var pathGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
	var pathMaterial = new THREE.MeshStandardMaterial( {color:0xffffff, flatShading:THREE.FlatShading, map: pathTexture } );
	rollingPath = new THREE.Mesh( pathGeometry, pathMaterial );
		rollingPath.receiveShadow = true;
		rollingPath.castShadow 	  = false;
		rollingPath.rotation.z    = -Math.PI/2;
		rollingPath.position.y    = -24;
		rollingPath.position.z    = 2;	
  	scene.add( rollingPath );
	
	//delimitatori lato strada
 	var borderTexture  = new THREE.TextureLoader().load("texture/range.jpg");
		borderTexture.wrapS = borderTexture.wrapT = THREE.RepeatWrapping; 
		borderTexture.repeat.set( 100, 1);
	var borderGeometry = new THREE.TorusGeometry( worldRadius-.3,.3,16,100);
	var borderMaterial = new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, map: borderTexture } );
	//border
	border = new THREE.Mesh( borderGeometry, borderMaterial );
		border.rotateY(11);
		border.translateZ(-2.7);
		border.position.y = -24;
		border.position.z = 2;
	scene.add( border );
	//border1
	border1 = new THREE.Mesh( borderGeometry, borderMaterial );
		border1.rotateY(11);
		border1.translateZ(2.7);
		border1.position.y = -24;
		border1.position.z = 2;	
	scene.add( border1 );

	//tunnel
	var tunnelTexture  = new THREE.TextureLoader().load("texture/circuit.jpeg");
		tunnelTexture.wrapS = tunnelTexture.wrapT = THREE.RepeatWrapping; 
		tunnelTexture.repeat.set( 8, 2);
	var tunnelGeometry = new THREE.TorusGeometry( worldRadius, 3, 16, 100 );
	var tunnelMaterial = new THREE.MeshBasicMaterial( { map: tunnelTexture } );
		tunnelMaterial.side = THREE.DoubleSide;
 	tunnel = new THREE.Mesh( tunnelGeometry, tunnelMaterial );
		tunnel.position.y = -24
		tunnel.position.z = 2;
		tunnel.rotateY(11);
	scene.add( tunnel );
}
function addHero(){
	jumping = false;
	children = new Array();
	var mtlLoader = new THREE.MTLLoader();
  	mtlLoader.load("robot/robot.mtl", function(materials){
    var objectLoader = new THREE.OBJLoader();
    objectLoader.setMaterials(materials);
    objectLoader.load("robot/robot.obj", function ( obj ) {
    obj.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {
			children.push(child);
		}
	} );
    hero = obj;

    createHierarchy();
    
    hero.receiveShadow = true;
    for (var i = 0; i < children.length;i++)
		children[i].castShadow = true;
	hero.castShadow = true;
	scene.add(hero);
	//initial position
	hero.scale.set(.01,.01,.01);
	//hero.scale.set(.1,.1,.1);
	hero.position.y = heroBaseY;
	hero.position.z = 4.8;
	currentLane = middleLane;
	hero.position.x = currentLane;
	hero.rotateY(135);
    	});
  	});
}
function addLight(){
	ambientLight = new THREE.AmbientLight(0xfffafa, .8)
	sun = new THREE.DirectionalLight( 0xcdc1c5, 0.99);
		sun.position.set( 0,8,15 );
		sun.target.position.z = -10;
		sun.castShadow = true;
		sun.shadow.mapSize.width = 512;
		sun.shadow.mapSize.height = 512;
		sun.shadow.camera.near = 4;
		sun.shadow.camera.far = 50 ;
	scene.add(ambientLight);
	scene.add(sun);
	scene.add(sun.target);
}
function handleKeyDown(keyEvent){
	if(jumping)return;
	var validMove = true;
	if ( keyEvent.keyCode === 37 || keyEvent.keyCode === 65) {//'A' or Left arrow
		if(currentLane==middleLane){
			currentLane=leftLane;
		}else if(currentLane==rightLane){
			currentLane=middleLane;
		}else{
			validMove=false;	
		}
	} else if ( keyEvent.keyCode === 39 || keyEvent.keyCode === 68) {//'S' or Right arrow
		if(currentLane==middleLane){
			currentLane=rightLane;
		}else if(currentLane==leftLane){
			currentLane=middleLane;
		}else{
			validMove=false;	
		}
	}else{
		if ( keyEvent.keyCode === 38 || keyEvent.keyCode === 87){// 'W' or Up arrow
			bounceValue=0.1;
			jumping=true;
		}
		validMove=false;
	}
	if(validMove){
		jumping = true;
		bounceValue = 0.06;
	}
}
// Aggiungi oggetti in una corsia della strada
function addPathObj(){
	var options = [0,1,2];
	var lane = Math.floor(Math.random()*3);
	addObj(lane);
	// Elimina la corsia lane appena usata
	options.splice(lane,1);
	// Seleziona random un'altra corsia tra le rimanenti
	if(Math.random() > 0.5){
		lane = Math.floor(Math.random()*2);
		addObj(options[lane]);
	}
}
// Aggiunge l'oggetto alla scena sulla corsia row
function addObj(row){
	var newObject;
	if(objectsPool.length == 0)return;
	newObject = objectsPool.pop();
	for(var i = 0; i < newObject.children.length;i++){
		newObject.children[i].visible = true;
	}
	newObject.visible = true;
	objectsInPath.push(newObject);
	sphericalHelper.set( worldRadius-0.3, pathAngleValues[row],-(rollingPath.rotation.x-4));
	newObject.position.setFromSpherical( sphericalHelper );
	var rollingGroundVector = rollingPath.position.clone().normalize();
	
	var objVector = newObject.position.clone().normalize();
		newObject.quaternion.setFromUnitVectors(objVector,rollingGroundVector);
	rollingPath.add(newObject);
}
function createLamp(){
	var mtlLampLoader = new THREE.MTLLoader();
  	mtlLampLoader.load("oggetti/lampadina.mtl", function(materials){
	    var objectLampLoader = new THREE.OBJLoader();
	    objectLampLoader.setMaterials(materials);
	    objectLampLoader.load("oggetti/lampadina.obj", function ( obj ) {
		    obj.traverse( function ( child ) {
				child.castShadow = true;
				child.receiveShadow = true;		
			} );
		    obj.visible = false;
			obj.scale.set(.015,.015,.015);
			obj.position.y += 1;
			lampadina.name = "lampadina";
			obj.rotation.x = - Math.PI/2;
			lampadina.add(obj);
    	});
  	});
}
function createBomb(){
	var mtlBombLoader = new THREE.MTLLoader();
  	mtlBombLoader.load("oggetti/bomba.mtl", function(materials){
	    var objectBombLoader = new THREE.OBJLoader();
	    objectBombLoader.setMaterials(materials);
	    objectBombLoader.load("oggetti/bomba.obj", function ( obj ) {
	    	obj.traverse( function ( child ) {
				child.castShadow = true;
				child.receiveShadow = true;		
			} );
		    obj.visible = false;
			obj.scale.set(.04,.04,.04);
			obj.position.y += .7;
			bomba.name = "bomba";
			obj.rotation.x =  -Math.PI/2;
			obj.rotation.z = -Math.PI/3;
			bomba.add(obj);
    	});
  	});
}
function createGear(){
	var mtlGearLoader = new THREE.MTLLoader();
  	mtlGearLoader.load("oggetti/ingraGold.mtl", function(materials){
	    var objectGearLoader = new THREE.OBJLoader();
	    objectGearLoader.setMaterials(materials);
	    objectGearLoader.load("oggetti/ingraGold.obj", function ( obj ) {
		    obj.traverse( function ( child ) {
				child.castShadow = true;
				child.receiveShadow = true;		
			} );
			obj.scale.set(.02,.02,.02);
			obj.position.y = 0.80;
			obj.rotateZ(90);
			ingranaggio.name = "ingranaggio";
			ingranaggio.add(obj);		
    	});
  	});
}
function createPila(){
	var mtlBatteryLoader = new THREE.MTLLoader();
  	mtlBatteryLoader.load("oggetti/vitadiPi.mtl", function(materials){
	    var objectBatteryLoader = new THREE.OBJLoader();
	    objectBatteryLoader.setMaterials(materials);
	    objectBatteryLoader.load("oggetti/vitadiPi.obj", function ( obj ) {
		    obj.traverse( function ( child ) {
				child.castShadow = true;
				child.receiveShadow = true;		
			} );
		    obj.visible = false;
			obj.scale.set(.01,.01,.01);
			obj.position.y += 1;
			pila.name = "pila";
			obj.rotation.x = - Math.PI/2;
			pila.add(obj);
    	});
  	});
}
function createCloud(){
	var mtlCloudLoader = new THREE.MTLLoader();
  	mtlCloudLoader.load("oggetti/Cloud_3.mtl", function(materials){
	    var objectCloudLoader = new THREE.OBJLoader();
	    objectCloudLoader.setMaterials(materials);
	    objectCloudLoader.load("oggetti/Cloud_3.obj", function ( obj ) {
		    obj.receiveShadow = true;
		    obj.visible = false;
		    obj.traverse( function ( child ) {
				child.castShadow = true;
				child.receiveShadow = true;
			} );
			obj.scale.set(.03,.03,.03);
			obj.position.y = 1;
			cloud.name = "nuvoletta";
			cloud.add(obj);
    	});
  	});
}
function createOctahedron(){
	var octaGeometry = new THREE.OctahedronGeometry(0.4);
	var wireframe = new THREE.WireframeGeometry(octaGeometry);
	var line = new THREE.LineSegments(wireframe);
	line.material.opacity = 0.40;
	line.material.transparent = true;
	line.material.color = new THREE.Color(0xffffff);
	line.position.y = 0.75;
	var octa = new THREE.Object3D();
	line.receiveShadow = true;
	line.castShadow = true;
	octa.name = "octa";
	octa.add(line);
	return octa;
}
function update(){
	document.getElementById("score").innerHTML = "Score: " + count;
	moveClank(max, max2,centerGamba,centroTesta);
	// Animate
    rollingPath.rotation.x 	+= rollingSpeed/5;
    tunnel.rotation.x 		+= rollingSpeed/5;
    border.rotation.x 		+= rollingSpeed/5;
    border1.rotation.x 		+= rollingSpeed/5;

    if(hero.position.y <= heroBaseY){
    	jumping = false;
    	bounceValue = (Math.random() * 0.04) + 0.005;
    }
    hero.position.y += bounceValue;
    // lerp -> interpolazione usata per lo spostamento laterale
    hero.position.x =  THREE.Math.lerp(hero.position.x,currentLane, 2*clock.getDelta());
    bounceValue -= gravity;
    if(clock.getElapsedTime() > objectReleaseInterval){
    	clock.start();
    	addPathObj();
    }
    doObjectLogic();
    doExplosionLogic();
    render();
    gameOver();
	if(moving){;
		requestAnimationFrame(update); //request next update
	}
}
function doObjectLogic(){
	var oneObj;
	var objPos = new THREE.Vector3();
	var objToRemove = [];
	objectsInPath.forEach( function ( element, index ) {
		oneObj = objectsInPath[ index ];
		objPos.setFromMatrixPosition( oneObj.matrixWorld );
		if(objPos.z > 10 && oneObj.visible){ //gone out of our view zone
			objToRemove.push(oneObj);
		}else{ //check collision
			if(objPos.distanceTo(hero.position)<=0.5 && !isRestoring){
				hasCollided = true;
				explode(objectsInPath[index]);
			}
		}
	});
	var fromWhere;
	objToRemove.forEach( function ( element, index ) {
		oneObj   = objToRemove[ index ];
		fromWhere = objectsInPath.indexOf(oneObj);
		objectsInPath.splice(fromWhere,1);
		objectsPool.push(oneObj);
		oneObj.visible = false;
	});
}
// Crea i vettori di riferimento per l'esplosione 
function explode(object){
	isRestoring = true;
	switch(object.name){
		case "nuvoletta":
			soundObstacles.play();
			scene.fog = new THREE.FogExp2( 0xcccccc, 0.25 );
			setTimeout(function(){
				object.visible = false;
			},100);
			setTimeout(function(){
				scene.fog = new THREE.FogExp2( 0xcccccc, 0.05 );
			},timePowerUp);
			break;
		case "ingranaggio":
			soundPowerUp.play();
			count += 10;
			//set object visibility to false
			setTimeout(function(){
				object.children[0].visible = false;
			},100);

			break;
		case "bomba":
			soundHit.play();
			count -= 25;
			particles.position.y = 2;
			particles.position.z = 4.8;
			particles.position.x = hero.position.x;
			for (var i = 0; i < particleCount; i ++ ) {
				var vertex = new THREE.Vector3();
				vertex.x = -0.2 + Math.random() * 0.4;
				vertex.y = -0.2 + Math.random() * 0.4 ;
				vertex.z = -0.2 + Math.random() * 0.4;
				particleGeometry.vertices[i]=vertex;
			}
			explosionPower = 1.07;
			particles.visible = true;
			//set object visibility to false
			setTimeout(function(){
				object.visible = false;
			},100);
			break;
		case "lampadina":
			soundObstacles.play();
			ambientLight.intensity = 0.1;
			sun.intensity = 0.1;
			setTimeout(function(){
				object.visible = false;
			},100);
			setTimeout(function(){
			  ambientLight.intensity = 0.8;
			  sun.intensity = 0.6;
			},timePowerUp);
			break;
		case "pila":
			soundObstacles.play();
			setTimeout(function(){
				object.visible = false;
			},100);
			rollingSpeed = rollingSpeed*2;
			objectReleaseInterval = objectReleaseInterval/2;
			timeoutCollision /= 2; 
			setTimeout(function(){
				rollingSpeed = rollingSpeed/2;
				objectReleaseInterval = objectReleaseInterval*2;
				timeoutCollision *= 2;
			},timePowerUp);
			break;
		case "octa":
			soundObstacles.play();
			setTimeout(function(){
				object.visible = false;
			},100);
			hero.visible = false; 
			setTimeout(function(){
			hero.visible = true; 
			},timePowerUp*2/3);
			break;
	}

	setTimeout(function(){
		isRestoring = false;
	},timeoutCollision);
}
// Inizializza le particelle per esplosione
function addExplosion(){
	particleGeometry = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		particleGeometry.vertices.push( vertex );
	}
	var pMaterial = new THREE.PointsMaterial({
	  color: 0xffff00,
	  size: 0.08
	});
	particles = new THREE.Points( particleGeometry, pMaterial );
	scene.add( particles );
	particles.visible = false;
}
//create explosion effect
function doExplosionLogic(){
	if(!particles.visible) return;
	for (var i = 0; i < particleCount; i ++ ) {
		particleGeometry.vertices[i].multiplyScalar(explosionPower);
	}
	if(explosionPower > 1.005){
		explosionPower -= 0.001;
	}else{
		particles.visible = false;
	}
	particleGeometry.verticesNeedUpdate = true;
}
function render(){
	renderer.render(scene, camera);//draw
}
function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
}
function gameOver(){
	if (count <= 0){
		setTimeout(moving = !moving, 4000);
		gameOverNav();
		background.stop();

	}
}
function createHierarchy(){
		bulloneSn = children[16];
		piedeSn = children[12];
		gambaSopraSn = children[13];
		gambaSottoSn = children[15];
		corpoDietro = children[10];
		corpoDavanti = children[11];
		bustoSotto = children[9];
		gambaSopraDx = children[19];
		bulloneDx = children[18];
		gambaSottoDx = children[17];
		piedeDx = children[2];
		testa = children[8];
		braccioSopraSn = children[7];
		braccioSottoSn = children[6];
		braccioSopraDx = children[5];
		braccioSottoDx = children[4];

		//corpo root
			body = new THREE.Object3D();
			body.add(corpoDietro);
			body.add(corpoDavanti);
			body.add(bustoSotto);
			bustoSotto.add(gambaSopraDx);
			gambaSopraDx.add(gambaSottoDx);
			gambaSopraDx.add(bulloneDx);
			//gambaSottoDx.add(piedeDx);
			bustoSotto.add(gambaSopraSn);
			body.add(braccioSopraDx);
			gambaSopraSn.add(gambaSottoSn);
			gambaSottoSn.add(bulloneSn);
			gambaSottoSn.add(piedeSn);
			body.add(braccioSopraSn);
			braccioSopraSn.add(braccioSottoSn);
			
			body.add(testa);
			scene.add(body);
		box = new THREE.Box3().setFromObject(gambaSopraDx);
		centerGamba = box.getCenter();
		max = box.max;
		max.x = max.x +3;
		gambaSottoDx.add(piedeDx);
		

		box2 = new THREE.Box3().setFromObject(braccioSopraDx);
		max2 = box2.max;
		max2.z = max2.z -10;
		max2.y = max2.y -2;
		braccioSopraDx.add(braccioSottoDx);	

		box3 = new THREE.Box3().setFromObject(testa);
		centroTesta = box3.getCenter();

		hero = body;
}
function audioStart(){
	listener = new THREE.AudioListener();
			soundPowerUp = new THREE.Audio( listener );
			var audioLoader = new THREE.AudioLoader();
				audioLoader.load( '/music/powerUp.ogg', function( buffer ) {
				soundPowerUp.setBuffer( buffer );
				soundPowerUp.setVolume( 1.0 );
			});
			soundHit = new THREE.Audio( listener );
			var audioLoader = new THREE.AudioLoader();
				audioLoader.load( '/music/soundHit.ogg', function( buffer ) {
				soundHit.setBuffer( buffer );
				soundHit.setVolume( 1.0 );
			});
			background = new THREE.Audio( listener );
			var audioLoader = new THREE.AudioLoader();
				audioLoader.load( '/music/background.mp3', function( buffer ) {
				background.setBuffer( buffer );
				background.setVolume( 0.20 );
				background.setLoop(true);
				background.play();
			});

			soundObstacles = new THREE.Audio( listener );
			var audioLoader = new THREE.AudioLoader();
				audioLoader.load( '/music/obstacles.ogg', function( buffer ) {
				soundObstacles.setBuffer( buffer );
				soundObstacles.setVolume( 4.0 );
			});
}
