import {Singleton} from "./singleton"
const THREE = Singleton.getInstance().THREE;


export class Rectangle {
  constructor(width,height,depth,x,y,z,color){
    this.geometry = new THREE.BoxGeometry( width, height, depth );
    this.material = this.getMaterial(color);
    this.object = new THREE.Mesh( this.geometry, this.material );
    this.scene = Singleton.getInstance().scene;
    console.log("rectangle scene",this.scene)
    this.pos=[x,y,z];
  }

  getMaterial(color){
    return new THREE.MeshBasicMaterial( { color: color } );
  }

  create(){
    this.scene.add(this.object);
    this.object.position.x = this.pos[0];
    this.object.position.y = this.pos[1];
    this.object.position.z = this.pos[2];
  }
}