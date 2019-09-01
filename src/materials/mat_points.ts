import {BasicAttribute} from "../components/com_render_basic.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${BasicAttribute.position}) in vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
        gl_PointSize = 2.0;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    uniform vec4 color;

    out vec4 frag_color;

    void main() {
        frag_color = color;
    }
`;

export function mat_points(gl: WebGL2RenderingContext) {
    return mat_create(gl, gl.POINTS, vertex, fragment);
}
