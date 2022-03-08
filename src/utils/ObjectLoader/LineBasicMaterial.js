import { Material } from './Material.js';
import { Color } from './Color.js';

export default class LineBasicMaterial extends Material {

	constructor( parameters ) {

		super();

		this.type = 'LineBasicMaterial';

		this.color = new Color( 0xffffff );

		this.linewidth = 1;
		this.linecap = 'round';
		this.linejoin = 'round';

		this.setValues( parameters );

	}


	copy( source ) {

		super.copy( source );

		this.color.copy( source.color );

		this.linewidth = source.linewidth;
		this.linecap = source.linecap;
		this.linejoin = source.linejoin;

		return this;

	}

}

LineBasicMaterial.prototype.isLineBasicMaterial = true;

export { LineBasicMaterial };