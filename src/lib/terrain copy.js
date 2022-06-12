const THREE = require('THREE');
const {Rectangle} = require('./rectangle')
const {Singleton} = require('./singleton');
export class Terrain extends Rectangle{
  constructor(texture,startPoint,endpoint){
    this.startPoint = startPoint;
    this.endPoint = endpoint;
    this.buildingArea = 50000;
    this.camera = Singleton.getInstance().camera;
    super(this.endPoint.x,this.endPoint.y,endPoint.z,
      this.startPoint.x,this.startPoint.y,this.startPoint.z,
      texture);
    this.addBuildings(
      
    );
  }

  getMaterial(textureImg){
    // const texture = new THREE.TextureLoader().load( textureImg );
    // // texture.wrapS = THREE.RepeatWrapping;
    // // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set( 10000, 10000 );
    // const material =  new THREE.MeshBasicMaterial( { map: texture } );
    // return material;
    return new THREE.MeshBasicMaterial( { color: 0x6e2e1b } );
  }

  addBuildings(camera){
    for (let i = 0 ; i < 1000 ; i++){
      let buildingHeight = Math.floor(Math.random() * 300) + 100;
      let buildingPosX = Math.floor(Math.random() * 10000);
      let buildingPosY = Math.floor(Math.random() * 1000000);
      let building = new Rectangle(70,buildingHeight,70,buildingPosX,buildingPosY,1,0xffffff);
      building.object.position.x = buildingPosX;
      building.object.position.z = buildingPosY;
      this.object.add(building.object);
    }
  }
  updateBuildings(camera){

  }
}