import { Group, Mesh, Vector3 } from "three";
// import { CelestialBodyParameters, CelestialMetadata, BaseCelestialBodyParameters, CelestialBodies } from "../types";
import { CelestialBodyParameters } from "../types/CelestialBodyParameters";
import { CelestialMetadata } from "../types/CelestialBodyMetadata";
import { BaseCelestialBodyParameters } from "../types/CelestialBodyParameters";
import { CelestialBodies } from "../types/CelestialBodyParameters";
import { CSS2DObject, Line2, LineMaterial } from "three/examples/jsm/Addons.js";
// import CelestialBodyFactory from "./CelestialBodyFactory";
// import OrbitingBody from "./OrbitingBody";
// import Moon from "./Moon";
// import { AppContext } from "../core";
// import { CelestialBodyColour, CelestialBodyColourHover } from "../utils";
import { CelestialBodyColour, CelestialBodyColourHover } from "../utils/constants";
export default abstract class CelestialBody<T extends CelestialBodyParameters = CelestialBodyParameters> {
	protected _celestialBodyGroup: Group = new Group();
	protected _metadata: CelestialMetadata;
	protected _physicalParameters: T["Physical"];
	protected _secondaryBodyNames?: string[];
	// protected _secondaryBodies?: OrbitingBody[];
	protected _secondaryBodies?: CelestialBody[];
	protected _position: Vector3 = new Vector3();
	protected readonly _updateCooldown: number = 500;
	protected _container!: CSS2DObject;
	protected _primaryBody?: CelestialBody;

	protected _orbitGroup: Group = new Group();
	protected _orbits: Map<string, Line2> = new Map();
	constructor(
		baseCelestialBodyParameters: BaseCelestialBodyParameters,
		secondaryBodyNames?: string[],
		primaryBody?: CelestialBody
	) {
		this._primaryBody = primaryBody;
		this._metadata = baseCelestialBodyParameters.MetaData;
		this._physicalParameters = baseCelestialBodyParameters.Physical;
		this._secondaryBodyNames = baseCelestialBodyParameters.SecondaryBodyNames;
		this._secondaryBodyNames = secondaryBodyNames;
		this._celestialBodyGroup.name = this._metadata.EnglishName;
		this.initialiseCSS();
	}

	public addOrbit = (bodyName: string, orbitLine: Line2): void => {
		this._orbits.set(bodyName, orbitLine);
		this._orbitGroup.add(orbitLine);
	};
	public removeOrbit(bodyName: string): void {
		const orbitLine = this._orbits.get(bodyName);
		if (orbitLine) {
			this._orbitGroup.remove(orbitLine);
			orbitLine.geometry.dispose();
			orbitLine.material.dispose();
			this._orbits.delete(bodyName);
		}
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

	get secondaryBodyParameters(): string[] | undefined {
		return this._secondaryBodyNames;
	}
	get primaryBody(): CelestialBody | undefined {
		return this._primaryBody;
	}

	get secondaryBodies(): CelestialBody[] | undefined {
		return this._secondaryBodies;
	}
	// public initialiseSecondaryBodies = (secondaryBodies: CelestialBodies): void => {
	// 	this._secondaryBodies = [];
	// 	for (const secondaryBody of Object.values(secondaryBodies)) {
	// 		this._secondaryBodies.push(CelestialBodyFactory.buildCelestialBody(secondaryBody, this) as OrbitingBody);
	// 	}
	// };
	// public addSecondaryBody = (secondaryBody: OrbitingBody): void => {
	// 	if (!this._secondaryBodies) this._secondaryBodies = [];
	// 	this._secondaryBodies.push(secondaryBody);
	// };
	// Getters

	get metadata(): CelestialMetadata {
		return this._metadata;
	}
	get position(): Vector3 {
		return this._position;
	}
	abstract get physicalParameters(): T["Physical"];

	protected addToScene = (): void => {
		// AppContext.instance.App.scene.add(this._orbitGroup);
		// AppContext.instance.App.scene.add(this._celestialBodyGroup);
	};

	public destroySecondaries = (): void => {
		if (!this._secondaryBodies) return;
		this._secondaryBodies.forEach((secondaryBody) => {
			this.removeOrbit(secondaryBody._metadata.EnglishName);
			secondaryBody.destroy();
		});
		this._secondaryBodies = undefined;
	};
	public destroy(): void {
		this._celestialBodyGroup.traverse((child) => {
			if ((child as Mesh).geometry) {
				(child as Mesh).geometry.dispose();
			}
			if ((child as Mesh).material) {
				const material = (child as Mesh).material;
				if (Array.isArray(material)) {
					material.forEach((mat) => mat.dispose());
				} else {
					material.dispose();
				}
			}
		});
		this._container.element.removeEventListener("click", this.handleClick);

		this._celestialBodyGroup.remove(this._container);

		if (this._container.element.parentElement) {
			this._container.element.parentElement.removeChild(this._container.element);
		}
		// AppContext.instance.App.scene.remove(this._container);
		// AppContext.instance.App.scene.remove(this._celestialBodyGroup);
	}

	protected initialiseCSS = (): void => {
		const containerElement = document.createElement("div");
		containerElement.style.pointerEvents = "auto";
		// containerElement.className = `pioneer-label-div ${this._metadata.BodyType.toLowerCase()} clickable selection`;
		containerElement.className = `celestial-body--label ${this._metadata.BodyType.toLowerCase()} clickable selection`;
		containerElement.append(this.initialiseIcon(), this.initialiseLabel());
		this._container = new CSS2DObject(containerElement);
		this._container.element.addEventListener("click", this.handleClick);
		this._container.element.addEventListener("mouseover", this.handleHover);
		this._container.element.addEventListener("mouseleave", this.handleLeave);
		this._container.visible;
		// this._container.position.copy(this._position)
		this._celestialBodyGroup.add(this._container);
		// this.updateContainerPosition()
	};
	protected initialiseLabel = (): HTMLSpanElement => {
		const labelElement = document.createElement("span");
		labelElement.textContent = this._metadata.EnglishName;
		labelElement.className = `text`;
		return labelElement;
	};
	protected initialiseIcon = (): HTMLSpanElement => {
		const iconElement = document.createElement("span");
		// const suffix = this instanceof Moon ? "white" : this._metadata.EnglishName.toLowerCase();
		iconElement.className = `icon icon-circle--${suffix}`;
		return iconElement;
	};
	protected handleClick = (): void => {
		// if (AppContext.instance.App.lerpDestination) return;
		// AppContext.instance.App.focusedCelestialBody = this;
		// AppContext.instance.App.controls.target = this._position;
	};
	private handleHover = (): void => {
		if (!this._primaryBody) return;
		const colour =
			CelestialBodyColourHover[this._metadata.EnglishName.toUpperCase()] ??
			CelestialBodyColourHover[this._primaryBody.metadata.EnglishName.toUpperCase()];

		(this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineMaterial).color.set(colour);
	};
	private handleLeave = (): void => {
		if (!this._primaryBody) return;
		const colour =
			CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ??
			CelestialBodyColour[this._primaryBody.metadata.EnglishName.toUpperCase()];
		(this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineMaterial).color.set(colour);
	};

	public updateMeshDetail = () => {
		this.updateDetail();
		if (this._secondaryBodies) {
			this._secondaryBodies.forEach((secondaryBody) => {
				secondaryBody.updateMeshDetail();
			});
		}
	};

	// Preload for focusedObject
	abstract preLoadDetail(): void;
	abstract updateDetail(): void;
	abstract rotateOnAxis(dt: number): void;
}
