import { DoubleSide, ShaderMaterial, Texture } from "three";
export const getRingMat = (ringTexture: Texture | null, alphaTexture: Texture | null, innerRadius: number, outerRadius: number): ShaderMaterial => {
  const useAlphaTexture = !!alphaTexture;
  const uniforms = {
    ringTexture: { value: ringTexture },
    alphaTexture: { value: alphaTexture },
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
    uniform sampler2D ringTexture;
    uniform sampler2D alphaTexture;
    uniform float innerRadius;
    uniform float outerRadius;

    varying vec3 vPos;

    vec4 color() {
      vec2 uv = vec2(0);
      uv.x = (length(vPos) - innerRadius) / (outerRadius - innerRadius);
      if (uv.x < 0.0 || uv.x > 1.0) {
        discard;
      }
      
      vec4 colorPixel = texture2D(ringTexture, uv);
      float alpha = texture2D(alphaTexture, uv).r;
      return vec4(colorPixel.rgb, colorPixel.a * alpha);
    }

    void main() {
      gl_FragColor = color();
    }
  `;
  const ringMat = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: DoubleSide,
  });
  return ringMat;
};
