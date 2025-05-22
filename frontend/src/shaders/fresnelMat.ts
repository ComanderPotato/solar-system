import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from "three";
let fresnelInstance: ShaderMaterial | null = null
export const getFresnelMat = ( rimHex: number = 0x0088ff, facingHex: number = 0x000000): ShaderMaterial => {
  if(fresnelInstance) return fresnelInstance
  const uniforms = {
    color1: { value: new Color(rimHex) },
    color2: { value: new Color(facingHex) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };
  const vertexShader = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    
    varying float vReflectionFactor;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    
      vec3 I = worldPosition.xyz - cameraPosition;
    
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
    
      gl_Position = projectionMatrix * mvPosition;
    }
    `;
  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    
    varying float vReflectionFactor;
    
    void main() {
      float f = clamp( vReflectionFactor, 0.0, 1.0 );
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
    `;
  fresnelInstance = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: AdditiveBlending,
    // side: DoubleSide maybe add?
    // wireframe: true,
  });
  return fresnelInstance;
}
