import { Group, Vector3 } from "three";
import { CelestialBodyParameters } from "../types/CelestialBodyParameters";
import { CelestialMetadata } from "../types/CelestialBodyMetadata";
import { BaseCelestialBodyParameters } from "../types/CelestialBodyParameters";
import { CSS2DObject, Line2 } from "three/examples/jsm/Addons.js";
export default abstract class CelestialBody<T extends CelestialBodyParameters = CelestialBodyParameters> {
	protected _celestialBodyGroup: Group = new Group();
	protected _metadata: CelestialMetadata;
	protected _physicalParameters: T["Physical"];
	protected _secondaryBodyNames?: string[];
	// protected _secondaryBodies?: OrbitingBody[];
	protected _secondaryBodies?: CelestialBody[];
	protected _position: Vector3 = new Vector3();
	public _dummyLastDetailUpdateTime: number = 0;
	public _DUMMY_DETAIL_COOLDOWN: number = 0;
	protected readonly _updateCooldown: number = 500;
	protected _container!: CSS2DObject;
	protected _primaryBody?: CelestialBody;

	protected _orbitGroup: Group = new Group();
	protected _orbits: Map<string, Line2> = new Map();
	constructor(
		baseCelestialBodyParameters: BaseCelestialBodyParameters,
		secondaryBodyNames?: string[],
		primaryBody?: CelestialBody,
	) {
		this._primaryBody = primaryBody;
		this._metadata = baseCelestialBodyParameters.MetaData;
		this._physicalParameters = baseCelestialBodyParameters.Physical;
		this._secondaryBodyNames = baseCelestialBodyParameters.SecondaryNames;
		// this._secondaryBodyNames = secondaryBodyNames;
		this._celestialBodyGroup.name = this._metadata.EnglishName;
		// this._orbitGroup.name = `${this._metadata.EnglishName} Orbit`;
		// this._celestialBodyGroup.add(this._orbitGroup);
	}

	public addOrbit(bodyName: string, orbitLine: Line2): void {
		this._orbits.set(bodyName, orbitLine);
		this._orbitGroup.add(orbitLine);
	}
	// public removeOrbit(bodyName: string): void {
	// 	const orbitLine = this._orbits.get(bodyName);
	// 	if (orbitLine) {
	// 		this._orbitGroup.remove(orbitLine);
	// 		orbitLine.geometry.dispose();
	// 		orbitLine.material.dispose();
	// 		this._orbits.delete(bodyName);
	// 	}
	// }

	set position(position: Vector3) {
		const { x, y, z } = position;
		this._celestialBodyGroup.position.set(x, y, z);
		this._orbitGroup.position.set(x, y, z);
		this._position.set(x, y, z);
	}
	get position(): Vector3 {
		// return this._celestialBodyGroup.position;
		return this._position;
	}
	get metadata(): CelestialMetadata {
		return this._metadata;
	}
	get container(): CSS2DObject {
		return this._container;
	}
	set container(value: CSS2DObject) {
		this._container = value;
	}
	get celestialBodyGroup(): Group {
		return this._celestialBodyGroup;
	}
	get orbitGroup(): Group {
		return this._orbitGroup;
	}
	get orbits(): Map<string, Line2> {
		return this._orbits;
	}
	get secondaryBodyNames(): string[] | undefined {
		return this._secondaryBodyNames;
	}
	get primaryBody(): CelestialBody | undefined {
		return this._primaryBody;
	}
	get secondaryBodies(): CelestialBody[] | undefined {
		return this._secondaryBodies;
	}

	public addSecondary(secondary: CelestialBody): void {
		if (!this._secondaryBodies) this._secondaryBodies = [];
		this._secondaryBodies.push(secondary);
	}

	abstract get physicalParameters(): T["Physical"];

	// protected addToScene = (): void => {
	// 	// AppContext.instance.App.scene.add(this._orbitGroup);
	// 	// AppContext.instance.App.scene.add(this._celestialBodyGroup);
	// };

	// public destroySecondaries = (): void => {
	// 	if (!this._secondaryBodies) return;
	// 	this._secondaryBodies.forEach((secondaryBody) => {
	// 		this.removeOrbit(secondaryBody._metadata.EnglishName);
	// 		secondaryBody.destroy();
	// 	});
	// 	this._secondaryBodies = undefined;
	// };
	// public destroy(): void {
	// 	this._celestialBodyGroup.traverse((child) => {
	// 		if ((child as Mesh).geometry) {
	// 			(child as Mesh).geometry.dispose();
	// 		}
	// 		if ((child as Mesh).material) {
	// 			const material = (child as Mesh).material;
	// 			if (Array.isArray(material)) {
	// 				material.forEach((mat) => mat.dispose());
	// 			} else {
	// 				material.dispose();
	// 			}
	// 		}
	// 	});
	// 	this._container.element.removeEventListener("click", this.handleClick);
	//
	// 	this._celestialBodyGroup.remove(this._container);
	//
	// 	if (this._container.element.parentElement) {
	// 		this._container.element.parentElement.removeChild(this._container.element);
	// 	}
	// 	// AppContext.instance.App.scene.remove(this._container);
	// 	// AppContext.instance.App.scene.remove(this._celestialBodyGroup);
	// }

	// protected initialiseCSS = (): void => {
	// 	const containerElement = document.createElement("div");
	// 	containerElement.style.pointerEvents = "auto";
	// 	// containerElement.className = `pioneer-label-div ${this._metadata.BodyType.toLowerCase()} clickable selection`;
	// 	containerElement.className = `celestial-body--label ${this._metadata.BodyType.toLowerCase()} clickable selection`;
	// 	containerElement.append(this.initialiseIcon(), this.initialiseLabel());
	// 	this._container = new CSS2DObject(containerElement);
	// 	this._container.element.addEventListener("click", this.handleClick);
	// 	this._container.element.addEventListener("mouseover", this.handleHover);
	// 	this._container.element.addEventListener("mouseleave", this.handleLeave);
	// 	this._container.visible;
	// 	// this._container.position.copy(this._position)
	// 	this._celestialBodyGroup.add(this._container);
	// 	// this.updateContainerPosition()
	// };
	// protected initialiseLabel = (): HTMLSpanElement => {
	// 	const labelElement = document.createElement("span");
	// 	labelElement.textContent = this._metadata.EnglishName;
	// 	labelElement.className = `text`;
	// 	return labelElement;
	// };
	// protected initialiseIcon = (): HTMLSpanElement => {
	// 	const iconElement = document.createElement("span");
	// 	// const suffix = this instanceof Moon ? "white" : this._metadata.EnglishName.toLowerCase();
	// 	iconElement.className = `icon icon-circle--${suffix}`;
	// 	return iconElement;
	// };
	// protected handleClick = (): void => {
	// 	// if (AppContext.instance.App.lerpDestination) return;
	// 	// AppContext.instance.App.focusedCelestialBody = this;
	// 	// AppContext.instance.App.controls.target = this._position;
	// };
	// private handleHover = (): void => {
	// 	if (!this._primaryBody) return;
	// 	const colour =
	// 		CelestialBodyColourHover[this._metadata.EnglishName.toUpperCase()] ??
	// 		CelestialBodyColourHover[this._primaryBody.metadata.EnglishName.toUpperCase()];
	//
	// 	(this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineMaterial).color.set(colour);
	// };
	// private handleLeave = (): void => {
	// 	if (!this._primaryBody) return;
	// 	const colour =
	// 		CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ??
	// 		CelestialBodyColour[this._primaryBody.metadata.EnglishName.toUpperCase()];
	// 	(this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineMaterial).color.set(colour);
	// };
	//
	// public updateMeshDetail = () => {
	// 	this.updateDetail();
	// 	if (this._secondaryBodies) {
	// 		this._secondaryBodies.forEach((secondaryBody) => {
	// 			secondaryBody.updateMeshDetail();
	// 		});
	// 	}
	// };

	// Preload for focusedObject
	abstract preLoadDetail(): void;
	abstract updateDetail(): void;
	abstract rotateOnAxis(dt: number): void;
}
