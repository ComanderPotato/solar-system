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
		uColor: { value: ringTexture },
		uAlpha: { value: alphaTexture },
		uHasAlpha: { value: useAlphaTexture },
		uInnerRadius: { value: innerRadius },
		uOuterRadius: { value: outerRadius },
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
    uniform sampler2D uColor;
    uniform sampler2D uAlpha;
    uniform float uInnerRadius;
    uniform float uOuterRadius;

    varying vec3 vPos;

    vec4 color() {
      vec2 uv = vec2(0);
      uv.x = (length(vPos) - uInnerRadius) / (uOuterRadius - uInnerRadius);
      if (uv.x < 0.0 || uv.x > 1.0) {
        discard;
      }
      
      vec4 colorPixel = texture2D(uColor, uv);
      float alpha = texture2D(uAlpha, uv).r;
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
