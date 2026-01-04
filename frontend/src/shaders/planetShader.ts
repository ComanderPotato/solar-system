import { ShaderMaterial, UniformsUtils } from "three";
import { CelestialBodyUniforms, CelestialShader } from "../types/Materials";
import planetFragment from "./planetFragment.glsl";
import planetVertex from "./planetVertex.glsl";
export function getCelestialShader(celestialUniforms: CelestialBodyUniforms): CelestialShader {
	return new ShaderMaterial({
		uniforms: UniformsUtils.clone(celestialUniforms),
		vertexShader: planetVertex,
		fragmentShader: planetFragment,
	}) as CelestialShader;
}
