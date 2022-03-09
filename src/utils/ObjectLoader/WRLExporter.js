import Vector3 from './Vector3';

export default class STLExporter {
    constructor() {
    }
    parse(scene, options = {}) {

        let output = '';

        const objects = [];
        let triangles = 0;

        scene.traverse(function (object) {
            if (object.isMesh) {
                const geometry = object.geometry;
                if (geometry.isBufferGeometry !== true) {
                    throw new Error('THREE.STLExporter: Geometry is not of type THREE.BufferGeometry.');
                }

                const index = geometry.index;
                const positionAttribute = geometry.getAttribute('position');
                triangles += index !== null ? index.count / 3 : positionAttribute.count / 3;
                objects.push({
                    object3d: object,
                    geometry: geometry
                });
            }
        });

        let offset = 80; // skip header

        output = '';
        output += '#VRML V2.0 utf8\n';

        const vA = new Vector3();
        const vB = new Vector3();
        const vC = new Vector3();
        const cb = new Vector3();
        const ab = new Vector3();
        const normal = new Vector3();

        for (let i = 0, il = objects.length; i < il; i++) {

            const object = objects[i].object3d;
            const geometry = objects[i].geometry;
            const index = geometry.index;
            const positionAttribute = geometry.getAttribute('position');

            if (index !== null) {

                // indexed geometry
                for (let j = 0; j < index.count; j += 3) {

                    const a = index.getX(j + 0);
                    const b = index.getX(j + 1);
                    const c = index.getX(j + 2);
                    writeFace(a, b, c, positionAttribute, object);

                }

            } else {

                // non-indexed geometry
                for (let j = 0; j < positionAttribute.count; j += 3) {

                    const a = j + 0;
                    const b = j + 1;
                    const c = j + 2;
                    writeFace(a, b, c, positionAttribute, object);

                }

            }

        }

        return output;

        function writeFace(a, b, c, positionAttribute, object) {

            const _group = object.geometry.groups.find((_g) => ((a >= _g.start) && c <= (_g.start + _g.count)) );
            const _material = object.material[_group.materialIndex];

            vA.fromBufferAttribute(positionAttribute, a);
            vB.fromBufferAttribute(positionAttribute, b);
            vC.fromBufferAttribute(positionAttribute, c);

            if (object.isSkinnedMesh === true) {

                object.boneTransform(a, vA);
                object.boneTransform(b, vB);
                object.boneTransform(c, vC);

            }

            vA.applyMatrix4(object.matrixWorld);
            vB.applyMatrix4(object.matrixWorld);
            vC.applyMatrix4(object.matrixWorld);

            output += "Shape { \n";

            writeNormal(vA, vB, vC);

            output += '\tgeometry IndexedFaceSet { \n';
            output += '\t\tcoordIndex [0,1,2,-1]\n';
            output += '\t\tcoord Coordinate { \n';
            output += '\t\t\tpoint [\n';

            writeVertex(vA);
            writeVertex(vB);
            writeVertex(vC);

            output += '\t\t\t]\n';
            output += '\t\t}\n';
            output += '\t}\n';
            output += '\tappearance Appearance {\n';
            output += '\t\tmaterial Material {\n';
            output += '\t\t\tdiffuseColor ' + _material.color?.r?.toFixed(2) + ' ' + _material.color?.g?.toFixed(2) + ' ' + _material.color?.b?.toFixed(2) + '\n';
            output += '\t\t\ttransparency 0.000000\n';
            output += '\t\t}\n';
            output += '\t}\n';
            output += '}\n';
        }

        function writeNormal(vA, vB, vC) {

            cb.subVectors(vC, vB);
            ab.subVectors(vA, vB);
            cb.cross(ab).normalize();
            normal.copy(cb).normalize();
        }

        function writeVertex(vertex) {
            output += '\t\t\t\t' + vertex.x.toFixed(2) + ' ' + vertex.y.toFixed(2) + ' ' + vertex.z.toFixed(2) + '\n';
        }
    }
}