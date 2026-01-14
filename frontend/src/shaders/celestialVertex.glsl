varying vec2 vUv; // UVs (same for both shaders)
varying vec3 vNormal; // Normal in VIEW space
varying vec3 vWorldNormal; // Normal in WORLD space
varying vec3 vViewPos; // Vertex position in VIEW space
varying vec3 vWorldPos; // Vertex position in WORLD space
varying vec3 vLocalPos; // Vertex position in LOCAL/OBJECT space
varying vec3 vCameraPosition;
varying vec3 vViewDir;

void main() {
    vCameraPosition = cameraPosition;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    vLocalPos = position;
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vViewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vViewPos, 1.0);
}
