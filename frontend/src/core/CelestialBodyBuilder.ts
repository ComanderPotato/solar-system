import { CelestialMetadata } from "../types/CelestialBodyMetadata";
import { MoonParameters, OrbitingBodyParameters, PlanetParameters } from "../types/CelestialBodyParameters";
import { OrbitalParameters } from "../types/OrbitalParameters";
import { PhysicalParameters } from "../types/PhysicalParameters";
import CelestialBodyRenderer, { MoonRenderer, PlanetRenderer } from "./CelestialBodyRenderer";

interface DummyCelestialBodyBuilder {
	renderer: CelestialBodyRenderer;
	celestialBody?: DummyCelestialBody;
	build(...data: any): void;
	reset(): void;
}

class PlanetBuilder implements DummyCelestialBodyBuilder {
	celestialBody!: DummyPlanet;
	renderer: PlanetRenderer = new PlanetRenderer();
	build(parameters: PlanetParameters, parentBody: DummyCelestialBody): void {
		this.celestialBody.parameters = parameters;
		this.celestialBody.parentBody = parentBody;
	}

	reset(): void {
		this.celestialBody = new DummyPlanet();
	}
}
class MoonBuilder implements DummyCelestialBodyBuilder {
	celestialBody!: DummyMoon;
	renderer: CelestialBodyRenderer = new MoonRenderer();
	build(parameters: MoonParameters, parentBody: DummyCelestialBody): void {
		this.celestialBody.parameters = parameters;
		this.celestialBody.parentBody = parentBody;
	}

	reset(): void {
		this.celestialBody = new DummyMoon();
	}
}
class DummyCelestialBody {
	_physicalParameters?: PhysicalParameters;
	_metaData?: CelestialMetadata;
}
class DummyOrbiting extends DummyCelestialBody {
	_parentBody?: DummyCelestialBody;
	_orbitalParameters?: OrbitalParameters;
	constructor() {
		super();
	}
	set parameters(parameters: OrbitingBodyParameters) {
		this._orbitalParameters = parameters.Orbital;
		this._physicalParameters = parameters.Physical;
		this._metaData = parameters.MetaData;
	}
	set parentBody(parent: DummyCelestialBody) {
		this.parentBody = parent;
	}
}

class DummyPlanet extends DummyOrbiting {
	constructor() {
		super();
	}
}

class DummyMoon extends DummyOrbiting {
	constructor() {
		super();
	}
}
