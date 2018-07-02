var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var children = new Array();
var speed = 0.05;
var versoR = false;
var verso = true;

function moveClank(max, max2,centerGamba,centroTesta){

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
	
	if (versoR)	testa.rotation.y -= speed;
	else 		testa.rotation.y += speed;

	testa.translateX(-center.x);
	testa.translateY(-center.y);
	testa.translateZ(-center.z);
}


