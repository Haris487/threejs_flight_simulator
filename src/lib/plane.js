import { Singleton } from "./singleton"
const THREE = Singleton.getInstance().THREE;
const { PlaneControls } = require('./controls/planeControls.js');
const { convertDegreeAnglesToRadians } = require('./helpers');
console.log("PlaneControls", PlaneControls);


export class Plane {
  constructor(x, y, z, color) {
    this.color = color;
    this.pos = [x, y, z];
    this.controls = new PlaneControls(this);

    this.throttle = 0;

    this.forwardSpeed = 0;
    this.verticalSpeed = 0;

    this.uplift = 0;

    this.minSpeed = 1;
    this.maxSpeed = 120;

    this.minThrottle = 0;
    this.maxThrottle = 100;

    this.acceleration = 300;

    this.isLeftPaddle = false;
    this.isRightPaddle = false;

    this.airResistance = 10;

    this.oldPosition = null;

    this.speed = 0;
  }

  getMaterial(color) {
    return new THREE.MeshBasicMaterial({ color: color });
  }

  create() {
    const geometry = new THREE.BoxGeometry(10, 10, 50);
    const material = this.getMaterial(this.color);
    const planeHull = new THREE.Mesh(geometry, material);
    planeHull.visible = false;
    const plane = Singleton.getInstance().planeModel.children[0];
    console.log('plane', plane);
    const camera = Singleton.getInstance().camera;
    const object = new THREE.Object3D()
    object.add(plane);
    object.add(planeHull);
    object.add(camera);
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = -150;
    this.camera = camera;
    this.plane = plane;
    this.planeHull = planeHull;

    this.scene = Singleton.getInstance().scene;
    this.object = object;

    this.scene.add(this.object);
    this.object.position.x = this.pos[0];
    this.object.position.y = this.pos[1];
    this.object.position.z = this.pos[2];
    this.oldPosition = this.object.position.clone();
    // this.setSound();
  }

  calculateSpeed(){
    const deltaTime = Singleton.getInstance().delta;
    const newPosition = this.object.position.clone();
    const distanceTravel = this.oldPosition.distanceTo(newPosition);
    const speed = distanceTravel / deltaTime;
    this.speed = speed;
    this.oldPosition = newPosition;
  }

  throttleIncrease() {
    if (this.throttle >= this.maxThrottle) return;
    this.throttle += 1;
    // this.sound.setVolume(this.throttle * 0.01);
  }
  throttleDecrease() {
    if (this.throttle <= this.minThrottle) return;
    this.throttle -= 1;
    // this.sound.setVolume(this.throttle * 0.01);
  }
  calculateForwardSpeed() {
    if (this.forwardSpeed > this.maxSpeed) {
      this.forwardSpeed = this.maxSpeed - 1;
      return;
    }
    if (this.forwardSpeed < this.minSpeed) {
      this.forwardSpeed = this.minSpeed + 1;
      return;
    }

    const delta = Singleton.getInstance().clock.getDelta();
    const rate = (this.throttle / 100) * this.acceleration * delta;
    this.forwardSpeed += rate;
    if (this.forwardSpeed > this.minSpeed + 10) {
      this.forwardSpeed -= this.airResistance * delta;
    }
  }

  paddleLeft() {
    this.isLeftPaddle = true;
  }
  paddleReset() {
    this.isRightPaddle = false;
    this.isLeftPaddle = false;
  }
  paddleRight() {
    this.isRightPaddle = true;
  }
  pullUp() {
    // this.verticalSpeed += 1;
    this.object.rotateX(-0.01);
  }
  pullDown() {
    // this.object.rotation.x += 0.01;
    this.object.rotateX(0.01);
    // this.verticalSpeed -= 1;
  }

  update() {
    this.controls.update();
    this.camera.lookAt(this.object.position);
    this.calculateForwardSpeed();
    this.calculateUpLift();
    this.move();
    this.isCollided();
  }

  move() {
    const delta = Singleton.getInstance().delta;
    // const delta = Singleton.getInstance().clock.getDelta();

    this.object.translateZ(this.forwardSpeed * delta);
    // this.object.position.z += this.forwardSpeed;
    // this.object.position.y += this.verticalSpeed;
    if (this.isRightPaddle) {
      // this.object.rotation.z += 0.01;
      this.object.rotateZ(0.01);
    }
    if (this.isLeftPaddle) {
      this.object.rotateZ(-0.01);
      if ( this.physics !== undefined ) this.physics.update( delta );
      // this.object.rotation.z -= 0.01;
    }
    // this.plane.rotation.x=this.object.rotation.x + (-1.570);
    // this.plane.rotation.y=this.object.rotation.y;
    // this.plane.rotation.z=this.object.rotation.z;
    // Gravitational force;
    this.object.position.y -= 32.1522 * delta;

    // uplift
    this.object.translateY( this.uplift * delta );
  }

  calculateUpLift(){
    const upliftForce = 0.5 * this.forwardSpeed;
    this.uplift = upliftForce;
  }

  isCollided() {
    if (this.object.position.y < 0) {
      this.controls.enabled = false;
      this.throttle = 0;
      this.verticalSpeed = 0;
      this.forwardSpeed = 0;
      this.plane.visible = false;
      this.planeHull.visible = true;
    }
  }

  setSound() {
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    Singleton.getInstance().camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);
    this.sound = sound;

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('assets/sounds/airplane_engine_2.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0);
      sound.play();
    });
  }
}