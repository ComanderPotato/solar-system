import { ShaderMaterial, UniformsUtils } from "three";
import { CelestialBodyUniforms, CelestialShader } from "../types/Materials";
import celestialFragment from "./celestialFragment.glsl";
import celestialVertex from "./celestialVertex.glsl";
export function getCelestialShader(celestialUniforms: CelestialBodyUniforms): CelestialShader {
	return new ShaderMaterial({
		uniforms: UniformsUtils.clone(celestialUniforms),
		vertexShader: celestialVertex,
		fragmentShader: celestialFragment,
	}) as CelestialShader;
}
