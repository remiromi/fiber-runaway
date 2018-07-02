			var container;

			var camera, scene, renderer;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var children=new Array();
			var speed = 0.05;
			var versoR = false;
			var verso=true;

			//init();
			//animate();


			function init2(clank) {

				/*container = document.createElement( 'div' );
		
				// texture
*/
				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				//var textureLoader = new THREE.TextureLoader( manager );
				//var texture = textureLoader.load( 'three.js-master/examples/textures/UV_Grid_Sm.jpg' );

				// model

				var mtlLoader = new THREE.MTLLoader();
  				mtlLoader.load("robot/robot.mtl", function(materials){
    			// BEGIN Clara.io JSON loader code
					var loader = new THREE.OBJLoader( manager );
					//loader.load( 'three.js-master/examples/models/obj/male02/male02.obj', function ( object ) {
					loader.setMaterials(materials);
					loader.load( 'robot/robot.obj', function ( object ) {

						object.traverse( function ( child ) {

							if ( child instanceof THREE.Mesh ) {
								children.push(child);
							//child.material.map = texture;
							//console.log(child.name);

							}
						} );

				clank = createHierarchy();


				});
		});


			}
		function createHierarchy(children){
				bulloneSn=children[16];
					piedeSn=children[12];
					gambaSopraSn=children[13];
					gambaSottoSn=children[15];
					corpoDietro=children[10];
					corpoDavanti=children[11];
					bustoSotto=children[9];
					gambaSopraDx=children[19];
					bulloneDx=children[18];
					gambaSottoDx=children[17];
					piedeDx=children[2];
					testa=children[8];
					braccioSopraSn=children[7];
					braccioSottoSn=children[6];
					braccioSopraDx=children[5];
					braccioSottoDx=children[4];

					//corpo root
					body= new THREE.Object3D();
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
				// box = new THREE.Box3().setFromObject(gambaSopraDx);
				// centerGamba = box.getCenter();
				// max = box.max;
				// max.x = max.x +3;
				
				// gambaSottoDx.add(piedeDx);
				

				// box2 = new THREE.Box3().setFromObject(braccioSopraDx);
				// max2 = box2.max;
				// max2.z = max2.z -10;
				// max2.y = max2.y -2;
				// braccioSopraDx.add(braccioSottoDx);	

				// box3 = new THREE.Box3().setFromObject(testa);
				// centroTesta = box3.getCenter();


				return body;		
			}



			function moveClank(max, max2,centerGamba,centroTesta){
				//console.log(gambaSottoDx.geometry.type);
				//gambaSottoDx.rotation.x -=.01;
				/*gambaSottoDx.position.x=0;
				gambaSottoDx.position.y=0;
				gambaSottoDx.position.z=0;
				gambaSottoDx.rotation.x-=0.1;*/	

				//pivot.rotation.x += 0.1;

				//gambaSopraDx.translateOnAxis([1,1,1],-max);
				//pivot1.rotation.x +=0.1;
				rotateLegRight(gambaSopraDx, max, "x");
				rotateLegRight(gambaSottoDx, centerGamba, "x");

				rotateArmR(braccioSopraDx, max2);
				rotateArmL(braccioSopraSn, max2);
				
				rotateLegLeft(gambaSopraSn, max, "x");
				rotateLegLeft(gambaSottoSn, centerGamba, "x");

				rotateHead(centroTesta);

			}

function rotateLegRight(objectName, center,axis){
				objectName.translateX(center.x);
				objectName.translateY(center.y);
				objectName.translateZ(center.z);
				switch(axis){
					case "x":
						switch(objectName){
							case gambaSopraDx:
								if(versoR){
								 	if(objectName.rotation.x > -Math.PI/3)
								 		objectName.rotation.x -= speed;
								 	else versoR = false;
									}
								else{ 
								 	if (objectName.rotation.x < Math.PI/3) 
								 		objectName.rotation.x += speed;
								 	else versoR = true;
									}
								break;
							case gambaSottoDx:	
								if(versoR){
									if(objectName.parent.rotation.x < 0)
										objectName.rotation.x += speed*3/4;
									else{
										objectName.rotation.x -= speed*3/4;
									}
								}else{
									if(objectName.parent.rotation.x < 0)
										objectName.rotation.x -= speed*3/4;
									else{
									objectName.rotation.x += speed*3/4;
									}									
								}
							}
						break;
					case "y":
						objectName.rotation.y += speed;
						break;
					case "z":
						objectName.rotation.z += speed;
						break;
				}
				objectName.translateX(-center.x);
				objectName.translateY(-center.y);
				objectName.translateZ(-center.z);
			}

function rotateArmR(objectName, center){
				objectName.translateX(center.x);
				objectName.translateY(center.y);
				objectName.translateZ(center.z);
				
				if(versoR)	objectName.rotation.x -= speed;
				else 		objectName.rotation.x += speed;

				objectName.translateX(-center.x);
				objectName.translateY(-center.y);
				objectName.translateZ(-center.z);
			}

function rotateArmL(objectName, center){
				objectName.translateX(center.x);
				objectName.translateY(center.y);
				objectName.translateZ(center.z);
				
				if(verso)	objectName.rotation.x -= speed;
				else 		objectName.rotation.x += speed;

				objectName.translateX(-center.x);
				objectName.translateY(-center.y);
				objectName.translateZ(-center.z);
			}

function rotateLegLeft(objectName, center, axis){
				objectName.translateX(center.x);
				objectName.translateY(center.y);
				objectName.translateZ(center.z);
				switch(axis){
					case "x":
						switch(objectName){
							case gambaSopraSn:
								if(verso){
								 	if(objectName.rotation.x > -Math.PI/3)
								 		objectName.rotation.x -= speed;
								 	else verso = false;
									}
								else{ 
								 	if (objectName.rotation.x < Math.PI/3) 
								 		objectName.rotation.x += speed;
								 	else verso = true;
									}
								break;
							case gambaSottoSn:	
								if(verso){
									if(objectName.parent.rotation.x < 0)
										objectName.rotation.x += speed*3/4;
									else{
										objectName.rotation.x -= speed*3/4;
									}
								}else{
									if(objectName.parent.rotation.x < 0)
										objectName.rotation.x -= speed*3/4;
									else{
									objectName.rotation.x += speed*3/4;
									}									
								}
							}
						break;
					case "y":
						objectName.rotation.y += speed;
						break;
					case "z":
						objectName.rotation.z += speed;
						break;
				}
				objectName.translateX(-center.x);
				objectName.translateY(-center.y);
				objectName.translateZ(-center.z);
			}
function rotateHead(center){
	testa.translateX(center.x);
	testa.translateY(center.y);
	testa.translateZ(center.z);
	
	if(versoR)	testa.rotation.y -= speed;
	else 		testa.rotation.y += speed;

	testa.translateX(-center.x);
	testa.translateY(-center.y);
	testa.translateZ(-center.z);
}


