import { DoubleSide, ShaderMaterial, Texture } from "three";
import { RingMaterial, RingUniforms } from "../types/Materials";

export function getRingMat(
	ringTexture: Texture | null,
	alphaTexture: Texture | null,
	innerRadius: number,
	outerRadius: number,
): RingMaterial {
	const useAlphaTexture = !!alphaTexture;
	const uniforms: RingUniforms = {
		map: { value: ringTexture },
		alphaMap: { value: alphaTexture },
		useAlphaTexture: { value: useAlphaTexture },
		innerRadius: { value: innerRadius },
		outerRadius: { value: outerRadius },
	};
	const vertexShader: string = `
        varying vec3 vPos;
        
        void main() {
        vPos = position;
        vec3 viewPosition = (modelViewMatrix * vec4(position, 1.)).xyz;
        gl_Position = projectionMatrix * vec4(viewPosition, 1.);
        }
    `;
	const fragmentShader: string = `
    uniform sampler2D map;
    uniform sampler2D alphaMap;
    uniform float innerRadius;
    uniform float outerRadius;

    varying vec3 vPos;

    vec4 color() {
      vec2 uv = vec2(0);
      uv.x = (length(vPos) - innerRadius) / (outerRadius - innerRadius);
      if (uv.x < 0.0 || uv.x > 1.0) {
        discard;
      }
      
      vec4 colorPixel = texture2D(map, uv);
      float alpha = texture2D(alphaMap, uv).r;
      return vec4(colorPixel.rgb, colorPixel.a * alpha);
    }

    void main() {
      gl_FragColor = color();
    }
  `;
	return new ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
		side: DoubleSide,
	}) as RingMaterial;
}
