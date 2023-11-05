import * as THREE from "three";
import { GLTFLoader } from "three/addons/GLTFLoader.js";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { FirstPersonControls } from "three/addons/FirstPersonControls.js";

//Scene and camera
const scene = new THREE.Scene();                    //create a scene
scene.background = new THREE.Color(0xaaaaaa);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create perspectivecamera Constructor(Field of view, aspect ratio, near plane, far plane) will define view frustum

const renderer = new THREE.WebGLRenderer();         //Does the math for you :) (some optional parameters)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );   //domElement corresponds to the canvas

//Helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


//Light
const light = new THREE.AmbientLight( 0x404040, 50 );// soft white light
scene.add( light );
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 10 );
light.position.set( 50, 50, 50 );
scene.add( directionalLight );


//GEOMETRIES

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




camera.position.z = 5;
// //not rendered yet
 function animate() {
 	requestAnimationFrame( animate );            //wait for screen refresh, call animate again
//     cube.rotation.x += 0.01;                     //Rotation is a function inside mesh?
//     cube.rotation.y += 0.01;
//     horn.rotation.y += 0.01;
 	renderer.render( scene, camera );            //render!!!
}
 animate();