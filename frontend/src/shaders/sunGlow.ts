import { AdditiveBlending, Color, DoubleSide, FrontSide, ShaderMaterial, Texture } from "three";
export const sunGlowMat = (): ShaderMaterial => {
//   const uniforms = {
//     ringTexture: { value: ringTexture },
//     alphaTexture: { value: alphaTexture },
//     useAlphaTexture: { value: useAlphaTexture },
//     innerRadius: { value: innerRadius },
//     outerRadius: { value: outerRadius },
//   };
  const vertexShader: string = `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;

            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `;
  const fragmentShader: string = `
    uniform vec3 glowColor;
    uniform float time;
    uniform float intensity;
    uniform float falloff;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
        float glow = dot(vNormal, normalize(cameraPosition - vWorldPosition));
        glow = pow(glow, falloff);

        float pulse = 0.5 + 0.5 * sin(time * 2.0);
        glow *= pulse;

        gl_FragColor = vec4(glowColor * glow * intensity, 1.0);
    }
  `;
  
  const sunGlowMat = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
    glowColor: { value: new Color(1.0, 0.8, 0.3) },
    time: { value: 0 },
    intensity: { value: 1.5 },
    falloff: { value: 2.0 },
  },
  side: FrontSide,
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
  });
  return sunGlowMat;
};
