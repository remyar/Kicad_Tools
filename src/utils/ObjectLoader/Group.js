import { Object3D } from './Object3D.js';

export default class Group extends Object3D {

	constructor() {

		super();

		this.type = 'Group';

	}

}

Group.prototype.isGroup = true;

export { Group };