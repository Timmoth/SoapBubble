in float uNoise;

vec3 hsl2rgb(in vec3 c) { // © 2014 Inigo Quilez, MIT license, see https://www.shadertoy.com/view/lsS3Wc
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
    gl_FragColor = vec4(hsl2rgb(vec3(uNoise, 1.0, 0.5)), 1.0);
}
