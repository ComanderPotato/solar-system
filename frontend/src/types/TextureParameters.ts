export interface TextureParameters {
  Map: string;
  Specular?: string;
  Bump?: string;
  Light?: string;
  Cloud?: string;
  Ring?: string;
  RingAlpha?: string;
}
export interface CelestialTextures {
  Sun: TextureParameters;
  Mercury: TextureParameters;
  Venus: TextureParameters;
  Earth: TextureParameters;
  Mars: TextureParameters;
  Jupiter: TextureParameters;
  Saturn: TextureParameters;
  Uranus: TextureParameters;
  Neptune: TextureParameters;
  Pluto: TextureParameters;
  Moons: {
    Moon: TextureParameters;
    Ceres: TextureParameters;
    Eris: TextureParameters;
    Hauema: TextureParameters;
    MakeMake: TextureParameters;
  };
}
