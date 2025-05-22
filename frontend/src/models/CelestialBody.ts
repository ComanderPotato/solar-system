import { AxesHelper, BufferGeometry, Color, Group, Line, LineBasicMaterial, Material, Mesh, Vector3 } from "three";
import { BaseCelestialBodyParameters, CelestialBodyParameters, CelestialMetadata, OrbitingBodyParameters, SecondaryOrbitalElements } from "../types";
import { CSS2DObject, Line2, LineMaterial } from "three/examples/jsm/Addons.js";
import { OrbitingBody, CelestialBodyFactory, Moon } from ".";
import { app } from "../core";
import { CelestialBodyColour, CelestialBodyColourHover } from "../utils/constants";

export default abstract class CelestialBody<T extends CelestialBodyParameters = CelestialBodyParameters> {
  protected _celestialBodyGroup: Group = new Group();
  protected _metadata: CelestialMetadata;
  protected _physicalParameters: T["Physical"];
  protected _secondaryBodyParameters?: OrbitingBodyParameters[];
  protected _secondaryBodies?: OrbitingBody[];
  protected _position: Vector3 = new Vector3();
  protected readonly _updateCooldown: number = 500;
  protected _container!: CSS2DObject;
  protected _primaryBody?: CelestialBody;

  protected _orbitGroup: Group = new Group();
  protected _orbits: Map<string, Line2> = new Map();
  constructor(baseCelestialBodyParameters: BaseCelestialBodyParameters, secondaryBodyParameters?: OrbitingBodyParameters[], primaryBody?: CelestialBody) {
    this._primaryBody = primaryBody;
    this._metadata = baseCelestialBodyParameters.MetaData;
    this._physicalParameters = baseCelestialBodyParameters.Physical;
    this._secondaryBodyParameters = baseCelestialBodyParameters.SecondaryBodyParameters;
    this._secondaryBodyParameters = secondaryBodyParameters;
    this._celestialBodyGroup.name = this._metadata.EnglishName;
    this.initialiseCSS();
  }

  public addOrbit = (bodyName: string, orbitLine: Line2): void => {
    this._orbits.set(bodyName, orbitLine);
    this._orbitGroup.add(orbitLine);
  };
  public removeOrbit = (bodyName: string): void => {
    const orbitLine = this._orbits.get(bodyName);
    if (orbitLine) {
      this._orbitGroup.remove(orbitLine);
      orbitLine.geometry.dispose();
      orbitLine.material.dispose();
      this._orbits.delete(bodyName);
    }
  };
  get orbitGroup(): Group {
    return this._orbitGroup;
  }
  get orbits(): Map<string, Line2> {
    return this._orbits;
  }

  get secondaryBodyParameters(): OrbitingBodyParameters[] | undefined {
    return this._secondaryBodyParameters;
  }
  get primaryBody(): CelestialBody | undefined {
    return this._primaryBody;
  }

  get secondaryBodies(): OrbitingBody[] | undefined {
    return this._secondaryBodies;
  }
  public initialiseSecondaryBodies = (secondaryBodyParameters?: CelestialBodyParameters[], secondaryOrbitalElements?: SecondaryOrbitalElements) => {
    if (secondaryBodyParameters) {
      this._secondaryBodies = [...secondaryBodyParameters.map((celestialBody) => CelestialBodyFactory.buildCelestialBody(celestialBody, this) as OrbitingBody)];
    } else if (secondaryOrbitalElements) {
      this._secondaryBodies = this.constructSecondaryBodies(secondaryOrbitalElements);
    }
  };
  private constructSecondaryBodies = (secondaryOrbitalElements: SecondaryOrbitalElements): OrbitingBody[] | undefined => {
    if (!this._secondaryBodyParameters) return;
    const temp = [];
    for (let secondaryBody of this._secondaryBodyParameters) {
      if (secondaryOrbitalElements[secondaryBody.MetaData.EnglishName] == null) continue;
      secondaryBody.Orbital = secondaryOrbitalElements[secondaryBody.MetaData.EnglishName]
      secondaryBody.Orbital.Position = secondaryBody.Orbital.Position.clone().add(this._position);
      temp.push(CelestialBodyFactory.buildCelestialBody(secondaryBody, this) as OrbitingBody);
    }
    return temp;
  };
  // Getters
  public getParameter = <T extends keyof typeof this._physicalParameters>(query: T): (typeof this._physicalParameters)[T] => this._physicalParameters[query];

  get metadata(): CelestialMetadata {
    return this._metadata;
  }
  get position(): Vector3 {
    return this._position;
  }
  abstract get physicalParameters(): T["Physical"];

  protected addToScene = (): void => {
    // this._orbitGroup.position.copy(this._celestialBodyGroup.position);
    // this._celestialBodyGroup.add(this._orbitGroup);
    app().scene.add(this._orbitGroup);
    // this._celestialBodyGroup.add(this._orbitGroup);
    app().scene.add(this._celestialBodyGroup);
    // this._orbitGroup.quaternion.copy(this._celestialBodyGroup.quaternion).invert();
    // app().scene.add(this._orbitGroup);
  };

  protected handleClick = (event: MouseEvent): void => {
    app().focusedCelestialBody = this;
    app().controls.target = this._position;
  };
  protected initialiseCSS = (): void => {
    const containerElement = document.createElement("div");
    containerElement.style.pointerEvents = "auto";
    containerElement.className = `pioneer-label-div ${this._metadata.BodyType.toLowerCase()} clickable selection`;
    containerElement.append(this.initialiseIcon(), this.initialiseLabel());

    // Hold reference to delete later ... or add to this._container.element
    // containerElement.addEventListener("click", this.handleClick);
    this._container = new CSS2DObject(containerElement);
    this._container.element.addEventListener("click", this.handleClick);
    this._container.element.addEventListener("mouseover", this.handleHover);
    this._container.element.addEventListener("mouseleave", this.handleLeave);
    this._celestialBodyGroup.add(this._container);
    // this.updateContainerPosition()
  };
  private handleHover = (event: MouseEvent): void => {
    if (!this._primaryBody) return;
    const colour =
      CelestialBodyColourHover[this._metadata.EnglishName.toUpperCase()] ?? CelestialBodyColourHover[this._primaryBody.metadata.EnglishName.toUpperCase()];
    (this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineMaterial).color.set(colour);
    // (this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineBasicMaterial).color.lerp(new Color(colour), 0.1);
  };
  private handleLeave = (event: MouseEvent): void => {
    if (!this._primaryBody) return;

    const colour = CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ?? CelestialBodyColour[this._primaryBody.metadata.EnglishName.toUpperCase()];
    (this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineMaterial).color.set(colour);
    // (this._primaryBody.orbits.get(this._metadata.EnglishName)!.material as LineBasicMaterial).color.lerp(new Color(colour), 0.1);
  };
  protected initialiseLabel = (): HTMLSpanElement => {
    const labelElement = document.createElement("span");
    labelElement.textContent = this._metadata.EnglishName;
    labelElement.className = `text`;
    return labelElement;
  };
  protected initialiseIcon = (): HTMLSpanElement => {
    const iconElement = document.createElement("span");
    const suffix = this instanceof Moon ? "white" : this._metadata.EnglishName.toLowerCase();
    iconElement.className = `icon icon-circle-${suffix}`;
    return iconElement;
  };
  protected addSecondaryOrbit = (): void => {};
  public destroySecondaries = (): void => {
    if (!this._secondaryBodies) return;
    this._secondaryBodies.forEach((secondaryBody) => {
      this.removeOrbit(secondaryBody._metadata.EnglishName)
      secondaryBody.destroy()
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
    app().scene.remove(this._container);
    app().scene.remove(this._celestialBodyGroup);
  }
  abstract rotateOnAxis(dt: number): void;
}
