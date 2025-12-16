import { ShaderMaterial } from "three";
import { PlanetMaterial, PlanetUniforms } from "../types/Materials";
import planetFragment from "./planetFragment.glsl";
import planetVertex from "./planetVertex.glsl";
// import planetFragment from "./planetFragment.glsl";
// import planetVertex from "./planetVertex.glsl";
export function getPlanetMaterial(planetUniforms: PlanetUniforms): PlanetMaterial {
	return new ShaderMaterial({
		uniforms: planetUniforms,
		vertexShader: planetVertex,
		fragmentShader: planetFragment,
		transparent: true,
	}) as PlanetMaterial;
}
