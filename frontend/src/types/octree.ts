import * as THREE from "three";
export class BoundingCube {
  public x: number;
  public y: number;
  public z: number;
  public w: number;
  public h: number;
  public l: number;
  constructor(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    l: number
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.l = l;
  }
  public containsPoint = (point: THREE.Vector3): boolean => {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h &&
      point.z >= this.z - this.l &&
      point.z < this.z + this.l
    );
  };

  public insersects = (range: BoundingCube): boolean => {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h ||
      range.z - range.l > this.z + this.l ||
      range.z + range.l < this.z - this.l
    );
  };
}

export class Octree {
  private boundingCube: BoundingCube;
  private capacity: number;
  private points: Array<THREE.Vector3> = [];
  private bottomFrontLeft: Octree | null = null;
  private bottomFrontRight: Octree | null = null;
  private bottomBackLeft: Octree | null = null;
  private bottomBackRight: Octree | null = null;
  private topFrontLeft: Octree | null = null;
  private topFrontRight: Octree | null = null;
  private topBackLeft: Octree | null = null;
  private topBackRight: Octree | null = null;
  constructor(boundingCube: BoundingCube, capacity: number) {
    this.boundingCube = boundingCube;
    this.capacity = capacity;
  }
  private subdivide = (): void => {
    const x: number = this.boundingCube.x;
    const y: number = this.boundingCube.y;
    const z: number = this.boundingCube.z;
    const halfW: number = this.boundingCube.w / 2;
    const halfH: number = this.boundingCube.h / 2;
    const halfL: number = this.boundingCube.l / 2;
    console.log("Hello");
    const bottomFrontLeft: BoundingCube = new BoundingCube(
      x - halfW,
      y + halfH,
      z - halfL,
      halfW,
      halfH,
      halfL
    );
    const bottomFrontRight: BoundingCube = new BoundingCube(
      x + halfW,
      y + halfH,
      z - halfL,
      halfW,
      halfH,
      halfL
    );
    const bottomBackLeft: BoundingCube = new BoundingCube(
      x - halfW,
      y + halfH,
      z + halfL,
      halfW,
      halfH,
      halfL
    );
    const bottomBackRight: BoundingCube = new BoundingCube(
      x + halfW,
      y + halfH,
      z + halfL,
      halfW,
      halfH,
      halfL
    );

    const topFrontLeft: BoundingCube = new BoundingCube(
      x - halfW,
      y - halfH,
      z - halfL,
      halfW,
      halfH,
      halfL
    );
    const topFrontRight: BoundingCube = new BoundingCube(
      x + halfW,
      y - halfH,
      z - halfL,
      halfW,
      halfH,
      halfL
    );
    const topBackLeft: BoundingCube = new BoundingCube(
      x - halfW,
      y - halfH,
      z + halfL,
      halfW,
      halfH,
      halfL
    );
    const topBackRight: BoundingCube = new BoundingCube(
      x + halfW,
      y - halfH,
      z + halfL,
      halfW,
      halfH,
      halfL
    );

    this.bottomFrontLeft = new Octree(bottomFrontLeft, this.capacity);
    this.bottomFrontRight = new Octree(bottomFrontRight, this.capacity);
    this.bottomBackLeft = new Octree(bottomBackLeft, this.capacity);
    this.bottomBackRight = new Octree(bottomBackRight, this.capacity);

    this.topFrontLeft = new Octree(topFrontLeft, this.capacity);
    this.topFrontRight = new Octree(topFrontRight, this.capacity);
    this.topBackLeft = new Octree(topBackLeft, this.capacity);
    this.topBackRight = new Octree(topBackRight, this.capacity);
  };
  public queryRange = (range: BoundingCube): Array<THREE.Vector3> => {
    const pointsInRange: Array<THREE.Vector3> = [];
    if (!this.boundingCube.insersects(range)) {
      return pointsInRange;
    }
    for (let i = 0; i < this.points.length; i++) {
      if (range.containsPoint(this.points[i])) {
        pointsInRange.push(this.points[i]);
      }
    }
    if (this.bottomFrontLeft == null) {
      return pointsInRange;
    }
    const bottomFrontLeftPoints = this.bottomFrontLeft!.queryRange(range);
    pointsInRange.push(...bottomFrontLeftPoints);

    const bottomFrontRightPoints = this.bottomFrontRight!.queryRange(range);
    pointsInRange.push(...bottomFrontRightPoints);

    const bottomBackLeftPoints = this.bottomBackLeft!.queryRange(range);
    pointsInRange.push(...bottomBackLeftPoints);

    const bottomBackRightPoints = this.bottomBackRight!.queryRange(range);
    pointsInRange.push(...bottomBackRightPoints);

    const topFrontLeftPoints = this.topFrontLeft!.queryRange(range);
    pointsInRange.push(...topFrontLeftPoints);

    const topFrontRightPoints = this.topFrontRight!.queryRange(range);
    pointsInRange.push(...topFrontRightPoints);

    const topBackLeftPoints = this.topBackLeft!.queryRange(range);
    pointsInRange.push(...topBackLeftPoints);

    const topBackRightPoints = this.topBackRight!.queryRange(range);
    pointsInRange.push(...topBackRightPoints);

    return pointsInRange;
  };
  public insert = (point: THREE.Vector3): boolean => {
    if (!this.boundingCube.containsPoint(point)) {
      return false;
    }

    if (this.points.length <= this.capacity && this.bottomFrontLeft == null) {
      this.points.push(point);
      return true;
    }
    if (this.bottomFrontLeft == null) {
      this.subdivide();
    }
    if (this.bottomFrontLeft!.insert(point)) {
      return true;
    } else if (this.bottomFrontRight!.insert(point)) {
      return true;
    } else if (this.bottomBackLeft!.insert(point)) {
      return true;
    } else if (this.bottomBackRight!.insert(point)) {
      return true;
    } else if (this.topFrontLeft!.insert(point)) {
      return true;
    } else if (this.topFrontRight!.insert(point)) {
      return true;
    } else if (this.topBackLeft!.insert(point)) {
      return true;
    } else if (this.topBackRight!.insert(point)) {
      return true;
    }
    return false;
  };
  public drawOctree = (scene: THREE.Scene): void => {
    const geometry = new THREE.BoxGeometry(
      this.boundingCube.w * 2,
      this.boundingCube.h * 2,
      this.boundingCube.l * 2
    );
    const edges = new THREE.EdgesGeometry(geometry);

    // Material for the wireframe
    const material = new THREE.LineBasicMaterial({ color: "white" });

    // Create the wireframe mesh using LineSegments (lines instead of a full mesh)
    const wireframe = new THREE.LineSegments(edges, material);

    // Add the wireframe to the scene
    wireframe.position.set(
      this.boundingCube.x,
      this.boundingCube.y,
      this.boundingCube.z
    );
    scene.add(wireframe);

    if (this.bottomBackLeft == null) return;
    this.bottomFrontLeft!.drawOctree(scene);
    this.bottomFrontRight!.drawOctree(scene);
    this.bottomBackLeft!.drawOctree(scene);
    this.bottomBackRight!.drawOctree(scene);
    this.topFrontLeft!.drawOctree(scene);
    this.topFrontRight!.drawOctree(scene);
    this.topBackLeft!.drawOctree(scene);
    this.topBackRight!.drawOctree(scene);
  };
}
