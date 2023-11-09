import * as THREE from "three";
import { GLTFLoader } from "three/addons/GLTFLoader.js";
import { RGBELoader } from "three/addons/RGBELoader.js";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { FirstPersonControls } from "three/addons/FirstPersonControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

window.onload = function () {
  let scene;
  let camera;
  let renderer;
  let model;
  let gui;
  const state = { variant: "Default" };
  //const MODEL_PATH_PUMPKIN = "3dassets/pumpkin/mr_pumpkin.glb";
  const MODEL_PATH = "3dassets/cube.glb";


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

  //to set up environment
  function setEnvironment() {
    new RGBELoader()
      .setDataType(THREE.HalfFloatType)
      .setPath("textures/equirectangular/")
      .load("venice_sunset_1k.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = texture;
      });
  }

  //to load the model
  function loadModel() {
    let loader = new GLTFLoader();

    loader.load(MODEL_PATH, function (gltf) {
      // GUI
      gui = new GUI();

      model = gltf.scene;
      model.scale.set(1, 1, 1);

      model.position.set(0,0, 0);
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
        const variantsCtrl = gui
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

  function init() {
    const canvas = document.querySelector("#c");
    const backgroundColor = 0x726f6f;
    // Init the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    //scene.fog = new THREE.Fog(backgroundColor, 60, 100);

    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Add a camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = -3;

    //
    // Add lights

    let ambientLight = new THREE.AmbientLight(0x101030, 1.0);
    scene.add(ambientLight);
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
    hemiLight.position.set(0, 50, 0);
    //Add hemisphere light to scene
    scene.add(hemiLight);

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

    // const controls = new THREE.OrbitControls(camera, canvas);
    //   controls.target.set(0, 5, 0);
    //   controls.update();

    //var pmremGenerator = new THREE.PMREMGenerator( renderer );
    // pmremGenerator.compileEquirectangularShader();

    setEnvironment();
    loadModel();

    update();
  } //init

  //render

  function render() {
    renderer.render(scene, camera);
  }

  //update
  function update() {
    // in case resize window
    if (resizeRendererToDisplaySize(renderer)) {
      console.log("resize");
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    render();
    console.log("in update");
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
