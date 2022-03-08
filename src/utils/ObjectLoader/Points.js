import { Object3D } from './Object3D.js';
import { PointsMaterial } from './PointsMaterial.js';
import { BufferGeometry } from './BufferGeometry.js';

export default class Points extends Object3D {

    constructor(geometry = new BufferGeometry(), material = new PointsMaterial()) {
        
        this.type = 'Points';

        this.geometry = geometry;
        this.material = material;

        this.updateMorphTargets();

    }

    updateMorphTargets() {

        const geometry = this.geometry;

        if (geometry.isBufferGeometry) {

            const morphAttributes = geometry.morphAttributes;
            const keys = Object.keys(morphAttributes);

            if (keys.length > 0) {

                const morphAttribute = morphAttributes[keys[0]];

                if (morphAttribute !== undefined) {

                    this.morphTargetInfluences = [];
                    this.morphTargetDictionary = {};

                    for (let m = 0, ml = morphAttribute.length; m < ml; m++) {

                        const name = morphAttribute[m].name || String(m);

                        this.morphTargetInfluences.push(0);
                        this.morphTargetDictionary[name] = m;

                    }

                }

            }

        } else {

            const morphTargets = geometry.morphTargets;

            if (morphTargets !== undefined && morphTargets.length > 0) {

                console.error('THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.');

            }

        }

    }

}