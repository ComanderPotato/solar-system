import { Vector3 } from "three";
import { GRAVITATIONAL_CONSTANT as G, SCALE } from "./constants";

// ==============================================
// Symbols and Definitions
// ----------------------------------------------
// G: Gravitational constant
// M: Primary Mass
// m: Secondary Mass
// P: Primary position (Vector3)
// S: Secondary position (Vector3)
// v: Velocity (Vector3, usually secondary body)
// r: Distance between primary and secondary
// rSqr: Squared distance between primary and secondary
// F: Gravitational force (Vector3)
// ==============================================

// ===== Fundamental Gravitational Equations =====

// Computes the squared distance between two points (P and S)
export const calculateSquaredDistance = (P: Vector3, S: Vector3): number => S.distanceToSquared(P);

// Computes the unit vector direction from source (S) to point (P)
export const calculateForceDirection = (P: Vector3, S: Vector3): Vector3 => P.clone().sub(S).normalize();

// Computes the magnitude of the gravitational force using Newton's law of gravitation: (GMm) / r²
export const calculateGravitationalForce = (M: number, m: number, rSqr: number): number => (G * M * m) / rSqr;

// Computes the gravitational force vector applied to an object
export const calculateAttractiveForce = (forceDir: Vector3, M: number, m: number, rSqr: number): Vector3 =>
  forceDir.clone().multiplyScalar(calculateGravitationalForce(M, m, rSqr));

// Computes acceleration from force: F / m
export const calculateAcceleration = (F: Vector3, m: number): Vector3 => F.clone().divideScalar(m);

// Computes updated velocity after a time step (dt): v + a * dt
export const calculateUpdatedVelocity = (v: Vector3, acceleration: Vector3, dt: number): Vector3 => v.clone().add(acceleration.clone().multiplyScalar(dt));

// ===== Orbital Mechanics =====

// Computes gravitational potential energy: -(GMm) / r
export const calculateGravitationalPotentialEnergy = (M: number, m: number, r: number): number => -(G * M * m) / r;

// Computes kinetic energy: ½mv²
export const calculateKineticEnergy = (m: number, v: Vector3): number => 0.5 * m * v.lengthSq();

// Computes total energy in a gravitational system: ½mv² - (GMm) / r
export const calculateTotalEnergy = (M: number, m: number, v: Vector3, r: number): number =>
  calculateKineticEnergy(m, v) + calculateGravitationalPotentialEnergy(M, m, r);

// Computes orbital velocity for circular orbits: sqrt(GM / r)
export const calculateOrbitalVelocity = (M: number, r: number): number => Math.sqrt((G * M) / r);

// ===== Escape Velocity Calculations =====

// Computes specific kinetic energy: ½v²
export const calculateSpecificKineticEnergy = (v: Vector3): number => v.lengthSq() / 2;

// Computes specific gravitational potential energy: -GM / r
export const calculateSpecificPotentialEnergy = (M: number, r: number): number => -((G * M) / r);

// Computes escape velocity condition: ½v² - (GM / r)
export const calculateEscapeVelocity = (M: number, v: Vector3, r: number): number => calculateSpecificKineticEnergy(v) - calculateSpecificPotentialEnergy(M, r);

// // Computes the orbital period (Kepler’s Third Law): T = 2π√(r³ / GM)
// export const calculateOrbitalPeriod = (M: number, r: number): number =>
//     2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M));

// Computes centripetal acceleration: a = GM / r²
export const calculateCentripetalAcceleration = (M: number, r: number): number => (G * M) / Math.pow(r, 2);

// Computes angular momentum: L = m * v * r
export const calculateAngularMomentum = (m: number, v: number, r: number): number => m * v * r;

// ===== Equations for Drawing Orbits =====

// a: Semi-Major Axis - Size of the orbit, defined as the average of the two below distances
// Periapsis - Point of orbit closest to orbiting body
// Perigee - Closest point of orbit, travelling the fastest
// Apoapsis - Point of orbit furthest from orbiting body
// Apogee - Furthest point of orbit, travelling the slowest
// e: Eccentricty - Shape of the orbit
// Omega: Argument of Perigee - Location of Perigee in the orbit
// v (Greek letter nu?): True Anomaly - Where in the orbit the body is located from the orbits Perigee

// ===== Two Line Element =====
// 1 25544U 98067A 17352.66420480 .00016717 00000-0 10270-3 0 9003
// 2 25544  51.6357 198.7788 0003099 256.7529 103.3278 15.54194944 10432

// Line one
// Catelog number - 25544U
// Epic Time - 17352.66420480 = 2017 (17) 352nd day (352) 4pm coordinated Universal Time (UTC) (66420480)

// Line two
// Inclination - 51.6357
// Right Ascention of Ascending Node (RAAN) - 198.7788 (Degrees) (Decimal Assumed)
// Eccentricity - 0003099
// Argument of Perigee - 256.7529
// True Anomaly - 103.3278 (Degrees)
// Mean motion - 15.54194944 times in a day
// ==============================================

export const calculateLatusRectum = (a: number, e: number) => {
  return a * (1 - e ** 2);
};
export const calculateOrbitalRadius = (a: number, e: number, theta: number) => {
  return calculateLatusRectum(a, e) / (1 + e * Math.cos(theta));
};

// Converts orbital parameters to 3D Cartesian coordinates
export const calculateOrbitPosition = (a: number, e: number, i: number, theta: number): Vector3 => {
  const r = calculateOrbitalRadius(a, e, theta);
  return new Vector3(r * Math.cos(theta), r * Math.sin(theta) * Math.cos(i), r * Math.sin(theta) * Math.sin(i));
};

export const calculateFocalShift = (x: number, a: number, e: number) => {
  return x - a * e;
};

export const calculateOrbitalPeriod = (a: number, M: number) => {
  return (((4 * Math.PI ** 2 * a ** 3) / G) * M) ** 2;
};

export const calculateCelestialBodyMass = (r: number, M: number, T: number): number => {
  return (4 * Math.PI ** 2 * r ** 3) / (G * T ** 2);
};
// export const updateVelocity = (
//   primaryBody: CelestialBody,
//   secondaryBody: CelestialBody,
//   elapsedTime: number
// ): THREE.Vector3 => {
//   const [primaryBodyPosition, secondaryBodyPosition]: [
//     THREE.Vector3,
//     THREE.Vector3
//   ] = [
//     primaryBody.celestialBodyMeshGroup.position.clone(),
//     secondaryBody.celestialBodyMeshGroup.position.clone(),
//   ];
//   const [primaryBodyMass, secondaryBodyMass]: [number, number] = [
//     primaryBody.getInformation("mass"),
//     secondaryBody.getInformation("mass"),
//   ];
//   const sqrDist = calculateSqrDistance(
//     primaryBodyPosition,
//     secondaryBodyPosition
//   );
//   const forceDir = calculateForceDirection(
//     primaryBodyPosition,
//     secondaryBodyPosition
//   );
//   //   Previously force
//   const acceleration = calculateAttractiveForce(
//     forceDir,
//     primaryBodyMass,
//     secondaryBodyMass,
//     sqrDist
//   );
//   return acceleration.multiplyScalar(elapsedTime);
//   //   const force = calculateAttractiveForce(
//   //     forceDir,
//   //     primaryBodyMass,
//   //     secondaryBodyMass,
//   //     sqrDist
//   //   );
//   //   const acceleration = calculateAcceleration(force, secondaryBodyMass);
//   return calculateUpdatedVelocity(
//     secondaryBody.getVelocity(),
//     acceleration,
//     elapsedTime
//   );
// };

// const drawOrbitLine = (points: Array<Vector3>): Line => {
//   const geometry = new BufferGeometry().setFromPoints(points);
//   const material = new LineBasicMaterial({ color: 0x0000ff });
//   return new Line(geometry, material);
// };

// const calculateDistance = (
//   P: Vector3,
//   S: Vector3
// ): number => P.distanceTo(S);

// export const drawOrbit = (
//   scene: THREE.Scene,
//   primaryBody: CelestialBody,
//   secondaryBody: CelestialBody,
//   elapsedTime: number
// ): void => {
//   // Total Line length should not be greather then 2 * Math.PI * distance from sun
//   const points: Array<THREE.Vector3> = [];
//   // const maxSteps = 5000000;
//   // let steps = 0;
//   let [primaryBodyPosition, secondaryBodyPosition]: [
//     THREE.Vector3,
//     THREE.Vector3
//   ] = [
//     primaryBody.celestialBodyMeshGroup.position.clone(),
//     secondaryBody.celestialBodyMeshGroup.position.clone(),
//   ];
//   let [primaryBodyMass, secondaryBodyMass]: [number, number] = [
//     primaryBody.getMass(),
//     secondaryBody.getMass(),
//   ];
//   let sqrDist = calculateSqrDistance(
//     primaryBodyPosition,
//     secondaryBodyPosition
//   );
//   const maxLineLength =
//     2 * Math.PI * calculateDistance(primaryBodyPosition, secondaryBodyPosition);
//   let lineLength = 0;
//   points.push(secondaryBodyPosition);
//   // while (sqrDist >= 1 && steps < maxSteps) {
//   while (sqrDist >= 1 && lineLength < maxLineLength) {
//     sqrDist = calculateSqrDistance(primaryBodyPosition, secondaryBodyPosition);
//     const forceDir = calculateForceDirection(
//       primaryBodyPosition,
//       secondaryBodyPosition
//     );
//     const force = calculateAttractiveForce(
//       forceDir,
//       primaryBodyMass,
//       secondaryBodyMass,
//       sqrDist
//     );
//     const acceleration = calculateAcceleration(force, secondaryBodyMass);
//     const newVelocity = secondaryBody
//       .getVelocity()
//       .add(
//         calculateUpdatedVelocity(
//           primaryBody.getVelocity(),
//           acceleration,
//           elapsedTime
//         )
//       );
//     points.push(secondaryBodyPosition.add(newVelocity));
//     lineLength += calculateDistance(
//       points[points.length - 2],
//       points[points.length - 1]
//     );

//     if (lineLength >= maxLineLength) break;
//     // steps++;
//   }
//   console.log(points.length);
//   if (!scene.getObjectByName("line")) {
//     console.log(points);
//     const line = drawOrbitLine(points);
//     line.name = "line";
//     scene.add(line);
//   }
// };
