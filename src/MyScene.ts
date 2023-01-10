import * as THREE from "three";
import { BufferGeometry } from "three";
import { createNoise4D } from "../node_modules/simplex-noise/dist/esm/simplex-noise";

export default class MyScene extends THREE.Scene {
  time: number;
  noise: any;
  yOff: number;
  bubble: THREE.Points;
  coords: THREE.Vector3[];

  constructor() {
    super();
    this.noise = createNoise4D();

    const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 30);
    const colors = [];
    const vertices = [];
    this.coords = [];
    const color = new THREE.Color();
    var positionAttribute = icosahedronGeometry.attributes.position;
    for (var i = 0; i < positionAttribute.count; i++) {
      var x = positionAttribute.getX(i);
      var y = positionAttribute.getY(i);
      var z = positionAttribute.getZ(i);
      this.coords.push(new THREE.Vector3(x, y, z));
      vertices.push(x, y, z);
      var val = this.noise(x / 10, y / 10, z / 10, this.time);
      color.setHSL(val, 1, 0.5);
      colors.push(color.r, color.g, color.b);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      opacity: 0.7,
      vertexColors: true,
    });

    this.bubble = new THREE.Points(geometry, material);

    this.add(this.bubble);

    this.bubble.position.z = -20;
    this.bubble.position.y = 0;

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-10, 15, 50);
    this.add(light);

    this.time = 0;
  }

  update() {
    this.time += 0.005;
    this.bubble.rotateX(0.001);

    this.updateGeometry(this.bubble.geometry);
  }

  updateGeometry(geometry: BufferGeometry) {
    var positionAttribute = geometry.attributes.position;
    var colorAttribute = geometry.attributes.color;

    for (var i = 0; i < this.coords.length; i++) {
      var c = this.coords[i];

      var val = this.noise(c.x / 10, c.y / 10, c.z / 10, this.time);
      var a = c.clone().normalize();
      var b = a.multiplyScalar(val);
      var n = b.add(c);
      const color = new THREE.Color();
      color.setHSL(val, 1, 0.5);
      colorAttribute.setXYZ(i, color.r, color.g, color.b);
      positionAttribute.setXYZ(i, n.x, n.y, n.z);
    }
    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  }
}
