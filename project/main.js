import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// import { AmbientLight } from 'three/src/lights/AmbientLight.js';
// import { DirectionalLight } from 'three/src/lights/DirectionalLight.js';

// set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// set up lighting:
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
console.log(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


// Display a cube:
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.set(0,5,5);
const controls = new OrbitControls(camera, renderer.domElement);


const models = []; // Array to hold models

// loop to position and add models to the scene
for (let i = 0; i < 1; i++) {

const loader = new GLTFLoader();
loader.load( `/fbx/body-bit-${i+1}.glb`, function ( gltf ) {
  console.log(gltf);
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

// const loader = new FBXLoader();
// loader.load(`/fbx/body-bit-${i+1}.glb`, (model) => {
//   scene.add(model);
// });

  // const model = `/fbx/body-bit-${i}.fbx`// Load model 
  // console.log(model);
  // // model.position.z = 5; // Set the position
  // models.push(model);
  // scene.add(model);
}

function animate() {
	requestAnimationFrame( animate ); // refresh the renderer 

  // rotate the cube
  // cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}
animate();