uniform float uTime;
uniform bool uHasAtmosphere;
uniform vec3 uSunPosition;

uniform vec3 uAtmosphericPrimary;
uniform vec3 uAtmosphericSecondary;

uniform sampler2D uColor;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uNormal;
uniform sampler2D uBump;
uniform sampler2D uSpecular;

varying vec2 vUv; // UVs (same for both shaders)
varying vec3 vNormal; // Normal in VIEW space
varying vec3 vWorldNormal; // Normal in WORLD space
varying vec3 vViewPos; // Vertex position in VIEW space
varying vec3 vWorldPos; // Vertex position in WORLD space
varying vec3 vLocalPos; // Vertex position in LOCAL/OBJECT space
varying vec3 vCameraPosition;

#define CLOUDS_DENSITY 1.
#define ATMOSPHERIC_INTENSITY 5.
#define ATMOSPHERIC_FALLOFF 5.

float computeCloudsDensity() {
    vec2 rotatedUv = vUv;
    // rotatedUv.x -= uTime * 0.001;
    float cloudsDensity = texture(uClouds, rotatedUv).r;

    if (cloudsDensity == 0.0) return 0.0;

    float cloudsThreshold = 1. - CLOUDS_DENSITY;
    float smoothness = CLOUDS_DENSITY * (1. - CLOUDS_DENSITY);
    cloudsDensity *= smoothstep(cloudsThreshold - smoothness, cloudsThreshold, cloudsDensity);
    return cloudsDensity;
}
//
float computeSpecular() {
    // Fragment normal
    vec3 N = normalize(vWorldNormal);

    // Light direction
    vec3 L = normalize(uSunPosition - vWorldPos);

    // View direction
    vec3 V = normalize(vCameraPosition - vWorldPos);

    // Light reflection
    vec3 R = reflect(-L, N);

    float diffuse = max(dot(N, L), 0.0);

    float specularMap = texture(uSpecular, vUv).r;
    float specular = pow(max(dot(R, V), 0.0), 16.);
    return specular * specularMap;
}
vec3 computeAtmosphere(float specularMask) {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vCameraPosition - vWorldPos);

    // float f = clamp(vReflectionFactor, 0.0, 1.0);
    // Rim lighting: atmosphere strongest when N·V is small
    float rim = 1.0 - max(dot(N, V), 0.0);

    // Control softness
    float scatter = pow(rim, ATMOSPHERIC_FALLOFF);
    vec3 ray = normalize(uSunPosition - vWorldPos);
    vec3 ray2 = normalize(vWorldPos - vCameraPosition);
    float d = clamp(dot(ray, ray2), 0.0, 1.0) / 3.;
    vec3 atmosphereColor = mix(uAtmosphericPrimary, uAtmosphericSecondary, d);
    return atmosphereColor * (scatter * ATMOSPHERIC_INTENSITY);
}
vec3 computeNight(vec3 color) {
    vec3 emission = texture(uNight, vUv).rgb;
    if (emission == vec3(0.0)) return color / 4.;
    return emission;
}
void main() {
    // float sunOrientation = (smoothstep(-2., 0.5, dot(normalize(uSunPosition - vWorldPos), -vWorldPos)));
    // // float sunOrientation = dot(normalize(uSunPosition - vWorldPos), -vWorldPos);
    // float dayMix = smoothstep(0.5, 1., sunOrientation);
    vec3 lightDir = normalize(uSunPosition - vWorldPos);

    float sunOrientation = -dot(vWorldNormal, lightDir);

    float dayMix = smoothstep(0.0, 0.2, sunOrientation);

    vec3 normalizedLight = normalize(uSunPosition);

    vec3 day = texture(uColor, vUv).rgb;

    vec3 night = computeNight(day);
    vec3 baseColor = mix(day, night, dayMix);
    baseColor += computeCloudsDensity();
    float specular = computeSpecular();
    baseColor += specular;
    if (uHasAtmosphere) baseColor += computeAtmosphere(specular);
    gl_FragColor = vec4(baseColor, 1.0);
}
