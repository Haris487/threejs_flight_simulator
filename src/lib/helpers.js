// var FBXLoader = require('three-fbx-loader');
// import GLTFLoader from 'three-gltf-loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
export function loadFBXModelPromise(modelUrl){
  return new Promise((resolve,reject)=>{
    try {
      const  loader = new GLTFLoader();
      loader.load(
        modelUrl,
        ( gltf ) => {
            // called when the resource is loaded
            resolve(gltf.scene)
        },
        ( xhr ) => {
            // called while loading is progressing
        },
        ( error ) => {
            // called when loading has errors
            console.error( 'An error happened', error );
        },
    );
      loader.load(modelUrl, function (object3d) {
        resolve(object3d.scene);
      });
    }
    catch(e){
      reject(e);
    }
  });
}

export function convertDegreeAnglesToRadians(angleInDegree){
  return angleInDegree * Math.PI / 180;
}