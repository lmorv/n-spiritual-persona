import * as THREE from "three";
import { GLTFLoader } from "three/addons/GLTFLoader.js";
import { RGBELoader } from "three/addons/RGBELoader.js";
import { OrbitControls } from "three/addons/OrbitControls.js";
// import { FirstPersonControls } from "three/addons/FirstPersonControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

window.onload = function () {

	let scene;
	let camera;
	let renderer;
	let model;

  // let scale = [
  //     [0.9,0.9,0.9],
  //     [0.9,0.9,0.9],
  //     [0.9,0.9,0.9],
  //     [0.9,0.9,0.9],
  //     [0.9,0.9,0.9],
  //   ];
  let vartorso = 0;
  let torso=[];
  let vararms = 0;
  let arms=[];
  let varhips = 0;
  let hips=[];
  let varlegs = 0;
  let legs=[];

	let gui1;
  let gui2;
  let gui3;
  let guiLeft;
  let controls;
  let clock;
  let canvas;

  

  const state = { variant: "Default" };

  init();

  //select variant from the tutorial
  function selectVariant(scene, parser, extension, variantName) {
    const variantIndex = extension.variants.findIndex((v) =>
      v.name.includes(variantName)
    );

    scene.traverse(async (object) => {
      if (!object.isMesh || !object.userData.gltfExtensions) return;

      const meshVariantDef =
        object.userData.gltfExtensions["KHR_materials_variants"];

      if (!meshVariantDef) return;

      if (!object.userData.originalMaterial) {
        object.userData.originalMaterial = object.material;
      }

      const mapping = meshVariantDef.mappings.find((mapping) =>
        mapping.variants.includes(variantIndex)
      );

      if (mapping) {
        object.material = await parser.getDependency(
          "material",
          mapping.material
        );
        parser.assignFinalMaterial(object);
      } else {
        object.material = object.userData.originalMaterial;
      }

      render();
    });
  }



//-----------------Initialize-----------------
async function init() {

  clock =  new THREE.Clock();
  // canvas = document.querySelector("#c");

//----------------Scene, Renderer-----------------
scene = new THREE.Scene();                    //create a scene
scene.background = new THREE.Color("rgb(202, 198, 255)");
// scene.fog = new THREE.Fog(backgroundColor, 60, 100);

renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

//----------------------Camera------------------
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create perspectivecamera Constructor(Field of view, aspect ratio, near plane, far plane) will define view frustum
camera.position.z = 1;
camera.position.x = 3;
camera.position.y = 4;
camera.zoom = 1;

renderer = new THREE.WebGLRenderer();         //Does the math for you :) (some optional parameters)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );   //domElement corresponds to the canvas


//----------------------Orbit Controls------------------
controls = new OrbitControls(camera, renderer.domElement);
//console.log(controls);
controls.enableDamping = true; // Add damping for smooth camera movement
// controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5; // Adjust the rotation speed
controls.zoomSpeed = 0.2; // Adjust the zoom speed
controls.target.set(0,3.5,0); //Manually adjust the target of the camera at initial position
controls.enablePan = false;
controls.enableZoom = false;

//---------------------Helpers--------------------
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//----------------------Light-------------------
let ambientLight = new THREE.AmbientLight(0x101030, 1.0);
scene.add(ambientLight);
let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

//From Sabine's example... not sure how to change it.
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
scene.add(dirLight);   // Add directional Light to scene


//--------------
setEnvironment();
const {head1,torso1,torso2,torso3,arms1,arms2,arms3,hips1,hips2,hips3,legs1,legs2 } = await loadModels();
torso.push(torso1,torso2,torso3);
arms.push(arms1,arms2,arms3);
hips.push(hips1,hips2,hips3);
legs.push(legs1,legs2);
scene.add(head1,torso1,arms1,hips1,legs1);
render();
//loadVariants();
loadGUI();
update();
}//init


//---------------------GEOMETRIES---------------------

  //to set up environment
  function setEnvironment() {
    new RGBELoader()
    .setDataType(THREE.HalfFloatType)
    .setPath("3dassets/")
    .load("venice_sunset_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = texture;
      });
  }

  //to load the models
  async function loadModels() {
    const loader = new GLTFLoader();
    //----Head----
    const [headData1] = await Promise.all([
    loader.loadAsync("3dassets/head_variant-1.glb")
    ]);
    const head1 = headData1.scene; //headData is the whole thing (meta info) head is specifically the 3d object
    //----Torso----
    const [torsoData1,torsoData2,torsoData3 ] = await Promise.all([
      loader.loadAsync("3dassets/torso_variant-1.glb"),
      loader.loadAsync("3dassets/torso_variant-2.glb"),
      loader.loadAsync("3dassets/torso_variant-3.glb")
      ]);
    const torso1 = torsoData1.scene;
    const torso2 = torsoData2.scene;
    const torso3 = torsoData3.scene;
    //torso1.scale.set(scale, scale, scale);
    //torso.position.set(0,0,0);

    //----Forearm----
    const [forearmsData1, forearmsData2, forearmsData3 ] = await Promise.all([
      loader.loadAsync("3dassets/forearms_variant-1.glb"),
      loader.loadAsync("3dassets/forearms_variant-2.glb"),
      loader.loadAsync("3dassets/forearms_variant-3.glb")
      ]);
    const arms1 = forearmsData1.scene;
    const arms2 = forearmsData2.scene;
    const arms3 = forearmsData3.scene;
    //----Hips----
    const [hipsData1, hipsData2, hipsData3 ] = await Promise.all([
      loader.loadAsync("3dassets/hips_variant-1.glb"),
      loader.loadAsync("3dassets/hips_variant-2.glb"),
      loader.loadAsync("3dassets/hips_variant-3.glb")
      ]);
    const hips1 = hipsData1.scene;
    const hips2 = hipsData2.scene;
    const hips3 = hipsData3.scene;
    //----Legs----
    const [legsData1, legsData2 ] = await Promise.all([
      loader.loadAsync("3dassets/lowerLegs_variant-1.glb"),
      loader.loadAsync("3dassets/lowerLegs_variant-2.glb"),
      ]);
    const legs1 = legsData1.scene;
    const legs2 = legsData2.scene;
    

// //------------Texture Variant----------------
// const parser = torsoData.parser;
// let variantsExtension;

// if ("gltfExtensions" in torsoData.userData) {
//   variantsExtension =
//     torsoData.userData.gltfExtensions["KHR_materials_variants"];
// }

// if (variantsExtension != null) {
//   const variants = variantsExtension.variants.map(
//     (variant) => variant.name
//   );
//   const variantsCtrl = gui1
//     .add(state, "variant", variants)
//     .name("Variant");

//   selectVariant(scene, parser, variantsExtension, state.variant);

//   variantsCtrl.onChange((value) =>
//     selectVariant(scene, parser, variantsExtension, value)
//   );
// }
    
    //Tell the await function when we are done here! :)
    return {head1,torso1,torso2,torso3,arms1,arms2,arms3,hips1,hips2,hips3,legs1,legs2};
    }
    


//to load the texture variants
  // function loadVariants() {
  //   let loader = new GLTFLoader();

  //   loader.load(MODEL_PATH, function (gltf) {
  //     // GUI
  //     gui = new GUI();

  //     model = gltf.scene;
  //     model.scale.set(1, 1, 1);

  //     model.position.set(0,0, 0);
  //     scene.add(model);
       // Details of the KHR_materials_variants extension used here can be found below
       // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
      // const parser = gltf.parser;

      // let variantsExtension;

      // if ("gltfExtensions" in gltf.userData) {
      //   variantsExtension =
      //     gltf.userData.gltfExtensions["KHR_materials_variants"];
      // }

      // if (variantsExtension != null) {
      //   const variants = variantsExtension.variants.map(
      //     (variant) => variant.name
      //   );
      //   const variantsCtrl = gui1
      //     .add(state, "variant", variants)
      //     .name("Variant");

      //   selectVariant(scene, parser, variantsExtension, state.variant);

      //   variantsCtrl.onChange((value) =>
      //     selectVariant(scene, parser, variantsExtension, value)
      //   );
      // }

      //const texture = new THREE.TextureLoader().load("waterdudv.jpg");
      //  texture.wrapS = THREE.RepeatWrapping;
      //   texture.wrapT = THREE.RepeatWrapping;
      //    texture.repeat.set( 100, 100 );

      //let material = new THREE.MeshBasicMaterial({map:texture});

      //let mat = new THREE.MeshPhongMaterial({ map: texture });
       //render();
   //} //load variants
   
   async function modifTorso(){
  scene.remove(torso[vartorso]);
  vartorso++;
if (vartorso >= 3){vartorso=0}
  scene.add(torso[vartorso]);//here I choose what is added
  render();
}
async function modifArms(){
  scene.remove(arms[vararms]);
  vararms++;
if (vararms >= 3){vararms=0}
  scene.add(arms[vararms]);//here I choose what is added
  render();
}
async function modifHips(){
  scene.remove(hips[varhips]);
  varhips++;
if (varhips >= 3){varhips=0}
  scene.add(hips[varhips]);//here I choose what is added
  render();
}
async function modifLegs(){
  scene.remove(hips[varlegs]);
  varlegs++;
if (varlegs >= 2){varlegs=0}
  scene.add(legs[varlegs]);//here I choose what is added
  render();
}

// //------------style sheet reference----------------

// Create a link element
var link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'css/galleryStyle.css';

// Append the link element to the head of the HTML document
document.head.appendChild(link);

function loadGUI() {
  const gui = new GUI( { title: "Torso"});

  //-----Torso GUI-------
  let params = {
    myBoolean: true,
    myString: 'lil-gui',
    myNumber: 1,
    HappyButton: function() { modifTorso(); },
    HappyButton2: function() { modifArms(); },
    HappyButton3: function() { modifHips(); },
    HappyButton4: function() { modifLegs(); },
    number: 3,
    x: 1,
    y: 1,
    z: 1
}
  
  gui.add( params, 'myBoolean' ).onChange(value =>{});  // Checkbox
  gui.add( params, 'myString' );   // Text Field
  gui.add( params, 'myNumber' );   // Number Field
  gui.add( params, 'number', 0.8, 1 ).onChange( value => {
    //scale[1] = value;
    //torso[vartorso].scale.set(scale, scale, scale);
  } );

// nested controllers
const folder1 = gui.addFolder( 'Head' );
folder1.close();
folder1.add( params, 'x', 0.8, 1  ).onChange( value => {
  //scale[0] = value;
  //head[varhead].scale.set(scale, scale, scale);
} );
folder1.add( params, 'y' );
folder1.add( params, 'z' );

const folder2 = gui.addFolder( 'Torso' );
folder2.close();
folder2.add( params, 'HappyButton' ); // Button
folder2.add( params, 'x', 0.8, 1 ).onChange( value => {
  //scaleT = value;
  //torso[vartorso].scale.set(scaleT,scaleT,scaleT );
} );
folder2.add( params, 'y' );
folder2.add( params, 'z' );

const folder3 = gui.addFolder( 'Arms' );
folder3.close();
folder3.add( params, 'HappyButton2' ); // Button

const folder4 = gui.addFolder( 'Hips' );
folder4.close();
folder4.add( params, 'HappyButton3' ); // Button

const folder5 = gui.addFolder( 'Legs' );
folder5.close();
folder5.add( params, 'HappyButton4' ); // Button
}


//-------------Render-------------
  function render() {
    renderer.render(scene, camera);
  }

  //-------------Update---------------
  function update() {

    let delta = clock.getDelta();    

    controls.update();

    // in case resize window
    if (resizeRendererToDisplaySize(renderer)) {
      //console.log("resize");
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      //console.log(canvas.clientWidth);
      camera.updateProjectionMatrix();
    }

    render();
    //console.log("in update");
    requestAnimationFrame(update);
  } //update

  //resize for window
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  } //resize

}; //load