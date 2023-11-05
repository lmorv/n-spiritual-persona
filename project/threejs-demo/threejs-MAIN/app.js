import * as THREE from "three";
import { GLTFLoader } from "three/addons/GLTFLoader.js";
import { RGBELoader } from "three/addons/RGBELoader.js";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { FirstPersonControls } from "three/addons/FirstPersonControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

//----------------Scene and camera------------------
const scene = new THREE.Scene();                    //create a scene
scene.background = new THREE.Color(0xaaaaaa);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create perspectivecamera Constructor(Field of view, aspect ratio, near plane, far plane) will define view frustum
camera.position.z = 30;
camera.position.x = 0;
camera.position.y = -3;
const renderer = new THREE.WebGLRenderer();         //Does the math for you :) (some optional parameters)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );   //domElement corresponds to the canvas

//---------------------Helpers--------------------
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


//----------------------Light-------------------
let ambientLight = new THREE.AmbientLight(0x101030, 1.0);
scene.add(ambientLight);
let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

//From Sabine's example
let d = 8.25;
let dirLight = new THREE.DirectionalLight(0xffffff, 5.0);
dirLight.position.set(-8, 10, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.camera.left = d * -1;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = d * -1;
// Add directional Light to scene
scene.add(dirLight);

//---------------------GEOMETRIES---------------------

//Creating box geometry
const geometry = new THREE.BoxGeometry( 1, 1, 1 );   //vertex
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );   //mesh
scene.add( cube );
//Importing a 3D shape in the GLtf format (.glb or .gltf)
var horn;
const loader = new GLTFLoader();
loader.load( '3dassets/horns.glb', function ( gltf ) { //gltf refers to '3dassets/horns.glb' that was loaded
    horn = gltf.scene;
	scene.add( horn );
}, undefined, function ( error ) {
	console.error( error );
} );




// //not rendered yet
 function animate() {
 	requestAnimationFrame( animate );            //wait for screen refresh, call animate again
//     cube.rotation.x += 0.01;                     //Rotation is a function inside mesh?
//     cube.rotation.y += 0.01;
//     horn.rotation.y += 0.01;
 	renderer.render( scene, camera );            //render!!!
}
 animate();