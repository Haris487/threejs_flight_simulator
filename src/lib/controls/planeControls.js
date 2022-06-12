import {
	MathUtils,
	Spherical,
	Vector3
} from 'three';

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();

class PlaneControls {

	constructor( object ) {

		this.object = object;

		// API

		this.enabled = true;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

		this.onKeyDown = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW': this.moveForward = true; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = true; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = true; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = true; break;

				case 'KeyR': this.moveUp = true; break;
				case 'KeyF': this.moveDown = true; break;

			}

		};

		this.onKeyUp = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW': this.moveForward = false; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = false;this.object.paddleReset(); break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = false; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = false;this.object.paddleReset(); break;

				case 'KeyR': this.moveUp = false; break;
				case 'KeyF': this.moveDown = false; break;

			}

		};

		this.update = function () {

			return function update( delta ) {

				if ( this.enabled === false ) return;

				if ( this.moveForward )  this.object.throttleIncrease();
				if ( this.moveBackward )  this.object.throttleDecrease();

				if ( this.moveLeft ) this.object.paddleLeft();
				if ( this.moveRight ) this.object.paddleRight();

				if ( this.moveUp ) this.object.pullUp();
				if ( this.moveDown ) this.object.pullDown();
			};

		}();

		this.dispose = function () {

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			this.domElement.removeEventListener( 'mousedown', _onMouseDown );
			this.domElement.removeEventListener( 'mousemove', _onMouseMove );
			this.domElement.removeEventListener( 'mouseup', _onMouseUp );

			window.removeEventListener( 'keydown', _onKeyDown );
			window.removeEventListener( 'keyup', _onKeyUp );

		};

		const _onKeyDown = this.onKeyDown.bind( this );
		const _onKeyUp = this.onKeyUp.bind( this );

		window.addEventListener( 'keydown', _onKeyDown );
		window.addEventListener( 'keyup', _onKeyUp );

	}
}

export { PlaneControls };