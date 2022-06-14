
const THREE = require('THREE');
const {loadFBXModelPromise} = require('./helpers')

export class Singleton {
  static instance = null;
  constructor(){
    if(!this.instance){
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      this.loadingScreen = this.createLoadingScreen();
      this.infotaintmentScreen = this.createInfotaintmentScreen();
      this.light = new THREE.AmbientLight( 0xffffff );
      this.clock = new THREE.Clock();
      this.delta = this.clock.getDelta();
      this.THREE = THREE;

      console.log("this.scene , ",this.scene);
    }
    else{
      throw new Error("Singleton class can not create its another instance");
    }
  }

  updateDeltaTime(){
    this.delta = this.clock.getDelta();
  }

  static getInstance(){
    if(!this.instance){
      this.instance = new Singleton()
    }
    return this.instance;
  }

  createLoadingScreen(){
    class LoadingScreen {
      constructor(){
        this.element = document.getElementById( 'loading-screen' );
      }
      hide(){
        this.element.classList.add( 'fade-out' );
        setTimeout( () => this.element.style.display = 'none' , 500 );
      }
    }
    return new LoadingScreen();
  }

  createInfotaintmentScreen(){
    class InfotaintmentScreen {
      constructor(){
        this.element = document.getElementById( 'infotaintment' );
        this.elementParent = document.getElementById( 'infotaintment-screen' );
        this.elementParent.style.display = 'block';
      }
      update(plane){
        let speed = Math.round(plane.forwardSpeed);
        let altitude = Math.round(plane.object.position.y);
        let throttle = Math.round(plane.throttle);
        this.element.innerHTML = `
        Speed : ${speed} Knots<br>
        Altitude : ${altitude} fts<br>
        Throttle : ${throttle} %
        `;
      }
    }
    return new InfotaintmentScreen();
  }

  async load3dAssets(){
    this.planeModel = await loadFBXModelPromise('./assets/3d/models/plane/scene.gltf');
    this.loadingScreen.hide();
  }
}