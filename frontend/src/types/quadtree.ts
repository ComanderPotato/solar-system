import * as THREE from "three";
export class BoundingBox {
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

  public insersects = (range: BoundingBox): boolean => {
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

export class QuadTree {
  private boundingBox: BoundingBox;
  private capacity: number;
  private points: Array<THREE.Vector3> = [];
  private NW: QuadTree | null = null;
  private NE: QuadTree | null = null;
  private SW: QuadTree | null = null;
  private SE: QuadTree | null = null;
  constructor(boundingBox: BoundingBox, capacity: number) {
    this.boundingBox = boundingBox;
    this.capacity = capacity;
  }
  private subdivide = (): void => {
    const x: number = this.boundingBox.x;
    const y: number = this.boundingBox.y;
    const z: number = this.boundingBox.z;
    const halfW: number = this.boundingBox.w / 2;
    const halfH: number = this.boundingBox.h / 2;
    const halfL: number = this.boundingBox.l / 2;
    console.log("Hello");
    const NW: BoundingBox = new BoundingBox(
      x - halfW,
      y + halfH,
      z - halfL,
      halfW,
      halfH,
      halfL
    );
    const NE: BoundingBox = new BoundingBox(
      x + halfW,
      y + halfH,
      z - halfL,
      halfW,
      halfH,
      halfL
    );
    const SW: BoundingBox = new BoundingBox(
      x - halfW,
      y + halfH,
      z + halfL,
      halfW,
      halfH,
      halfL
    );
    const SE: BoundingBox = new BoundingBox(
      x + halfW,
      y + halfH,
      z + halfL,
      halfW,
      halfH,
      halfL
    );

    this.NW = new QuadTree(NW, this.capacity);
    this.NE = new QuadTree(NE, this.capacity);
    this.SW = new QuadTree(SW, this.capacity);
    this.SE = new QuadTree(SE, this.capacity);
  };
  public queryRange = (range: BoundingBox): Array<THREE.Vector3> => {
    const pointsInRange: Array<THREE.Vector3> = [];
    if (!this.boundingBox.insersects(range)) {
      return pointsInRange;
    }
    for (let i = 0; i < this.points.length; i++) {
      if (range.containsPoint(this.points[i])) {
        pointsInRange.push(this.points[i]);
      }
    }
    if (this.NW == null) {
      return pointsInRange;
    }
    const NWPoints = this.NW!.queryRange(range);
    pointsInRange.push(...NWPoints);

    const NEPoints = this.NE!.queryRange(range);
    pointsInRange.push(...NEPoints);

    const SWPoints = this.SW!.queryRange(range);
    pointsInRange.push(...SWPoints);

    const SEPoints = this.SE!.queryRange(range);
    pointsInRange.push(...SEPoints);

    return pointsInRange;
  };
  public insert = (point: THREE.Vector3): boolean => {
    if (!this.boundingBox.containsPoint(point)) {
      return false;
    }

    if (this.points.length <= this.capacity && this.NW == null) {
      this.points.push(point);
      return true;
    }
    if (this.NW == null) {
      this.subdivide();
    }
    if (this.NW!.insert(point)) {
      return true;
    } else if (this.NE!.insert(point)) {
      return true;
    } else if (this.SW!.insert(point)) {
      return true;
    } else if (this.SE!.insert(point)) {
      return true;
    }
    return false;
  };
  public drawQuadTree = (scene: THREE.Scene): void => {
    const NW = new THREE.Vector3(
      this.boundingBox.x - this.boundingBox.w * 2,
      0,
      this.boundingBox.y + this.boundingBox.h * 2
    );
    const NE = new THREE.Vector3(
      this.boundingBox.x + this.boundingBox.w * 2,
      0,
      this.boundingBox.y + this.boundingBox.h * 2
    );
    const SW = new THREE.Vector3(
      this.boundingBox.x - this.boundingBox.w * 2,
      0,
      this.boundingBox.y - this.boundingBox.h * 2
    );
    const SE = new THREE.Vector3(
      this.boundingBox.x + this.boundingBox.w * 2,
      0,
      this.boundingBox.y - this.boundingBox.h * 2
    );
    // const NW = new Float32Array([
    //   this.boundingBox.x - this.boundingBox.w * 2,
    //   0,
    //   this.boundingBox.y + this.boundingBox.h * 2,
    // ]);
    // const NE = new Float32Array([
    //   this.boundingBox.x + this.boundingBox.w * 2,
    //   0,
    //   this.boundingBox.y + this.boundingBox.h * 2,
    // ]);
    // const SW = new Float32Array([
    //   this.boundingBox.x - this.boundingBox.w * 2,
    //   0,
    //   this.boundingBox.y - this.boundingBox.h * 2,
    // ]);
    // const SE = new Float32Array([
    //   this.boundingBox.x + this.boundingBox.w * 2,
    //   0,
    //   this.boundingBox.y - this.boundingBox.h * 2,
    // ]);
    const vertices = new Float32Array([...NW, ...NE, ...SW, ...SE]);
    console.log(vertices);
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const geometry = new THREE.BufferGeometry().setFromPoints([NW, NE, SW, SE]);
    const edges = new THREE.EdgesGeometry(geometry);

    const material = new THREE.LineBasicMaterial({ color: "white" });

    const wireframe = new THREE.LineSegments(geometry, material);

    wireframe.position.set(this.boundingBox.x, this.boundingBox.y, 0);
    scene.add(wireframe);
    return;
    if (this.SW == null) return;
    this.NW!.drawQuadTree(scene);
    this.NE!.drawQuadTree(scene);
    this.SW!.drawQuadTree(scene);
    this.SE!.drawQuadTree(scene);
  };
}
