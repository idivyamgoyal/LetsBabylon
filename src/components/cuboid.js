import { Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, ArcRotateCamera } from "@babylonjs/core";

let box;
const onSceneReady = (scene, image) => {
    // This creates and positions a free camera (non-mesh)
    // var camera = new FreeCamera("camera1", new Vector3(0, 8, -10), scene);
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new Vector3(0, 4.5, -15), scene);
    camera.setTarget(Vector3.Zero());
    const canvas = scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 0.5, 0.5), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 10;

    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox("box", {
        size: 4
    }, scene);
    var material = new StandardMaterial('material', scene);
    material.diffuseTexture = new Texture(image, scene);

    box.position.y = 1;
    // box.position.z = 1;

    box.material = material;
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
    if (box !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime();
        const rpm = 5;
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
};

const cuboid = {
    onSceneReady: onSceneReady,
    onRender: onRender
};

export default cuboid;