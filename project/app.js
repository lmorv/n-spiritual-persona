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
	let gui1;
  let gui2;
  let gui3;
  let guiLeft;
  let controls;
  let clock;
  let canvas;

  const state = { variant: "Default" };

  const MODEL_PATH = "3dassets/body.glb";

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
function init() {

  clock =  new THREE.Clock();

  // canvas = document.querySelector("#c");

//----------------Scene, Renderer-----------------
scene = new THREE.Scene();                    //create a scene
scene.background = new THREE.Color(0xaaaaaa);
// scene.fog = new THREE.Fog(backgroundColor, 60, 100);

renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

//----------------------Camera------------------
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create perspectivecamera Constructor(Field of view, aspect ratio, near plane, far plane) will define view frustum
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 4;

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
controls.target.set(0,3,0); //Manually adjust the target of the camera at initial position
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
loadModel();
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

//to load the model
function loadModel() {
    let loader = new GLTFLoader();

    loader.load(MODEL_PATH, function (gltf) {  

      model = gltf.scene;
      model.scale.set(1, 1, 1);

      model.position.set(0,0,0);
      scene.add(model);

      // Details of the KHR_materials_variants extension used here can be found below
      // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
      const parser = gltf.parser;

      let variantsExtension;

      if ("gltfExtensions" in gltf.userData) {
        variantsExtension =
          gltf.userData.gltfExtensions["KHR_materials_variants"];
      }

      if (variantsExtension != null) {
        const variants = variantsExtension.variants.map(
          (variant) => variant.name
        );
        const variantsCtrl = gui1
          .add(state, "variant", variants)
          .name("Variant");

        selectVariant(scene, parser, variantsExtension, state.variant);

        variantsCtrl.onChange((value) =>
          selectVariant(scene, parser, variantsExtension, value)
        );
      }

      //const texture = new THREE.TextureLoader().load("waterdudv.jpg");
      //  texture.wrapS = THREE.RepeatWrapping;
      //   texture.wrapT = THREE.RepeatWrapping;
      //    texture.repeat.set( 100, 100 );

      //let material = new THREE.MeshBasicMaterial({map:texture});

      //let mat = new THREE.MeshPhongMaterial({ map: texture });
      render();
    });
  } //load model

function loadGUI() {
    let guiWidth = window.innerWidth * 0.2; // 20% of the screen width
    let guiHeight = window.innerHeight * 0.2; // 20% of the screen height
    let GUIbgColor = 'rgba(173, 216, 230, 0.7)'; // Light teal with transparency

    let containerOffset = (-window.innerWidth) + 200;

    // Create a container div for gui1, gui2, and gui3
    let guiContainer = document.createElement('div');
    guiContainer.style.position = 'absolute';
    guiContainer.style.right = `${containerOffset}px`; // Adjust the right position
    guiContainer.style.top = '20px'; // Adjust the top position
    guiContainer.style.backgroundColor = 'rgba(173, 255, 230, 0.3)';
    // guiContainer.style.width = guiWidth + 'px'; 
    // guiContainer.style.height = guiHeight + 'px';
    document.getElementById("overlay").appendChild(guiContainer);

    // declare GUI elements:
     // Declare GUI elements and position them within the container
     gui1 = new GUI({autoPlace: false});
     gui1.domElement.style.position = 'relative'; // Position gui1 relative to the container
     gui2 = new GUI({autoPlace: false});
     gui2.domElement.style.position = 'relative'; // Position gui2 relative to the container
     gui3 = new GUI({autoPlace: false});
     gui3.domElement.style.position = 'relative'; // Position gui3 relative to the container
     guiContainer.appendChild(gui1.domElement);
     guiContainer.appendChild(gui2.domElement);
     guiContainer.appendChild(gui3.domElement);

    guiLeft = new GUI({ autoPlace: false });

    // Style GUIs
    gui1.domElement.style.width = guiWidth + 'px'; 
    gui1.domElement.style.height = guiHeight + 'px'; 
    gui1.domElement.style.backgroundColor = 'rgba(173, 216, 230, 0.7)'; // Light teal with transparency
    // gui1.domElement.style.top = '20px'; // Adjust the top position


    gui2.domElement.style.width = guiWidth + 'px';
    gui2.domElement.style.backgroundColor = GUIbgColor; 

    gui3.domElement.style.width = guiWidth + 'px';
    gui3.domElement.style.backgroundColor = GUIbgColor; 

    document.getElementById("overlay").appendChild(guiLeft.domElement); 
    guiLeft.domElement.style.position = 'absolute';
    guiLeft.domElement.style.left = '100px'; // Adjust the left position
    guiLeft.domElement.style.top = '20px'; // Adjust the top position
    guiLeft.domElement.style.width = guiWidth + 'px'; 
    guiLeft.domElement.style.height = guiHeight + 'px';
    guiLeft.domElement.style.backgroundColor = 'rgba(173, 216, 230, 0.7)'; // Light teal with transparency
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
      console.log("resize");
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      console.log(canvas.clientWidth);
      camera.updateProjectionMatrix();
    }

    render();
    console.log("in update");
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