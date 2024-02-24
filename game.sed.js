"use strict";
(() => {

function draw(Widget, Arg) {
return (game2, entity) => {
game2.World[entity] |= 4 /* Draw */;
game2[2 /* Draw */][entity] = {
Widget,
Arg
};
};
}


function lifespan(Max = Infinity) {
return (game2, entity) => {
game2.World[entity] |= 4194304 /* Lifespan */;
game2[22 /* Lifespan */][entity] = {
Max,
Age: 0
};
};
}


var seed = 1;
function set_seed(new_seed) {
seed = 198706 * new_seed;
}
function rand() {
seed = seed * 16807 % 2147483647;
return (seed - 1) / 2147483646;
}
function integer(min = 0, max = 1) {
return ~~(rand() * (max - min + 1) + min);
}
function element(arr) {
return arr[integer(0, arr.length - 1)];
}


var snd_gold = {
Tracks: [
{
Instrument: [5, , , , , , , , [["triangle", 7, 1, 0, 5, 8]]],
Notes: [86]
},
{
Instrument: [5, , , , , , , , [["triangle", 7, 1, 0, 5, 8]]],
Notes: [96]
}
],
Exit: 0
};


function ease_in_cubic(t) {
return t ** 3;
}
function ease_out_quart(t) {
return 1 - (1 - t) ** 4;
}


function widget_damage(game2, entity, x, y) {
let value = game2[2 /* Draw */][entity].Arg;
let lifespan2 = game2[22 /* Lifespan */][entity];
let relative = lifespan2.Age / lifespan2.Max;
game2.Context.font = `${value / 125 + 1}vmin Impact`;
game2.Context.textAlign = "center";
game2.Context.fillStyle = `rgba(255,232,198,${ease_out_quart(1 - relative)})`;
game2.Context.fillText(value.toFixed(0), x, y - 50 - ease_out_quart(relative) * value / 5);
}


function widget_gold(game2, entity, x, y) {
let value = game2[2 /* Draw */][entity].Arg;
let lifespan2 = game2[22 /* Lifespan */][entity];
let relative = lifespan2.Age / lifespan2.Max;
game2.Context.font = "10vmin Impact";
game2.Context.fillStyle = `rgba(255,255,0,${ease_out_quart(1 - relative)})`;
game2.Context.fillText(
`+ $${value.toLocaleString("en")}`,
x + 100,
y - ease_out_quart(relative) * 150
);
}


function widget_player_hit(game2, entity, x, y) {
let lifespan2 = game2[22 /* Lifespan */][entity];
let opacity = 0.4 * ease_in_cubic(1 - lifespan2.Age / lifespan2.Max);
game2.Context.fillStyle = `rgba(255,79,79,${opacity})`;
game2.Context.fillRect(0, 0, game2.Canvas2.width, game2.Canvas2.height);
}


function cull(Mask) {
return (game2, entity) => {
game2.World[entity] |= 131072 /* Cull */;
game2[17 /* Cull */][entity] = { Mask };
};
}


var Cube = {
Vertices: Float32Array.from([
-0.5,
-0.5,
0.5,
-0.5,
0.5,
0.5,
-0.5,
0.5,
-0.5,
-0.5,
-0.5,
-0.5,
-0.5,
-0.5,
-0.5,
-0.5,
0.5,
-0.5,
0.5,
0.5,
-0.5,
0.5,
-0.5,
-0.5,
0.5,
-0.5,
-0.5,
0.5,
0.5,
-0.5,
0.5,
0.5,
0.5,
0.5,
-0.5,
0.5,
0.5,
-0.5,
0.5,
0.5,
0.5,
0.5,
-0.5,
0.5,
0.5,
-0.5,
-0.5,
0.5,
-0.5,
-0.5,
-0.5,
0.5,
-0.5,
-0.5,
0.5,
-0.5,
0.5,
-0.5,
-0.5,
0.5,
0.5,
0.5,
-0.5,
-0.5,
0.5,
-0.5,
-0.5,
0.5,
0.5,
0.5,
0.5,
0.5
]),
Indices: Uint16Array.from([
0,
1,
2,
0,
2,
3,
4,
5,
6,
4,
6,
7,
8,
9,
10,
8,
10,
11,
12,
13,
14,
12,
14,
15,
16,
17,
18,
16,
18,
19,
20,
21,
22,
20,
22,
23
]),
Normals: Float32Array.from([
-1,
0,
0,
-1,
0,
0,
-1,
0,
0,
-1,
0,
0,
0,
0,
-1,
0,
0,
-1,
0,
0,
-1,
0,
0,
-1,
1,
0,
0,
1,
0,
0,
1,
0,
0,
1,
0,
0,
0,
0,
1,
0,
0,
1,
0,
0,
1,
0,
0,
1,
0,
-1,
0,
0,
-1,
0,
0,
-1,
0,
0,
-1,
0,
0,
1,
0,
0,
1,
0,
0,
1,
0,
0,
1,
0
])
};


var GL_DEPTH_BUFFER_BIT = 256;
var GL_COLOR_BUFFER_BIT = 16384;
var GL_POINTS = 0;
var GL_LINE_LOOP = 2;
var GL_TRIANGLES = 4;
var GL_STATIC_DRAW = 35044;
var GL_DYNAMIC_DRAW = 35048;
var GL_ARRAY_BUFFER = 34962;
var GL_ELEMENT_ARRAY_BUFFER = 34963;
var GL_CULL_FACE = 2884;
var GL_DEPTH_TEST = 2929;
var GL_FRAGMENT_SHADER = 35632;
var GL_VERTEX_SHADER = 35633;
var GL_COMPILE_STATUS = 35713;
var GL_LINK_STATUS = 35714;
var GL_UNSIGNED_SHORT = 5123;
var GL_FLOAT = 5126;


function render_vox(model, Palette) {
return (game2, entity) => {
let VAO = game2.GL.createVertexArray();
game2.GL.bindVertexArray(VAO);
game2.GL.bindBuffer(GL_ARRAY_BUFFER, game2.GL.createBuffer());
game2.GL.bufferData(GL_ARRAY_BUFFER, Cube.Vertices, GL_STATIC_DRAW);
game2.GL.enableVertexAttribArray(1 /* Position */);
game2.GL.vertexAttribPointer(1 /* Position */, 3, GL_FLOAT, false, 0, 0);
game2.GL.bindBuffer(GL_ARRAY_BUFFER, game2.GL.createBuffer());
game2.GL.bufferData(GL_ARRAY_BUFFER, Cube.Normals, GL_STATIC_DRAW);
game2.GL.enableVertexAttribArray(2 /* Normal */);
game2.GL.vertexAttribPointer(2 /* Normal */, 3, GL_FLOAT, false, 0, 0);
game2.GL.bindBuffer(GL_ARRAY_BUFFER, game2.GL.createBuffer());
game2.GL.bufferData(GL_ARRAY_BUFFER, model, GL_STATIC_DRAW);
game2.GL.enableVertexAttribArray(3 /* Offset */);
game2.GL.vertexAttribPointer(3 /* Offset */, 4, GL_FLOAT, false, 0, 0);
game2.GL.vertexAttribDivisor(3 /* Offset */, 1);
game2.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, game2.GL.createBuffer());
game2.GL.bufferData(GL_ELEMENT_ARRAY_BUFFER, Cube.Indices, GL_STATIC_DRAW);
game2.GL.bindVertexArray(null);
game2.World[entity] |= 2 /* Render */;
game2[1 /* Render */][entity] = {
Kind: 1 /* Instanced */,
Material: game2.MaterialInstanced,
VAO,
IndexCount: Cube.Indices.length,
InstanceCount: model.length / 4,
Palette
};
};
}


var EPSILON = 1e-6;


function create() {
let out = new Float32Array(16);
out[0] = 1;
out[5] = 1;
out[10] = 1;
out[15] = 1;
return out;
}
function invert(out, a) {
let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
let b00 = a00 * a11 - a01 * a10;
let b01 = a00 * a12 - a02 * a10;
let b02 = a00 * a13 - a03 * a10;
let b03 = a01 * a12 - a02 * a11;
let b04 = a01 * a13 - a03 * a11;
let b05 = a02 * a13 - a03 * a12;
let b06 = a20 * a31 - a21 * a30;
let b07 = a20 * a32 - a22 * a30;
let b08 = a20 * a33 - a23 * a30;
let b09 = a21 * a32 - a22 * a31;
let b10 = a21 * a33 - a23 * a31;
let b11 = a22 * a33 - a23 * a32;
let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
if (!det) {
return null;
}
det = 1 / det;
out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
return out;
}
function multiply(out, a, b) {
let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
b0 = b[4];
b1 = b[5];
b2 = b[6];
b3 = b[7];
out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
b0 = b[8];
b1 = b[9];
b2 = b[10];
b3 = b[11];
out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
b0 = b[12];
b1 = b[13];
b2 = b[14];
b3 = b[15];
out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
return out;
}
function from_rotation_translation_scale(out, q, v, s) {
let x = q[0], y = q[1], z = q[2], w = q[3];
let x2 = x + x;
let y2 = y + y;
let z2 = z + z;
let xx = x * x2;
let xy = x * y2;
let xz = x * z2;
let yy = y * y2;
let yz = y * z2;
let zz = z * z2;
let wx = w * x2;
let wy = w * y2;
let wz = w * z2;
let sx = s[0];
let sy = s[1];
let sz = s[2];
out[0] = (1 - (yy + zz)) * sx;
out[1] = (xy + wz) * sx;
out[2] = (xz - wy) * sx;
out[3] = 0;
out[4] = (xy - wz) * sy;
out[5] = (1 - (xx + zz)) * sy;
out[6] = (yz + wx) * sy;
out[7] = 0;
out[8] = (xz + wy) * sz;
out[9] = (yz - wx) * sz;
out[10] = (1 - (xx + yy)) * sz;
out[11] = 0;
out[12] = v[0];
out[13] = v[1];
out[14] = v[2];
out[15] = 1;
return out;
}
function ortho_symmetric(out, top, right, near, far) {
out[0] = 1 / right;
out[1] = 0;
out[2] = 0;
out[3] = 0;
out[4] = 0;
out[5] = 1 / top;
out[6] = 0;
out[7] = 0;
out[8] = 0;
out[9] = 0;
out[10] = -2 / (far - near);
out[11] = 0;
out[12] = 0;
out[13] = 0;
out[14] = -(far + near) / (far - near);
out[15] = 1;
return out;
}
function get_forward(out, mat) {
out[0] = mat[8];
out[1] = mat[9];
out[2] = mat[10];
return normalize(out, out);
}
function get_translation(out, mat) {
out[0] = mat[12];
out[1] = mat[13];
out[2] = mat[14];
return out;
}


function add(out, a, b) {
out[0] = a[0] + b[0];
out[1] = a[1] + b[1];
out[2] = a[2] + b[2];
return out;
}
function subtract(out, a, b) {
out[0] = a[0] - b[0];
out[1] = a[1] - b[1];
out[2] = a[2] - b[2];
return out;
}
function scale(out, a, b) {
out[0] = a[0] * b;
out[1] = a[1] * b;
out[2] = a[2] * b;
return out;
}
function normalize(out, a) {
let x = a[0];
let y = a[1];
let z = a[2];
let len = x * x + y * y + z * z;
if (len > 0) {
len = 1 / Math.sqrt(len);
}
out[0] = a[0] * len;
out[1] = a[1] * len;
out[2] = a[2] * len;
return out;
}
function transform_point(out, a, m) {
let x = a[0], y = a[1], z = a[2];
let w = m[3] * x + m[7] * y + m[11] * z + m[15];
w = w || 1;
out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
return out;
}
function length(a) {
let x = a[0];
let y = a[1];
let z = a[2];
return Math.hypot(x, y, z);
}
function lerp(out, a, b, t) {
let ax = a[0];
let ay = a[1];
let az = a[2];
out[0] = ax + t * (b[0] - ax);
out[1] = ay + t * (b[1] - ay);
out[2] = az + t * (b[2] - az);
return out;
}


function multiply2(out, a, b) {
let ax = a[0], ay = a[1], az = a[2], aw = a[3];
let bx = b[0], by = b[1], bz = b[2], bw = b[3];
out[0] = ax * bw + aw * bx + ay * bz - az * by;
out[1] = ay * bw + aw * by + az * bx - ax * bz;
out[2] = az * bw + aw * bz + ax * by - ay * bx;
out[3] = aw * bw - ax * bx - ay * by - az * bz;
return out;
}
function from_euler(out, x, y, z) {
let halfToRad = 0.5 * Math.PI / 180;
x *= halfToRad;
y *= halfToRad;
z *= halfToRad;
let sx = Math.sin(x);
let cx = Math.cos(x);
let sy = Math.sin(y);
let cy = Math.cos(y);
let sz = Math.sin(z);
let cz = Math.cos(z);
out[0] = sx * cy * cz - cx * sy * sz;
out[1] = cx * sy * cz + sx * cy * sz;
out[2] = cx * cy * sz - sx * sy * cz;
out[3] = cx * cy * cz + sx * sy * sz;
return out;
}
function slerp(out, a, b, t) {
let ax = a[0], ay = a[1], az = a[2], aw = a[3];
let bx = b[0], by = b[1], bz = b[2], bw = b[3];
let omega, cosom, sinom, scale0, scale1;
cosom = ax * bx + ay * by + az * bz + aw * bw;
if (cosom < 0) {
cosom = -cosom;
bx = -bx;
by = -by;
bz = -bz;
bw = -bw;
}
if (1 - cosom > EPSILON) {
omega = Math.acos(cosom);
sinom = Math.sin(omega);
scale0 = Math.sin((1 - t) * omega) / sinom;
scale1 = Math.sin(t * omega) / sinom;
} else {
scale0 = 1 - t;
scale1 = t;
}
out[0] = scale0 * ax + scale1 * bx;
out[1] = scale0 * ay + scale1 * by;
out[2] = scale0 * az + scale1 * bz;
out[3] = scale0 * aw + scale1 * bw;
return out;
}


function create_tile(size, colors) {
let offsets = [];
for (let x = 0; x < size; x++) {
for (let y = 0; y < size; y++) {
offsets.push(
x - size / 2 + 0.5,
0.5,
y - size / 2 + 0.5,
rand() > 0.01 ? colors[0] : colors[1]
);
}
}
return Float32Array.from(offsets);
}
function create_block(size, height) {
let offsets = [];
for (let x = 0; x < size; x++) {
for (let y = 0; y < size; y++) {
for (let z = 0; z < height; z++) {
offsets.push(
x - size / 2 + 0.5,
z - size / 2 + 0.5,
y - size / 2 + 0.5,
rand() > 0.4 ? 7 /* mine_ground_1 */ : 8 /* mine_ground_2 */
);
}
}
}
return Float32Array.from(offsets);
}
function create_line(from, to, color) {
let len = length(subtract([], from, to));
let step = 1 / len;
let output = [];
for (let i = 0; i < len; i++) {
output = output.concat([...lerp([], from, to, step * i), color]);
}
return output;
}


var main_palette = [
0.6,
0.4,
0,
0.4,
0.2,
0,
0.14,
0,
0,
0.2,
0.8,
1,
1,
1,
0,
1,
0.8,
0.4,
0.6,
0.4,
0,
0.2,
0.2,
0.2,
0.53,
0.53,
0.53
];
var additional_colors = [
[0.6, 0.4, 0, 0.4, 0.2, 0],
[0, 0.47, 0, 0, 0.33, 0],
[0.67, 0, 0, 0.54, 0, 0],
[0.4, 0.4, 0.4, 0.53, 0.53, 0.53]
];
function get_building_blueprint(game2) {
let palette2 = [...main_palette, ...element(additional_colors)];
let has_tall_front_facade = rand() > 0.4;
let has_windows = rand() > 0.4;
let building_size_x = 20 + integer() * 8;
let building_size_z = 30 + integer(0, 5) * 8;
let building_size_y = 15 + integer(0, 9);
let porch_size = 8;
let offsets = [];
let Children = [];
for (let x = 1; x < building_size_x; x++) {
offsets.push(
...create_line(
[x, 0, building_size_z - 1],
[x, building_size_y, building_size_z - 1],
x % 2 ? 9 /* color_1 */ : 10 /* color_2 */
)
);
}
for (let y = 1; y < building_size_z; y++) {
offsets.push(
...create_line(
[building_size_x, 0, y],
[building_size_x, building_size_y * (has_tall_front_facade ? 1.5 : 1), y],
y % 2 ? 9 /* color_1 */ : 10 /* color_2 */
)
);
offsets.push(
...create_line(
[0, building_size_y, y],
[building_size_x + 1, building_size_y, y],
1 /* wood */
)
);
}
for (let i = -1; i < building_size_x + 3 + porch_size; i++) {
offsets.push(
...create_line([i - 1, 0, 0], [i - 1, 0, building_size_z + 2], 1 /* wood */)
);
}
if (has_windows && has_tall_front_facade) {
let window_width = 5;
let window_height = 4;
for (let offset = window_width; offset < building_size_z - window_width - 1; offset += window_width * 3) {
Children.push({
Rotation: from_euler([], 0, integer(0, 2) * 180, 0),
Translation: [
building_size_x + 1,
building_size_y + window_height / 2,
building_size_z - offset - window_width / 2
],
Using: [render_vox(game2.Models[6 /* WINDOW */]), cull(2 /* Render */)]
});
}
} else {
let banner_height = 5 + integer(0, 2);
let bannner_width = ~~(building_size_z * 0.75);
let banner_offset = ~~((building_size_z - bannner_width) / 2);
for (let x = 2; x < bannner_width; x++) {
for (let y = 0; y < banner_height; y++) {
offsets.push(
building_size_x + 1,
~~(building_size_y * (has_tall_front_facade ? 1.5 : 1)) + y - ~~(banner_height / 2),
banner_offset + x,
rand() > 0.4 || 
x == 2 || x == bannner_width - 1 || y == 0 || y == banner_height - 1 ? 1 /* wood */ : 2 /* dark_wood */
);
}
}
}
for (let i = 0; i < porch_size; i++) {
offsets.push(
...create_line(
[building_size_x + i + 1, building_size_y * 0.75, 1],
[building_size_x + i + 1, building_size_y * 0.75, building_size_z + 1],
1 /* wood */
)
);
}
offsets.push(
...create_line(
[building_size_x + porch_size, 0, 1],
[building_size_x + porch_size, building_size_y * 0.75, 1],
1 /* wood */
),
...create_line(
[building_size_x + porch_size, 0, building_size_z],
[building_size_x + porch_size, building_size_y * 0.75, building_size_z],
1 /* wood */
)
);
let fence_height = 3;
offsets.push(
...create_line(
[building_size_x + porch_size, fence_height, 1],
[building_size_x + porch_size, fence_height, building_size_z],
1 /* wood */
)
);
for (let i = 1; i < building_size_z; i += 2) {
offsets.push(
...create_line(
[building_size_x + porch_size, 0, i],
[building_size_x + porch_size, fence_height + 2, i],
1 /* wood */
)
);
}
let door_height = 8;
let door_width = 8;
for (let i = 0; i < door_width; i++) {
offsets.push(
...create_line(
[building_size_x + 1, 0, building_size_z - i - 8],
[building_size_x + 1, door_height, building_size_z - i - 8],
1 /* wood */
)
);
}
return {
Blueprint: {
Translation: [0, 1.5, 0],

Using: [render_vox(Float32Array.from(offsets), palette2)],
Children
},
Size_x: building_size_x + 3 + porch_size + 1,
Size_z: building_size_z + 2
};
}


function animate(clips) {
return (game2, entity) => {
let States = {};
for (let name in clips) {
let { Keyframes, Flags = 7 /* Default */ } = clips[name];
let Duration = Keyframes[Keyframes.length - 1].Timestamp;
States[name] = {





Keyframes: Keyframes.map((keyframe) => ({ ...keyframe })),
Flags,
Duration,
Time: 0
};
}
game2.World[entity] |= 64 /* Animate */;
game2[6 /* Animate */][entity] = {
States,
Current: States[1 /* Idle */]
};
};
}


var palette = [
1,
1,
1,
1,
1,
1,
1,
1,
0.8,
1,
1,
0.6,
1,
1,
0.4,
1,
1,
0.2,
1,
1,
0,
0,
0.8,
0,
0.47,
0.47,
0.47,
0.53,
0,
0,
0.4,
0.2,
0,
0,
1,
1,
0.93,
0,
0
];


function create_gun(game2) {
return {
Rotation: from_euler([], 270, 0, 0),
Translation: [
0,
-3,

0
],
Using: [render_vox(game2.Models[4 /* GUN1 */])]
};
}


var hat_colors = [
[0.2, 0.2, 0.2],
[0.9, 0.9, 0.9],
[0.53, 0, 0],
[1, 0, 0]
];
var extra_colors = [
[0, 0, 0],
[1, 1, 1],
[1, 1, 0],
[0.9, 0, 0]
];
function get_hat_blueprint(game2) {
let hat_palette = palette.slice();
hat_palette.splice(6, 3, ...element(hat_colors));
hat_palette.splice(9, 3, ...element(extra_colors));
let hat_z = integer(2, 3) * 2;
let hat_x = integer(Math.max(2, hat_z / 2), 5) * 2;
let top_height = integer(1, 3);
let top_width = 2;
let has_extra = top_height > 1;
let has_sides = rand() > 0.4;
let offsets = [];
for (let i = 0; i < hat_z; i++) {
offsets.push(
...create_line(
[-hat_x / 2 + 0.5, 0, -hat_z / 2 + i + 0.5],
[hat_x / 2 + 0.5, 0, -hat_z / 2 + i + 0.5],
2
)
);
}
if (has_sides) {
offsets.push(
...create_line(
[hat_x / 2 - 0.5, 1, -hat_z / 2 + 0.5],
[hat_x / 2 - 0.5, 1, hat_z / 2 + 0.5],
2
),
...create_line(
[-hat_x / 2 + 0.5, 1, -hat_z / 2 + 0.5],
[-hat_x / 2 + 0.5, 1, hat_z / 2 + 0.5],
2
)
);
}
for (let y = 0; y < top_height; y++) {
for (let x = 0; x < top_width; x++) {
offsets.push(
...create_line(
[-top_width / 2 + 0.5, y + 1, -top_width / 2 + x + 0.5],
[top_width / 2 + 0.5, y + 1, -top_width / 2 + x + 0.5],
has_extra && y == 0 ? 3 : 2
)
);
}
}
return {
Translation: [0, 3, 0],





Children: [
{
Using: [
render_vox(Float32Array.from(offsets), hat_palette),
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0
}
]
},
[4 /* Hit */]: {
Keyframes: [
{
Timestamp: 0,
Translation: [0, 0, 0]
},
{
Timestamp: 0.1,
Translation: [0, 2, 0]
},
{
Timestamp: 0.2,
Translation: [0, 0, 0]
}
],
Flags: 0 /* None */
},
[6 /* Select */]: {
Keyframes: [
{
Timestamp: 0,
Translation: [0, 0, 0],
Rotation: [0, 0, 0, 1]
},
{
Timestamp: 0.1,
Translation: [0, 2, 0],
Rotation: [0, 1, 0, 0]
},
{
Timestamp: 0.2,
Translation: [0, 0, 0],
Rotation: [0, 0, 0, -1]
}
],
Flags: 0 /* None */
}
})
]
}
]
};
}


var shirt_colors = [
[1, 0, 0],
[0, 1, 0],
[0, 0, 1],
[1, 1, 1]
];
var skin_colors = [
[1, 0.8, 0.6],
[0.6, 0.4, 0]
];
var hair_colors = [
[1, 1, 0],
[0, 0, 0],
[0.6, 0.4, 0],
[0.4, 0, 0]
];
var pants_colors = [
[0, 0, 0],
[0.53, 0, 0],
[0.6, 0.4, 0.2],
[0.33, 0.33, 0.33]
];
function get_character_blueprint(game2) {
let hat = get_hat_blueprint(game2);
let character_palette = palette.slice();
character_palette.splice(0, 3, ...element(shirt_colors));
character_palette.splice(3, 3, ...element(pants_colors));
character_palette.splice(12, 3, ...element(skin_colors));
character_palette.splice(15, 3, ...element(hair_colors));
return {
Rotation: [0, 1, 0, 0],
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0
}
]
},
[5 /* Die */]: {
Keyframes: [
{
Timestamp: 0,
Translation: [0, 1, 0],
Rotation: [0, 1, 0, 0]
},
{
Timestamp: 1,
Translation: [0, -4, 0],
Rotation: from_euler([], -90, 0, 0),
Ease: ease_out_quart
},
{
Timestamp: 5,
Translation: [0, -9, 0]
}
],
Flags: 0 /* None */
}
})
],
Children: [
{

Translation: [1.5, 0, -5]
},
{
//body
Using: [
render_vox(game2.Models[0 /* BODY */], character_palette),
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 0, 5, 0)
},
{
Timestamp: 0.5,
Rotation: from_euler([], 0, -5, 0)
}
]
},
[2 /* Move */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 0, 5, 0)
},
{
Timestamp: 0.2,
Rotation: from_euler([], 0, -5, 0)
}
]
}
})
],
Children: [hat]
},
{

Translation: [1.5, 0, 0.5],
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 5, 0, 0)
},
{
Timestamp: 0.5,
Rotation: from_euler([], -5, 0, 0)
}
]
},
[2 /* Move */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 60, 0, 0)
},
{
Timestamp: 0.2,
Rotation: from_euler([], -30, 0, 0)
}
]
},
[3 /* Shoot */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 50, 0, 0)
},
{
Timestamp: 0.1,
Rotation: from_euler([], 90, 0, 0),
Ease: ease_out_quart
},
{
Timestamp: 0.13,
Rotation: from_euler([], 110, 0, 0)
},
{
Timestamp: 0.3,
Rotation: from_euler([], 0, 0, 0),
Ease: ease_out_quart
}
],
Flags: 0 /* None */
}
})
],
Children: [
{
Translation: [0, -1, 0],
Using: [render_vox(game2.Models[3 /* HAND */], character_palette)]
},
create_gun(game2)
]
},
{

Translation: [-1.5, 0, 0.5],
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], -5, 0, 0)
},
{
Timestamp: 0.5,
Rotation: from_euler([], 5, 0, 0)
}
]
},
[2 /* Move */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], -30, 0, 0)
},
{
Timestamp: 0.2,
Rotation: from_euler([], 60, 0, 0)
}
]
}
})
],
Children: [
{
Translation: [0, -1, 0],
Using: [render_vox(game2.Models[3 /* HAND */], character_palette)]
}

]
},
{

Translation: [0.5, -2, 0.5],
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 5, 0, 0)
},
{
Timestamp: 1,
Rotation: from_euler([], 5, 0, 0)
}
]
},
[2 /* Move */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], -45, 0, 0)
},
{
Timestamp: 0.2,
Rotation: from_euler([], 45, 0, 0)
}
]
}
})
],
Children: [
{
Translation: [0, -1.5, 0],
Using: [render_vox(game2.Models[2 /* FOOT */], character_palette)]
}
]
},
{

Translation: [-0.5, -2, 0.5],
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], -5, 0, 0)
},
{
Timestamp: 1,
Rotation: from_euler([], -5, 0, 0)
}
]
},
[2 /* Move */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: from_euler([], 45, 0, 0)
},
{
Timestamp: 0.2,
Rotation: from_euler([], -45, 0, 0)
}
]
}
})
],
Children: [
{
Translation: [0, -1.5, 0],
Using: [render_vox(game2.Models[2 /* FOOT */], character_palette)]
}
]
}
]
};
}


function audio_source(Idle) {
return (game2, entity) => {
game2.World[entity] |= 32 /* AudioSource */;
game2[5 /* AudioSource */][entity] = {
Idle,
Time: 0
};
};
}


function collide(Dynamic = true, Size = [1, 1, 1], Flag = 1 /* None */) {
return (game2, EntityId) => {
game2.World[EntityId] |= 256 /* Collide */;
game2[8 /* Collide */][EntityId] = {
EntityId,
New: true,
Dynamic,
Size,
Min: [0, 0, 0],
Max: [0, 0, 0],
Collisions: [],
Flags: Flag
};
};
}


function navigable(X, Y) {
return (game2, entity) => {
game2.World[entity] |= 1024 /* Navigable */;
game2[10 /* Navigable */][entity] = { X, Y };
};
}
function find_navigable(game2, { X, Y }) {
for (let i = 0; i < game2.World.length; i++) {
if (game2.World[i] & 1024 /* Navigable */) {
if (game2[10 /* Navigable */][i].X == X && game2[10 /* Navigable */][i].Y == Y) {
return i;
}
}
}
throw `No entity with coords ${X}, ${Y}.`;
}


function get_cactus_blueprint(game2) {
let model = game2.Models[1 /* CAC3 */];
return {
Translation: [0, integer(2, 5) + 0.5, 0],
Using: [render_vox(model), cull(2 /* Render */)]
};
}


function emit_particles(Lifespan, Frequency) {
return (game2, entity) => {
game2.World[entity] |= 65536 /* EmitParticles */;
game2[16 /* EmitParticles */][entity] = {
Lifespan,
Frequency,
Instances: [],
SinceLast: 0
};
};
}


function light(color = [1, 1, 1], range = 1) {
return (game2, Entity) => {
game2.World[Entity] |= 16 /* Light */;
game2[4 /* Light */][Entity] = [...color, range ** 2];
};
}


function render_particles(color, size) {
return (game2, entity) => {
game2.World[entity] |= 2 /* Render */;
game2[1 /* Render */][entity] = {
Kind: 2 /* Particles */,
Material: game2.MaterialParticles,
Buffer: game2.GL.createBuffer(),
ColorSize: [...color, size]
};
};
}


function shake(Duration = 0) {
return (game2, entity) => {
game2.World[entity] |= 2097152 /* Shake */;
game2[21 /* Shake */][entity] = {
Duration
};
};
}


function trigger(Action2) {
return (game2, entity) => {
game2.World[entity] |= 512 /* Trigger */;
game2[9 /* Trigger */][entity] = {
Action: Action2
};
};
}


function get_campfire_blueprint(game2) {
return {
Translation: [0, 1.5, 0],
Using: [render_vox(game2.Models[5 /* CAMPFIRE */]), cull(2 /* Render */)],
Children: [
{
Using: [
collide(false, [15, 15, 15]),
trigger(12 /* HealCampfire */),
cull(256 /* Collide */ | 512 /* Trigger */)
],
Children: [
{
Using: [
shake(Infinity),
emit_particles(2, 0.1),
render_particles([1, 0, 0], 15),
cull(2097152 /* Shake */ | 65536 /* EmitParticles */ | 2 /* Render */)
]
},
{
Translation: [0, 3, 0],
Using: [light([1, 0.5, 0], 3), cull(16 /* Light */)]
}
]
}
]
};
}


function get_gold_blueprint(game2) {
return {
Translation: [0, 1.5, 0],
Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
Using: [
render_vox(
Float32Array.from(create_line([-1, 0, 0], [1, 0, 0], 4 /* gold */)),
main_palette
),
collide(false, [4, 4, 4]),
trigger(10 /* CollectGold */),
audio_source(),
cull(2 /* Render */ | 256 /* Collide */ | 512 /* Trigger */ | 32 /* AudioSource */)
],
Children: [
{
Translation: [0, 3, 0],
Using: [light([1, 1, 0], 3), cull(16 /* Light */)]
}
]
};
}


function get_block_blueprint(game2) {
let model = create_model();
return {
Translation: [0, 1.5, 0],
Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
Using: [render_vox(model, main_palette), cull(2 /* Render */)]
};
}
function create_model() {
let number_of_elements = integer(1, 4);
let offsets = [];
for (let x = 0; x < number_of_elements; x++) {
let y = integer(-1, 1);
offsets.push(x, 0, y, 0 /* light_wood */);
}
return Float32Array.from(offsets);
}


function get_rock_blueprint(game2) {
let model = game2.Models[7 /* ROCK */];
return {
Translation: [0.1, integer(0, 2) + 0.1, 0.1],
Rotation: from_euler([], integer(0, 3) * 90, integer(0, 3) * 90, integer(0, 3) * 90),
Using: [render_vox(model), cull(2 /* Render */)]
};
}


function get_tile_blueprint(game2, is_walkable, x = 0, y = 0, has_gold = true, colors = [5 /* desert_ground_1 */, 6 /* desert_ground_2 */]) {
let tile_model = create_tile(8, colors);
let tile = {
Using: [
render_vox(tile_model, main_palette),
cull(2 /* Render */),
audio_source(),
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Translation: [0, 0, 0]
}
]
},
[6 /* Select */]: {
Keyframes: [
{
Timestamp: 0,
Translation: [0, 0, 0]
},
{
Timestamp: 0.1,
Translation: [0, -0.5, 0]
},
{
Timestamp: 0.2,
Translation: [0, 0, 0]
}
],
Flags: 0 /* None */
}
})
],
Children: []
};
if (!is_walkable) {
tile.Children.push(
rand() > 0.5 ? get_cactus_blueprint(game2) : rand() > 0.01 ? get_rock_blueprint(game2) : get_campfire_blueprint(game2)
);
} else if (rand() > 0.85) {
tile.Children.push(get_block_blueprint(game2));
} else if (has_gold && rand() < 0.01) {
tile.Children.push(get_gold_blueprint(game2));
}
return {
Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
Translation: [0, 0, 0],
Using: [
collide(false, [8, 1, 8], is_walkable ? 4 /* Navigable */ : 1 /* None */),
cull(256 /* Collide */),
navigable(x, y)
],
Children: [tile]
};
}


function camera_ortho(Radius) {
return (game2, EntityId) => {
game2.World[EntityId] |= 8 /* Camera */;
game2[3 /* Camera */][EntityId] = {
EntityId,
Radius,
Projection: create(),
Unproject: create(),
View: create(),
PV: create()
};
};
}


function mimic(Target) {
return (game2, entity) => {
game2.World[entity] |= 32768 /* Mimic */;
game2[15 /* Mimic */][entity] = { Target };
};
}


function select() {
return (game2, entity) => {
game2.World[entity] |= 2048 /* Select */;
game2[11 /* Select */][entity] = {
Position: []
};
};
}


function create_iso_camera(player) {
return {
Translation: [0, 200, 0],
Using: [mimic(player)],
Children: [
{
Translation: [50, 50, 50],

Rotation: [-0.28, 0.364, 0.116, 0.88],
Children: [
{
Using: [camera_ortho(25), select(), shake()]
}
]
}
]
};
}


function get_mine_entrance_blueprint(game2) {
let wooden_part_length = 26;
let half_entrrance_width = 6;
let half_entrance_height = 14;
let wooden_part_offset = [
...create_line([-2, 2, 0], [-2, 2, wooden_part_length * 2], 8 /* mine_ground_2 */),
...create_line([2, 2, 0], [2, 2, wooden_part_length * 2], 8 /* mine_ground_2 */)
];
for (let i = 0; i < wooden_part_length; i++) {
wooden_part_offset.push(
...create_line(
[-half_entrrance_width, 0, i],
[-half_entrrance_width, half_entrance_height, i],
i % 2 ? 1 /* wood */ : 0 /* light_wood */
),
...create_line(
[half_entrrance_width, 0, i],
[half_entrrance_width, half_entrance_height, i],
i % 2 ? 1 /* wood */ : 0 /* light_wood */
),
...create_line(
[-half_entrrance_width, half_entrance_height, i],
[half_entrrance_width, half_entrance_height, i],
i % 2 ? 0 /* light_wood */ : 1 /* wood */
)
);
}
for (let i = 0; i < wooden_part_length * 2; i += 2) {
wooden_part_offset.push(...create_line([-4, 1, i], [4, 1, i], 0 /* light_wood */));
}
return {
Children: [
{

...get_rock_blueprint(game2),
Scale: [4, 4, 4]
},
{

Translation: [4, 0, 0],
Using: [render_vox(Float32Array.from(wooden_part_offset), main_palette)]
},
{

Translation: [0, 0, 18],
Using: [collide(false, [8, 8, 8]), trigger(7 /* GoToMine */)]
}
]
};
}


function player_control() {
return (game2, entity) => {
game2.World[entity] |= 8192 /* PlayerControl */;
game2[13 /* PlayerControl */][entity] = {};
};
}


function health(Max) {
return (game2, entity) => {
game2.World[entity] |= 16384 /* Health */;
game2[14 /* Health */][entity] = {
Max,
Current: Max
};
};
}


function move(MoveSpeed = 3.5, RotateSpeed = 0.5) {
return (game2, entity) => {
game2.World[entity] |= 128 /* Move */;
game2[7 /* Move */][entity] = {
MoveSpeed,
RotateSpeed
};
};
}


function npc(Friendly = true, Bounty = false) {
return (game2, entity) => {
game2.World[entity] |= 524288 /* NPC */;
game2[19 /* NPC */][entity] = {
Friendly,
Bounty,
LastShot: 0
};
};
}


function shoot() {
return (game2, entity) => {
game2.World[entity] |= 4096 /* Shoot */;
game2[12 /* Shoot */][entity] = {
Target: null
};
};
}


function walking(X = 0, Y = 0) {
return (game2, entity) => {
game2.World[entity] |= 262144 /* Walking */;
game2[18 /* Walking */][entity] = {
X,
Y,
Destination: null,
Route: [],
DestinationX: 0,
DestinationY: 0
};
};
}


var snd_baseline = {
Tracks: [
{
Instrument: [5, "bandpass", 10, 3, , , , , [["triangle", 7, 2, 2, 8, 8]]],
Notes: [69, 74, 69, 74, 69]
},
{
Instrument: [
4,
,
,
,
,
,
,
,
[
[false, 2, 1, 1, 6],
["sine", 9, 2, 2, 7, 7]
]
],
Notes: [
38,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
41,
,
43,
,
,
,
43,
,
,
,
43,
,
,
,
43,
,
41,
,
38,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
41,
,
43,
,
,
,
48,
,
,
,
48,
,
,
,
48,
,
43,
,
38,
,
,
,
38,
,
,
,
38,
,
,
,
41,
,
,
,
36,
,
,
,
36,
,
,
,
36,
,
,
,
33,
,
36,
,
38,
,
,
,
38,
,
,
,
33,
,
,
,
36,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
38
]
}
],
Exit: 19.2
};


var snd_wind = {
Tracks: [
{
Instrument: [7, "lowpass", 8, 6, true, "sine", 9, 2, [[false, 3, 6, 4, 13]]],
Notes: [57]
}
],
Exit: 13
};


function widget_healthbar(game2, entity, x, y) {
let parent = game2[0 /* Transform */][entity].Parent.EntityId;
let health2 = game2[14 /* Health */][parent];
let height = 0.01 * game2.Canvas2.height;
if (game2.World[parent] & 8192 /* PlayerControl */) {
game2.Context.fillStyle = "#0f0";
} else if (game2.World[parent] & 524288 /* NPC */ && game2[19 /* NPC */][parent].Bounty) {
game2.Context.fillStyle = "#ff0";
height *= 2;
} else {
game2.Context.fillStyle = "#f00";
}
game2.Context.fillRect(
x - 0.05 * game2.Canvas2.width,
y,
0.1 * game2.Canvas2.width * health2.Current / health2.Max,
height
);
}


function create_lamp() {
return {
Children: [
{
Translation: [0, 0, 4],
Using: [render_vox(new Float32Array(4), [1, 0.5, 0]), cull(2 /* Render */)]
},
{
Translation: [0, 1, 7],
Using: [cull(16 /* Light */), light([1, 0.5, 0], 5)]
}
]
};
}


function get_mine_wall_blueprint(game2) {
let tile_model = create_block(8, 6);
let Children = [
{
Using: [render_vox(tile_model, main_palette), cull(2 /* Render */)]
}
];
if (rand() < 0.1) {
Children.push(create_lamp());
}
return {
Translation: [0, 4, 0],
Using: [collide(false, [8, 4, 8], 1 /* None */), cull(256 /* Collide */)],
Children
};
}


function world_mine(game2) {
set_seed(game2.BountySeed);
game2.Camera = void 0;
game2.Resized = true;
game2.World = [];
game2.Grid = [];
game2.GL.clearColor(0.8, 0.3, 0.2, 1);
let map_size = 30;
for (let x2 = 0; x2 < map_size; x2++) {
game2.Grid[x2] = [];
for (let y2 = 0; y2 < map_size; y2++) {
if (x2 == 0 || x2 == map_size - 1 || y2 == 0 || y2 == map_size - 1) {
game2.Grid[x2][y2] = NaN;
} else {
game2.Grid[x2][y2] = Infinity;
}
}
}
generate_maze(game2, [0, map_size - 1], [0, map_size - 1], map_size, 0.3);
for (let x2 = 0; x2 < map_size; x2++) {
for (let y2 = 0; y2 < map_size; y2++) {
let is_walkable = game2.Grid[x2][y2] == Infinity;
let tile_blueprint = is_walkable ? get_tile_blueprint(game2, is_walkable, x2, y2, true, [
7 /* mine_ground_1 */,
8 /* mine_ground_2 */
]) : get_mine_wall_blueprint(game2);
game2.Add({
...tile_blueprint,
Translation: [
(-(map_size / 2) + x2) * 8,
tile_blueprint.Translation[1],
(-(map_size / 2) + y2) * 8
]
});
}
}
game2.Add({
Translation: [1, 2, -1],
Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_baseline)]
});
let x = map_size - 2;
let y = map_size - 2;
if (game2.Grid[x] && game2.Grid[x][y] && !isNaN(game2.Grid[x][y])) {
game2.Add({
Scale: [1.5, 1.5, 1.5],
Translation: [(-(map_size / 2) + x) * 8, 7.5, (-(map_size / 2) + y) * 8],
Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
Using: [
npc(false, true),
walking(x, y),
move(integer(12, 16), 0),
collide(true, [7, 7, 7], 8 /* Attackable */),
health(5e3 * game2.ChallengeLevel),
shoot(),
audio_source()
],
Children: [
(set_seed(game2.BountySeed), get_character_blueprint(game2)),
{
Translation: [0, 10, 0],
Using: [draw(widget_healthbar)]
}
]
});
}
let cowboys_count = 20;
for (let i = 0; i < cowboys_count; i++) {
let x2 = integer(4, map_size);
let y2 = integer(4, map_size);
if (game2.Grid[x2] && game2.Grid[x2][y2] && !isNaN(game2.Grid[x2][y2])) {
game2.Add({
Translation: [
(-(map_size / 2) + x2) * 8,
4.3 + Math.random(),
(-(map_size / 2) + y2) * 8
],
Using: [
npc(false),
walking(x2, y2),
move(integer(8, 15)),
collide(true, [7, 7, 7], 8 /* Attackable */),
health(2e3 * game2.ChallengeLevel),
shoot(),
audio_source()
],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 10, 0],
Using: [draw(widget_healthbar)]
}
]
});
}
}
set_seed(game2.PlayerSeed);
game2.Player = game2.Add({
Translation: [-112, 5, -112],
Using: [
player_control(),
walking(1, 1),
move(25, 0),
collide(true, [3, 7, 3], 16 /* Player */),
health(1e4),
shoot(),
audio_source()
],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 25, 0],
Using: [light([1, 1, 1], 20)]
},
{
Translation: [0, 10, 0],
Using: [draw(widget_healthbar)]
}
]
});
game2.Add({
Scale: [map_size * 8, map_size * 2, map_size * 8],
Translation: [-4, -map_size + 0.49, -4],
Using: [
render_vox(Float32Array.from([0, 0, 0, 7 /* mine_ground_1 */]), main_palette)
]
});
game2.Add(create_iso_camera(game2.Player));
}
function generate_maze(game2, [x1, x2], [y1, y2], size, probablity) {
let width = x2 - x1;
let height = y2 - y1;
if (width >= height) {
if (x2 - x1 > 3) {
let bisection = Math.ceil((x1 + x2) / 2);
let max = y2 - 1;
let min = y1 + 1;
let randomPassage = ~~(Math.random() * (max - min + 1)) + min;
let first = false;
let second = false;
if (game2.Grid[y2][bisection] == Infinity) {
randomPassage = max;
first = true;
}
if (game2.Grid[y1][bisection] == Infinity) {
randomPassage = min;
second = true;
}
for (let i = y1 + 1; i < y2; i++) {
if (first && second) {
if (i == max || i == min) {
continue;
}
} else if (i == randomPassage) {
continue;
}
game2.Grid[i][bisection] = Math.random() > probablity ? NaN : Infinity;
}
generate_maze(game2, [x1, bisection], [y1, y2], size, probablity);
generate_maze(game2, [bisection, x2], [y1, y2], size, probablity);
}
} else {
if (y2 - y1 > 3) {
let bisection = Math.ceil((y1 + y2) / 2);
let max = x2 - 1;
let min = x1 + 1;
let randomPassage = ~~(Math.random() * (max - min + 1)) + min;
let first = false;
let second = false;
if (game2.Grid[bisection][x2] == Infinity) {
randomPassage = max;
first = true;
}
if (game2.Grid[bisection][x1] == Infinity) {
randomPassage = min;
second = true;
}
for (let i = x1 + 1; i < x2; i++) {
if (first && second) {
if (i == max || i == min) {
continue;
}
} else if (i == randomPassage) {
continue;
}
game2.Grid[bisection][i] = Math.random() > probablity ? NaN : Infinity;
}
generate_maze(game2, [x1, x2], [y1, bisection], size, probablity);
generate_maze(game2, [x1, x2], [bisection, y2], size, probablity);
}
}
}


function world_desert(game2) {
set_seed(game2.BountySeed);
let map_size = 30;
let entrance_position_x = integer(20, 25) || 20;
let entrance_position_z = integer(10, 20) || 10;
let entrance_width = 4;
let entrance_length = 6;
game2.Camera = void 0;
game2.Resized = true;
game2.World = [];
game2.Grid = [];
game2.GL.clearColor(0.8, 0.3, 0.2, 1);
for (let x = 0; x < map_size; x++) {
game2.Grid[x] = [];
for (let y = 0; y < map_size; y++) {
if (x == 0 || x == map_size - 1 || y == 0 || y == map_size - 1) {
game2.Grid[x][y] = NaN;
} else {
game2.Grid[x][y] = Infinity;
}
}
}
generate_maze(game2, [0, map_size - 1], [0, map_size - 1], map_size, 0.6);
for (let z = entrance_position_z; z < entrance_position_z + entrance_length + 3; z++) {
for (let x = entrance_position_x - 1; x < entrance_position_x + entrance_width - 1; x++) {
if (x == entrance_position_x - 1 + entrance_width - 2 && z !== entrance_position_z || z >= entrance_position_z + entrance_length) {
game2.Grid[x][z] = Infinity;
} else {
game2.Grid[x][z] = NaN;
}
}
}
for (let x = 0; x < map_size; x++) {
for (let y = 0; y < map_size; y++) {
let is_walkable = game2.Grid[x][y] == Infinity;
let tile_blueprint = get_tile_blueprint(game2, is_walkable, x, y);
game2.Add({
...tile_blueprint,
Translation: [
(-(map_size / 2) + x) * 8,
tile_blueprint.Translation[1],
(-(map_size / 2) + y) * 8
]
});
}
}
game2.Add({
Translation: [1, 2, -1],
Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_baseline)],
Children: [
{
Using: [audio_source(snd_wind)]
}
]
});
let cowboys_count = 20;
for (let i = 0; i < cowboys_count; i++) {
let x = integer(4, map_size);
let y = integer(4, map_size);
if (game2.Grid[x] && game2.Grid[x][y] && !isNaN(game2.Grid[x][y])) {
game2.Add({
Translation: [
(-(map_size / 2) + x) * 8,
4.3 + Math.random(),
(-(map_size / 2) + y) * 8
],
Using: [
npc(false),
walking(x, y),
move(integer(8, 15)),
collide(true, [7, 7, 7], 8 /* Attackable */),
health(1500 * game2.ChallengeLevel),
shoot(),
audio_source()
],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 10, 0],
Using: [draw(widget_healthbar)]
}
]
});
}
}
let entrance = get_mine_entrance_blueprint(game2);
game2.Add({
Translation: [
(-(map_size / 2) + entrance_position_x) * 8 + 4,
0,
(-(map_size / 2) + entrance_position_z) * 8 + 4
],
...entrance
});
set_seed(game2.PlayerSeed);
game2.Player = game2.Add({
Translation: [-112, 5, -112],
Using: [
player_control(),
walking(1, 1),
move(25, 0),
collide(true, [3, 7, 3], 16 /* Player */),
health(1e4),
shoot(),
audio_source()
],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 25, 0],
Using: [light([1, 1, 1], 20)]
},
{
Translation: [0, 10, 0],
Using: [draw(widget_healthbar)]
}
]
});
game2.Add({
Scale: [map_size * 8, map_size * 2, map_size * 8],
Translation: [-4, -map_size + 0.49, -4],
Using: [
render_vox(Float32Array.from([0, 0, 0, 5 /* desert_ground_1 */]), main_palette)
]
});
game2.Add(create_iso_camera(game2.Player));
}


function world_store(game2) {
set_seed(game2.PlayerSeed);
game2.Camera = void 0;
game2.Resized = true;
game2.World = [];
game2.GL.clearColor(0.9, 0.7, 0.3, 1);
let player = game2.Add({
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: [0, 0, 0, 1]
},
{
Timestamp: 2,
Rotation: [0, 1, 0, 0]
},
{
Timestamp: 4,
Rotation: [0, 0, 0, -1]
}
],
Flags: 2 /* Loop */
}
})
],
Children: [get_character_blueprint(game2)]
});
game2.Add(create_iso_camera(player));
game2.Add({
Translation: [1, 1, 1],
Using: [light([0.5, 0.5, 0.5], 0)]
});
game2.Add({
Translation: [-15, 15, 15],
Using: [light([1, 1, 1], 25)]
});
}


function get_town_gate_blueprint(game2, gate_size, fence_line) {
let height = 4;
let map_size = 30;
let fence_width = (map_size * 8 - gate_size) / 2;
let fence_offsets = [
...create_line(
[4, height, -map_size * 4],
[4, height, -map_size * 4 + fence_width],
1 /* wood */
),
...create_line(
[4, height, -map_size * 4 + fence_width + gate_size],
[4, height, map_size * 4],
1 /* wood */
)
];
fence_offsets.push(
...create_line(
[4, 0, -map_size * 4 + fence_width],
[4, gate_size * 1.5, -map_size * 4 + fence_width],
1 /* wood */
),
...create_line(
[4, 0, -map_size * 4 + fence_width + gate_size],
[4, gate_size * 1.5, -map_size * 4 + fence_width + gate_size],
1 /* wood */
),
...create_line(
[4, gate_size * 1.5, -map_size * 4 + fence_width],
[4, gate_size * 1.5, -map_size * 4 + fence_width + gate_size + 1],
1 /* wood */
)
);
if (game2.BountySeed) {
for (let i = 0; i < gate_size / 8; i++) {
game2.Grid[fence_line][fence_width / 8 + i] = Infinity;
}
} else {
fence_offsets.push(
...create_line(
[4, height, -map_size * 4 + fence_width],
[4, height, -map_size * 4 + fence_width + gate_size],
1 /* wood */
)
);
}
for (let i = -(map_size / 2 - 1) * 8; i < map_size / 2 * 8; i += 8) {
if (i < -map_size * 4 + fence_width || i > -map_size * 4 + fence_width + gate_size) {
fence_offsets.push(...create_line([4, 0, i], [4, height + 2, i], 1 /* wood */));
}
}
return {
Translation: [(-(map_size / 2) + fence_line) * 8 - 4, 0, -3],
Using: [render_vox(Float32Array.from(fence_offsets), main_palette)],
Children: [
{
Translation: [20, 0, 0],
Using: [collide(false, [8, 8, 800]), trigger(6 /* GoToDesert */)]
}
]
};
}


var snd_music = {
Tracks: [
{
Instrument: [5, "bandpass", 10, 3, , , , , [["triangle", 7, 2, 2, 8, 8]]],
Notes: [
69,
74,
69,
74,
69,
,
,
,
,
,
,
,
65,
,
,
,
67,
,
,
,
62,
,
,
,
,
,
,
,
,
,
,
,
69,
74,
69,
74,
69,
,
,
,
,
,
,
,
65,
,
,
,
67,
,
,
,
72,
,
,
,
,
,
,
,
,
,
,
,
69,
74,
69,
74,
,
,
,
,
,
,
,
,
65,
,
,
,
64,
,
62,
,
60,
,
,
,
,
,
,
,
,
,
,
,
69,
74,
69,
74,
69,
,
,
,
,
,
,
,
67,
,
,
,
62
]
},
{
Instrument: [
3,
,
,
,
,
,
,
,
[
[false, 2, 1, 1, 6],
["sine", 9, 2, 2, 7, 7]
]
],
Notes: [
38,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
41,
,
43,
,
,
,
43,
,
,
,
43,
,
,
,
43,
,
41,
,
38,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
41,
,
43,
,
,
,
48,
,
,
,
48,
,
,
,
48,
,
43,
,
38,
,
,
,
38,
,
,
,
38,
,
,
,
41,
,
,
,
36,
,
,
,
36,
,
,
,
36,
,
,
,
33,
,
36,
,
38,
,
,
,
38,
,
,
,
33,
,
,
,
36,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
,
,
38,
,
38
]
}
],
Exit: 19.2
};


var snd_neigh = {
Tracks: [
{
Instrument: [4, "lowpass", 9, 5, true, "sawtooth", 7, 9, [[false, 7, 3, 3, 7]]],
Notes: [57]
}
],
Exit: 9
};


var QUERY = 1 /* Transform */ | 8192 /* PlayerControl */ | 262144 /* Walking */;
function sys_control_player(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY) == QUERY && game2.Camera) {
update(game2, i);
}
}
}
function update(game2, entity) {
let cursor = game2[11 /* Select */][game2.Camera.EntityId];
if (game2.Input.d0 && cursor.Hit) {
if (cursor.Hit.Flags & 4 /* Navigable */) {
let route = get_route(game2, entity, game2[10 /* Navigable */][cursor.Hit.EntityId]);
if (route) {
game2[18 /* Walking */][entity].Route = route;
}
}
if (cursor.Hit.Flags & 8 /* Attackable */ && game2.World[entity] & 4096 /* Shoot */) {
let other_transform = game2[0 /* Transform */][cursor.Hit.EntityId];
game2[12 /* Shoot */][entity].Target = get_translation([], other_transform.World);
game2[21 /* Shake */][game2.Camera.EntityId].Duration = 0.2;
}
}
if (game2.Input.d2 && game2.World[entity] & 4096 /* Shoot */) {
game2[12 /* Shoot */][entity].Target = cursor.Position;
game2[21 /* Shake */][game2.Camera.EntityId].Duration = 0.2;
}
}
function get_neighbors(game2, { X, Y }) {
let directions = [
{ X: X - 1, Y },

{ X: X + 1, Y },

{ X, Y: Y - 1 },

{ X, Y: Y + 1 },
{ X: X - 1, Y: Y - 1 },

{ X: X + 1, Y: Y - 1 },

{ X: X - 1, Y: Y + 1 },

{ X: X + 1, Y: Y + 1 }
];
return directions.filter(
({ X: X2, Y: Y2 }) => X2 >= 0 && X2 < game2.Grid.length && Y2 >= 0 && Y2 < game2.Grid[0].length
);
}
function calculate_distance(game2, { X, Y }) {
for (let x = 0; x < game2.Grid.length; x++) {
for (let y = 0; y < game2.Grid[0].length; y++) {
if (!Number.isNaN(game2.Grid[x][y])) {
game2.Grid[x][y] = Infinity;
}
}
}
game2.Grid[X][Y] = 0;
let frontier = [{ X, Y }];
let current;
while (current = frontier.shift()) {
if (game2.Grid[current.X][current.Y] < 15) {
for (let cell of get_neighbors(game2, current)) {
if (game2.Grid[cell.X][cell.Y] > game2.Grid[current.X][current.Y] + 1) {
game2.Grid[cell.X][cell.Y] = game2.Grid[current.X][current.Y] + 1;
frontier.push(cell);
}
}
}
}
}
function get_route(game2, entity, destination) {
let walking2 = game2[18 /* Walking */][entity];
calculate_distance(game2, walking2);
if (!(game2.Grid[destination.X][destination.Y] < Infinity)) {
return false;
}
let route = [];
while (!(destination.X == walking2.X && destination.Y == walking2.Y)) {
route.push(destination);
let neighbors = get_neighbors(game2, destination);
for (let i = 0; i < neighbors.length; i++) {
let neighbor_coords = neighbors[i];
if (game2.Grid[neighbor_coords.X][neighbor_coords.Y] < game2.Grid[destination.X][destination.Y]) {
destination = game2[10 /* Navigable */][find_navigable(game2, neighbor_coords)];
}
}
}
return route;
}


function widget_exclamation(game2, entity, x, y) {
let marker = game2[2 /* Draw */][entity].Arg;
let age = game2[22 /* Lifespan */][entity].Age;
game2.Context.font = "10vmin Impact";
game2.Context.textAlign = "center";
game2.Context.fillStyle = "#FFE8C6";
game2.Context.fillText(marker, x, y + Math.sin(age * 5) * 10);
}


function world_town(game2, is_intro, bounty_collected) {
set_seed(game2.ChallengeSeed);
let map_size = 30;
let fence_line = 20;
let back_fence_line = 1;
let fence_gate_size = 16;
let characters_spawning_points = [
0,
map_size / 2 * 30 + map_size / 2,
map_size / 2 * 30 + map_size / 2 + 3,
(map_size / 2 + 3) * 30 + map_size / 2 - 8
];
game2.Camera = void 0;
game2.Resized = true;
game2.World = [];
game2.Grid = [];
game2.GL.clearColor(0.8, 0.3, 0.2, 1);
for (let x = 0; x < map_size; x++) {
game2.Grid[x] = [];
for (let y = 0; y < map_size; y++) {
let is_fence = x == fence_line || x == back_fence_line;
let is_walkable = is_fence || x == back_fence_line - 1 || characters_spawning_points.includes(x * 30 + y) || rand() > 0.04;
game2.Grid[x][y] = is_walkable && !is_fence ? Infinity : NaN;
let tile_blueprint = get_tile_blueprint(game2, is_walkable, x, y, false);
game2.Add({
...tile_blueprint,
Translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8]
});
}
}
game2.Add(get_town_gate_blueprint(game2, fence_gate_size, fence_line));
let buildings_count = 4;
let starting_position = 0;
let building_x_tile = 10;
for (let i = 0; i < buildings_count; i++) {
let building_blu = get_building_blueprint(game2);
let building_x = building_blu.Size_x / 8;
let building_z = building_blu.Size_z / 8;
if (starting_position + building_z > map_size) {
break;
}
game2.Add({
Translation: [
(-(map_size / 2) + building_x_tile) * 8 - 1.5,
0,
(-(map_size / 2) + starting_position) * 8 - 3.5
],
Children: [building_blu.Blueprint]
});
for (let z = starting_position; z < starting_position + building_z; z++) {
for (let x = building_x_tile; x < building_x_tile + building_x; x++) {
game2.Grid[x][z] = NaN;
}
}
starting_position += building_blu.Size_z / 8 + integer(1, 2);
}
let cowboys_count = 20;
for (let i = 0; i < cowboys_count; i++) {
let x = integer(0, map_size);
let y = integer(0, map_size);
if (game2.Grid[x] && game2.Grid[x][y] && !isNaN(game2.Grid[x][y])) {
game2.Add({
Translation: [
(-(map_size / 2) + x) * 8,
4.3 + Math.random(),
(-(map_size / 2) + y) * 8
],
Using: [npc(), walking(x, y), move(integer(15, 25), 0)],
Children: [get_character_blueprint(game2)]
});
}
}
if (!game2.PlayerXY) {
game2.PlayerXY = { X: map_size / 2, Y: map_size / 2 };
}
calculate_distance(game2, game2.PlayerXY);
if (is_intro) {
game2.Add({
Translation: [1, 2, -1],
Using: [light([0.7, 0.7, 0.7], 0), audio_source(snd_wind)]
});
game2.Player = game2.Add({
Using: [walking(map_size / 2, map_size / 2)]
});
} else {
game2.Add({
Translation: [1, 2, -1],
Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_music)],
Children: [
{
Using: [audio_source(snd_neigh)]
},
{
Using: [audio_source(snd_wind)]
}
]
});
game2.Add({
Translation: [0, 5, 24],
Rotation: from_euler([], 0, 90, 0),
Using: [collide(false, [8, 8, 8]), trigger(5 /* GoToWanted */)],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 10, 0],
Using: game2.BountySeed ? [] : [draw(widget_exclamation, "!"), lifespan()]
}
]
});
game2.Add({
Translation: [24, 5, -64],
Using: [collide(false, [8, 8, 8]), trigger(4 /* GoToStore */)],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 10, 0],
Using: [draw(widget_exclamation, "$"), lifespan()]
}
]
});
let player_position = game2[0 /* Transform */][find_navigable(game2, game2.PlayerXY)].Translation;
set_seed(game2.PlayerSeed);
game2.Player = game2.Add({
Translation: [player_position[0], 5, player_position[2]],
Using: [
player_control(),
walking(game2.PlayerXY.X, game2.PlayerXY.Y),
move(25, 0),
collide(true, [3, 7, 3], 16 /* Player */),
health(1e4)
],
Children: [
get_character_blueprint(game2),
{
Translation: [0, 25, 0],
Using: [light([1, 1, 1], 20)]
}
]
});
if (bounty_collected) {
game2.Add({
Using: [draw(widget_gold, bounty_collected), lifespan(4)]
});
}
}
game2.Add({
...get_town_gate_blueprint(game2, 0, back_fence_line + 1),
Rotation: from_euler([], 0, 180, 0)

});
if (game2.Gold > 0 && game2.Gold < 1e4) {
game2.Grid[back_fence_line][15] = Infinity;
}
game2.Add({
Translation: [-120, 5, -120],
Using: [collide(false, [8, 8, 8]), trigger(6 /* GoToDesert */)],
Children: [get_character_blueprint(game2)]
});
game2.Add({
...get_gold_blueprint(game2),
Translation: [56, 1.5, 0]
});
game2.Add({
Scale: [map_size * 8, map_size * 2, map_size * 8],
Translation: [-4, -map_size + 0.49, -4],
Using: [
render_vox(Float32Array.from([0, 0, 0, 5 /* desert_ground_1 */]), main_palette)
]
});
game2.Add(create_iso_camera(game2.Player));
}
function world_intro(game2) {
world_town(game2, true);
}


function world_wanted(game2) {
set_seed(game2.BountySeed);
game2.Camera = void 0;
game2.Resized = true;
game2.World = [];
game2.GL.clearColor(0.9, 0.7, 0.3, 1);
game2.Add({
Using: [
animate({
[1 /* Idle */]: {
Keyframes: [
{
Timestamp: 0,
Rotation: [0, 0, 0, 1]
},
{
Timestamp: 2,
Rotation: [0, 1, 0, 0]
},
{
Timestamp: 4,
Rotation: [0, 0, 0, -1]
}
],
Flags: 2 /* Loop */
}
})
],
Children: [get_character_blueprint(game2)]
});
game2.Add({
Translation: [0, 2, 10],
Using: [camera_ortho(10)]
});
game2.Add({
Translation: [1, 1, 1],
Using: [light([0.5, 0.5, 0.5], 0)]
});
game2.Add({
Translation: [-15, 15, 15],
Using: [light([1, 1, 1], 25)]
});
}


function dispatch(game2, action, args) {
switch (action) {
case 1 /* CompleteBounty */: {
game2.Audio.close();
game2.Audio = new AudioContext();
game2.WorldFunc = world_town;
setTimeout(game2.WorldFunc, 0, game2, false, game2.ChallengeLevel * 1e3);
game2.Gold += game2.ChallengeLevel * 1e3;
game2.ChallengeLevel += 1;
game2.PlayerState = 0 /* Playing */;
game2.PlayerXY = void 0;
game2.BountySeed = 0;
break;
}
case 2 /* EndChallenge */: {
game2.Gold = 0;
game2.ChallengeLevel = 1;
game2.PlayerState = 0 /* Playing */;
game2.PlayerXY = void 0;
game2.BountySeed = 0;
game2.WorldFunc = world_intro;
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 3 /* GoToTown */: {
game2.Audio.close();
game2.Audio = new AudioContext();
game2.WorldFunc = world_town;
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 5 /* GoToWanted */: {
game2.PlayerXY = game2[18 /* Walking */][game2.Player];
game2.BountySeed = game2.ChallengeSeed * game2.ChallengeLevel - 1;
game2.WorldFunc = world_wanted;
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 4 /* GoToStore */: {
game2.MonetizationEnabled = document.monetization && document.monetization.state == "started";
game2.PlayerXY = game2[18 /* Walking */][game2.Player];
game2.WorldFunc = world_store;
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 11 /* ChangePlayerSeed */: {
if (game2.MonetizationEnabled) {
game2.PlayerSeed = Math.random() * 1e4;
}
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 6 /* GoToDesert */: {
game2.Audio.close();
game2.Audio = new AudioContext();
game2.WorldFunc = world_desert;
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 7 /* GoToMine */: {
game2.Audio.close();
game2.Audio = new AudioContext();
game2.WorldFunc = game2.BountySeed ? world_mine : world_town;
setTimeout(game2.WorldFunc, 0, game2);
break;
}
case 8 /* Hit */: {
let [entity, damage] = args;
game2.Add({
Translation: game2[0 /* Transform */][entity].Translation.slice(),
Using: [draw(widget_damage, damage), lifespan(1)]
});
if (game2.World[entity] & 8192 /* PlayerControl */) {
game2.Add({
Using: [draw(widget_player_hit), lifespan(1)]
});
}
break;
}
case 10 /* CollectGold */: {
let [entity] = args;
let value = integer(100, 1e3);
game2.Gold += value;
game2[5 /* AudioSource */][entity].Trigger = snd_gold;
game2.Add({
Translation: game2[0 /* Transform */][game2.Player].Translation.slice(),
Using: [draw(widget_gold, value), lifespan(1)]
});
lifespan(0)(game2, entity);
break;
}
case 9 /* Die */: {
let entity = args[0];
if (game2.World[entity] & 8192 /* PlayerControl */) {
game2.World[entity] &= ~(8192 /* PlayerControl */ | 16384 /* Health */ | 128 /* Move */ | 256 /* Collide */);
game2.PlayerState = 2 /* Defeat */;
} else if (game2.World[entity] & 524288 /* NPC */) {
if (game2[19 /* NPC */][entity].Bounty) {
game2.PlayerState = 1 /* Victory */;
for (let i = 0; i < game2.World.length; i++) {
if (game2.World[i] & 524288 /* NPC */) {
game2.World[i] &= ~262144 /* Walking */;
}
}
}
game2.World[entity] &= ~(524288 /* NPC */ | 16384 /* Health */ | 128 /* Move */ | 256 /* Collide */);
setTimeout(() => game2.Destroy(entity), 5e3);
}
break;
}
case 12 /* HealCampfire */: {
let entity = args[0];
game2.Destroy(entity);
let health2 = game2[14 /* Health */][game2.Player];
health2.Current = health2.Max;
}
}
}


function transform(Translation = [0, 0, 0], Rotation = [0, 0, 0, 1], Scale = [1, 1, 1]) {
return (game2, EntityId) => {
game2.World[EntityId] |= 1 /* Transform */;
game2[0 /* Transform */][EntityId] = {
EntityId,
World: create(),
Self: create(),
Translation,
Rotation,
Scale,
Children: [],
Dirty: true
};
};
}
function* components_of_type(game2, transform2, component) {
if (game2.World[transform2.EntityId] & 1 << component) {
yield game2[component][transform2.EntityId];
}
for (let child of transform2.Children) {
yield* components_of_type(game2, child, component);
}
}


function link(gl, vertex4, fragment4) {
let program = gl.createProgram();
gl.attachShader(program, compile(gl, GL_VERTEX_SHADER, vertex4));
gl.attachShader(program, compile(gl, GL_FRAGMENT_SHADER, fragment4));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, GL_LINK_STATUS)) {
throw new Error(gl.getProgramInfoLog(program));
}
return program;
}
function compile(gl, type, source) {
let shader = gl.createShader(type);
gl.shaderSource(shader, source);
gl.compileShader(shader);
if (!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
throw new Error(gl.getShaderInfoLog(shader));
}
return shader;
}


var vertex = `#version 300 es


uniform mat4 p,q,r;

uniform vec3 s[16];


uniform int t;

uniform vec3 u[100];

uniform vec4 v[100];

layout(location=${1 /* Position */}) in vec3 k;
layout(location=${2 /* Normal */}) in vec3 m;
layout(location=${3 /* Offset */}) in vec4 n;


out vec4 o;

void main(){

vec4 a=q*vec4(k+n.rgb,1.);

vec3 b=normalize((vec4(m,0.)* r).rgb);
gl_Position=p*a;


vec3 c=s[int(n[3])].rgb*.1;
for(int i=0;i<t;i++){
if(v[i].a<1.) {


c+=s[int(n[3])].rgb*v[i].rgb*max(dot(b,normalize(u[i])),0.);
}else{


vec3 ld=u[i]-a.xyz;

float d=length(ld);

c+=s[int(n[3])].rgb*v[i].rgb*max(dot(b,normalize(ld)),0.)*v[i].a/(d*d);
}
}

o=vec4(c,1.);
}
`;
var fragment = `#version 300 es

precision mediump float;


in vec4 o;

out vec4 z;

void main(){
z=o;
}
`;
function mat_instanced(GL) {
let Program = link(GL, vertex, fragment);
let material = {
GL,
Mode: GL_TRIANGLES,
Program,
Uniforms: [
GL.getUniformLocation(Program, "p"),
GL.getUniformLocation(Program, "q"),
GL.getUniformLocation(Program, "r"),
GL.getUniformLocation(Program, "s"),
GL.getUniformLocation(Program, "t"),
GL.getUniformLocation(Program, "u"),
GL.getUniformLocation(Program, "v")
]
};
return material;
}


var vertex2 = `#version 300 es


uniform mat4 p;

uniform vec4 q;


layout(location=${1 /* Origin */}) in vec4 k;


out vec4 o;

void main(){
vec4 a=vec4(k.rgb,1.);
if(q.a<10.) {

a.y+=k.a*2.;
gl_PointSize=mix(q.a,1.,k.a);
}else{

a.y+=k.a*10.;
gl_PointSize=mix(q.a,1.,k.a);
}
gl_Position=p*a;
o=mix(vec4(q.rgb,1.),vec4(1.,1.,0.,1.),k.a);
}
`;
var fragment2 = `#version 300 es

precision mediump float;


in vec4 o;

out vec4 z;

void main(){
z=o;
}
`;
function mat_particles(GL) {
let Program = link(GL, vertex2, fragment2);
let material = {
GL,
Mode: GL_POINTS,
Program,
Uniforms: [GL.getUniformLocation(Program, "p"), GL.getUniformLocation(Program, "q")]
};
return material;
}


var vertex3 = `#version 300 es


uniform mat4 p,q;

layout(location=${1 /* Position */}) in vec3 k;

void main(){
gl_Position=p*q*vec4(k,1.);
}
`;
var fragment3 = `#version 300 es

precision mediump float;

uniform vec4 r;


out vec4 z;

void main() {
z=r;
}
`;
function mat_wireframe(GL) {
let Program = link(GL, vertex3, fragment3);
let material = {
GL,
Mode: GL_LINE_LOOP,
Program,
Uniforms: [
GL.getUniformLocation(Program, "p"),
GL.getUniformLocation(Program, "q"),
GL.getUniformLocation(Program, "r")
]
};
return material;
}


var QUERY2 = 1 /* Transform */ | 4096 /* Shoot */;
function sys_aim(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY2) == QUERY2) {
update2(game2, i);
}
}
}
function update2(game2, entity) {
let shoot2 = game2[12 /* Shoot */][entity];
if (shoot2.Target) {
let transform2 = game2[0 /* Transform */][entity];
let move2 = game2[7 /* Move */][entity];
let forward = get_forward([], transform2.World);
let forward_theta = Math.atan2(forward[2], forward[0]);
let dir = subtract([], shoot2.Target, transform2.Translation);
let dir_theta = Math.atan2(dir[2], dir[0]);
move2.Yaw = from_euler([], 0, (forward_theta - dir_theta) * 57, 0);
}
}


var QUERY3 = 1 /* Transform */ | 64 /* Animate */;
function sys_animate(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY3) == QUERY3) {
update3(game2, i, delta);
}
}
}
function update3(game2, entity, delta) {
let transform2 = game2[0 /* Transform */][entity];
let animate2 = game2[6 /* Animate */][entity];
let next = animate2.Trigger && animate2.States[animate2.Trigger];
if (next && animate2.Current.Flags & 1 /* EarlyExit */) {
animate2.Current = next;
animate2.Trigger = void 0;
}
animate2.Current.Time += delta;
if (animate2.Current.Time > animate2.Current.Duration) {
animate2.Current.Time = animate2.Current.Duration;
}
let current_keyframe = null;
let next_keyframe = null;
for (let keyframe of animate2.Current.Keyframes) {
if (animate2.Current.Time <= keyframe.Timestamp) {
next_keyframe = keyframe;
break;
} else {
current_keyframe = keyframe;
}
}
if (current_keyframe && next_keyframe) {
let keyframe_duration = next_keyframe.Timestamp - current_keyframe.Timestamp;
let current_keyframe_time = animate2.Current.Time - current_keyframe.Timestamp;
let interpolant = current_keyframe_time / keyframe_duration;
if (next_keyframe.Ease) {
interpolant = next_keyframe.Ease(interpolant);
}
if (current_keyframe.Translation && next_keyframe.Translation) {
lerp(
transform2.Translation,
current_keyframe.Translation,
next_keyframe.Translation,
interpolant
);
transform2.Dirty = true;
}
if (current_keyframe.Rotation && next_keyframe.Rotation) {
slerp(
transform2.Rotation,
current_keyframe.Rotation,
next_keyframe.Rotation,
interpolant
);
transform2.Dirty = true;
}
}
if (animate2.Current.Time == animate2.Current.Duration) {
animate2.Current.Time = 0;
if (animate2.Current.Flags & 4 /* Alternate */) {
for (let keyframe of animate2.Current.Keyframes.reverse()) {
keyframe.Timestamp = animate2.Current.Duration - keyframe.Timestamp;
}
}
if (next) {
animate2.Current = next;
animate2.Trigger = void 0;
} else if (!(animate2.Current.Flags & 2 /* Loop */)) {
animate2.Current = animate2.States[1 /* Idle */];
}
}
}


function play_note(audio, instr, note, offset) {
let time = audio.currentTime + offset;
let total_duration = 0;
let master = audio.createGain();
master.gain.value = (instr[0 /* MasterGainAmount */] / 9) ** 3;
let lfa, lfo;
if (instr[5 /* LFOType */]) {
lfo = audio.createOscillator();
lfo.type = instr[5 /* LFOType */];
lfo.frequency.value = (instr[7 /* LFOFreq */] / 3) ** 3;
lfa = audio.createGain();
lfa.gain.value = (instr[6 /* LFOAmount */] + 3) ** 3;
lfo.connect(lfa);
}
if (instr[1 /* FilterType */]) {
let filter = audio.createBiquadFilter();
filter.type = instr[1 /* FilterType */];
filter.frequency.value = 2 ** instr[2 /* FilterFreq */];
filter.Q.value = instr[3 /* FilterQ */] ** 1.5;
if (lfa && instr[4 /* FilterDetuneLFO */]) {
lfa.connect(filter.detune);
}
master.connect(filter);
filter.connect(audio.destination);
} else {
master.connect(audio.destination);
}
for (let source of instr[8 /* Sources */]) {
let amp = audio.createGain();
amp.connect(master);
let gain_amount = (source[1 /* GainAmount */] / 9) ** 3;
let gain_attack = (source[2 /* GainAttack */] / 9) ** 3;
let gain_sustain = (source[3 /* GainSustain */] / 9) ** 3;
let gain_release = (source[4 /* GainRelease */] / 6) ** 3;
let gain_duration = gain_attack + gain_sustain + gain_release;
amp.gain.setValueAtTime(0, time);
amp.gain.linearRampToValueAtTime(gain_amount, time + gain_attack);
amp.gain.setValueAtTime(gain_amount, time + gain_attack + gain_sustain);
amp.gain.exponentialRampToValueAtTime(1e-5, time + gain_duration);
if (source[0]) {
let hfo = audio.createOscillator();
hfo.type = source[0 /* SourceType */];
hfo.connect(amp);
hfo.detune.value = 3 * (source[5 /* DetuneAmount */] - 7.5) ** 3;
if (lfa && source[6 /* DetuneLFO */]) {
lfa.connect(hfo.detune);
}
let freq = 440 * 2 ** ((note - 69) / 12);
if (source[7 /* FreqEnabled */]) {
let freq_attack = (source[8 /* FreqAttack */] / 9) ** 3;
let freq_sustain = (source[9 /* FreqSustain */] / 9) ** 3;
let freq_release = (source[10 /* FreqRelease */] / 6) ** 3;
hfo.frequency.linearRampToValueAtTime(0, time);
hfo.frequency.linearRampToValueAtTime(freq, time + freq_attack);
hfo.frequency.setValueAtTime(freq, time + freq_attack + freq_sustain);
hfo.frequency.exponentialRampToValueAtTime(
1e-5,
time + freq_attack + freq_sustain + freq_release
);
} else {
hfo.frequency.setValueAtTime(freq, time);
}
hfo.start(time);
hfo.stop(time + gain_duration);
} else {
let noise = audio.createBufferSource();
noise.buffer = lazy_noise_buffer(audio);
noise.loop = true;
noise.connect(amp);
noise.start(time);
noise.stop(time + gain_duration);
}
if (gain_duration > total_duration) {
total_duration = gain_duration;
}
}
if (lfo) {
lfo.start(time);
lfo.stop(time + total_duration);
}
}
var noise_buffer;
function lazy_noise_buffer(audio) {
if (!noise_buffer) {
noise_buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
let channel = noise_buffer.getChannelData(0);
for (let i = 0; i < channel.length; i++) {
channel[i] = Math.random() * 2 - 1;
}
}
return noise_buffer;
}


function sys_audio(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if (game2.World[i] & 32 /* AudioSource */) {
update4(game2, i, delta);
}
}
}
function update4(game2, entity, delta) {
let audio_source2 = game2[5 /* AudioSource */][entity];
let can_exit = !audio_source2.Current || audio_source2.Time > audio_source2.Current.Exit;
if (audio_source2.Trigger && can_exit) {
for (let track of audio_source2.Trigger.Tracks) {
for (let i = 0; i < track.Notes.length; i++) {
if (track.Notes[i]) {
play_note(game2.Audio, track.Instrument, track.Notes[i], i * 0.15);
}
}
}
audio_source2.Current = audio_source2.Trigger;
audio_source2.Time = 0;
} else {
audio_source2.Time += delta;
}
audio_source2.Trigger = audio_source2.Idle;
}


var QUERY4 = 1 /* Transform */ | 8 /* Camera */;
function sys_camera(game2, delta) {
if (game2.Canvas3.width != game2.Canvas3.clientWidth || game2.Canvas3.height != game2.Canvas3.clientHeight) {
game2.Canvas3.width = game2.Canvas2.width = game2.Canvas3.clientWidth;
game2.Canvas3.height = game2.Canvas2.height = game2.Canvas3.clientHeight;
game2.Resized = true;
}
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY4) == QUERY4) {
update5(game2, i);
}
}
}
function update5(game2, entity) {
let transform2 = game2[0 /* Transform */][entity];
let camera = game2[3 /* Camera */][entity];
game2.Camera = camera;
if (game2.Resized) {
let aspect = game2.Canvas3.width / game2.Canvas3.height;
if (aspect > 1) {
ortho_symmetric(camera.Projection, camera.Radius, camera.Radius * aspect, 1, 500);
} else {
ortho_symmetric(camera.Projection, camera.Radius / aspect, camera.Radius, 1, 500);
}
invert(camera.Unproject, camera.Projection);
}
invert(camera.View, transform2.World);
multiply(camera.PV, camera.Projection, camera.View);
}


var QUERY5 = 1 /* Transform */ | 256 /* Collide */;
function sys_collide(game2, delta) {
let static_colliders = [];
let dynamic_colliders = [];
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY5) == QUERY5) {
let transform2 = game2[0 /* Transform */][i];
let collider = game2[8 /* Collide */][i];
collider.Collisions = [];
if (collider.New) {
collider.New = false;
compute_aabb(transform2, collider);
} else if (collider.Dynamic) {
compute_aabb(transform2, collider);
dynamic_colliders.push(collider);
} else {
static_colliders.push(collider);
}
}
}
for (let i = 0; i < dynamic_colliders.length; i++) {
check_collisions(dynamic_colliders[i], static_colliders, static_colliders.length);
check_collisions(dynamic_colliders[i], dynamic_colliders, i);
}
}
function check_collisions(collider, colliders, length2) {
for (let i = 0; i < length2; i++) {
let other = colliders[i];
if (intersect_aabb(collider, other)) {
collider.Collisions.push(other);
other.Collisions.push(collider);
}
}
}
function compute_aabb(transform2, collide2) {
let world_position = get_translation([], transform2.World);
let half = scale([], collide2.Size, 0.5);
subtract(collide2.Min, world_position, half);
add(collide2.Max, world_position, half);
}
function intersect_aabb(a, b) {
return a.Min[0] < b.Max[0] && a.Max[0] > b.Min[0] && a.Min[1] < b.Max[1] && a.Max[1] > b.Min[1] && a.Min[2] < b.Max[2] && a.Max[2] > b.Min[2];
}


var QUERY6 = 1 /* Transform */ | 524288 /* NPC */ | 262144 /* Walking */;
function sys_control_ai(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY6) == QUERY6) {
update6(game2, i, delta);
}
}
}
function update6(game2, entity, delta) {
let walking2 = game2[18 /* Walking */][entity];
let is_friendly = game2[19 /* NPC */][entity].Friendly;
let can_shoot = game2[19 /* NPC */][entity].LastShot <= 0;
let player_walking = game2[18 /* Walking */][game2.Player];
let distance_to_player = Math.abs(
game2.Grid[walking2.X][walking2.Y] - game2.Grid[player_walking.X][player_walking.Y]
);
let route = [];
if (!walking2.Route.length && !walking2.Destination) {
if (is_friendly || distance_to_player > 5) {
let destination_depth = integer(1, 15);
while (destination_depth == game2.Grid[walking2.X][walking2.Y]) {
destination_depth = integer(1, 15);
}
route = get_random_route(game2, entity, destination_depth);
} else {
route = get_route(game2, game2.Player, walking2);
if (route) {
route.pop();
route.pop();
route = route.reverse();
}
}
if (route && route.length > 1) {
walking2.Route = route;
}
}
if (!is_friendly && game2.World[entity] & 4096 /* Shoot */) {
if (distance_to_player < 4 && can_shoot) {
game2[12 /* Shoot */][entity].Target = game2[0 /* Transform */][game2.Player].Translation;
game2[19 /* NPC */][entity].LastShot = 0.5;
walking2.Route = [];
} else {
game2[19 /* NPC */][entity].LastShot -= delta;
}
}
}
function get_random_route(game2, entity, destination_depth) {
let walking2 = game2[18 /* Walking */][entity];
let current_cell = game2[10 /* Navigable */][find_navigable(game2, walking2)];
let current_depth = game2.Grid[walking2.X][walking2.Y];
let modifier = destination_depth > current_depth ? 1 : -1;
let route = [];
if (!(current_depth < 16)) {
return false;
}
while (destination_depth !== current_depth) {
if (route.length > 10) {
return false;
}
route.push(current_cell);
let neighbors = get_neighbors(game2, current_cell).sort(() => 0.5 - Math.random());
for (let i = 0; i < neighbors.length; i++) {
let neighbor_coords = neighbors[i];
if (game2.Grid[neighbor_coords.X][neighbor_coords.Y] == current_depth + 1 * modifier) {
current_cell = game2[10 /* Navigable */][find_navigable(game2, neighbor_coords)];
current_depth = game2.Grid[current_cell.X][current_cell.Y];
break;
}
}
}
return route.reverse();
}


var QUERY7 = 1 /* Transform */ | 256 /* Collide */ | 128 /* Move */ | 1048576 /* Projectile */;
function sys_control_projectile(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY7) == QUERY7) {
update7(game2, i);
}
}
}
function update7(game2, entity) {
let projectile2 = game2[20 /* Projectile */][entity];
let move2 = game2[7 /* Move */][entity];
let collide2 = game2[8 /* Collide */][entity];
if (collide2.Collisions.length > 0) {
game2.Destroy(entity);
for (let collider of collide2.Collisions) {
if (game2.World[collider.EntityId] & 16384 /* Health */) {
game2[14 /* Health */][collider.EntityId].Damage = Math.random() * projectile2.Damage + Math.random() * projectile2.Damage;
}
}
} else {
move2.Direction = get_forward([], game2[0 /* Transform */][entity].World);
}
}


var QUERY8 = 1 /* Transform */ | 131072 /* Cull */;
function sys_cull(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY8) == QUERY8 && game2.Camera) {
update8(game2, i);
}
}
}
var position = [0, 0, 0];
function update8(game2, entity) {
let cull2 = game2[17 /* Cull */][entity];
get_translation(position, game2[0 /* Transform */][entity].World);
transform_point(position, position, game2.Camera.View);
if (


Math.abs(position[0]) > 1 / game2.Camera.Projection[0] + 8 || 

Math.abs(position[1]) > 1 / game2.Camera.Projection[5] + 8
) {
game2.World[entity] &= ~cull2.Mask;
} else {
game2.World[entity] |= cull2.Mask;
}
}


var Line = {
Vertices: Float32Array.from([0, 0, 0, 0, 0, 10]),
Indices: Uint16Array.from([1, 2]),
Normals: Float32Array.from([])
};


var QUERY9 = 1 /* Transform */ | 4 /* Draw */;
function sys_draw(game2, delta) {
game2.Context.clearRect(0, 0, game2.Canvas2.width, game2.Canvas2.height);
let position2 = [];
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY9) == QUERY9) {
get_translation(position2, game2[0 /* Transform */][i].World);
transform_point(position2, position2, game2.Camera.PV);
game2[2 /* Draw */][i].Widget(
game2,
i,
0.5 * (position2[0] + 1) * game2.Canvas3.width,
0.5 * (-position2[1] + 1) * game2.Canvas3.height
);
}
}
}


var counter = document.getElementById("fps");
function sys_framerate(game2, delta) {
if (counter) {
counter.textContent = (1 / delta).toFixed();
}
}


var QUERY10 = 16384 /* Health */;
function sys_health(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY10) == QUERY10) {
update9(game2, i);
}
}
}
function update9(game2, entity) {
let health2 = game2[14 /* Health */][entity];
if (health2.Damage) {
dispatch(game2, 8 /* Hit */, [entity, health2.Damage]);
health2.Current -= health2.Damage;
health2.Damage = 0;
for (let animate2 of components_of_type(
game2,
game2[0 /* Transform */][entity],
6 /* Animate */
)) {
animate2.Trigger = 4 /* Hit */;
}
}
if (health2.Current <= 0) {
health2.Current = 0;
dispatch(game2, 9 /* Die */, [entity]);
for (let animate2 of components_of_type(
game2,
game2[0 /* Transform */][entity],
6 /* Animate */
)) {
animate2.Trigger = 5 /* Die */;
}
}
}


var QUERY11 = 1 /* Transform */ | 4194304 /* Lifespan */;
function sys_lifespan(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY11) == QUERY11) {
update10(game2, i, delta);
}
}
}
function update10(game2, entity, delta) {
let lifespan2 = game2[22 /* Lifespan */][entity];
lifespan2.Age += delta;
if (lifespan2.Age > lifespan2.Max) {
game2.Destroy(entity);
}
}


var QUERY12 = 1 /* Transform */ | 32768 /* Mimic */;
function sys_mimic(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY12) == QUERY12) {
let follower_transform = game2[0 /* Transform */][i];
let follower_mimic = game2[15 /* Mimic */][i];
let target_transform = game2[0 /* Transform */][follower_mimic.Target];
let target_world_position = get_translation([], target_transform.World);
follower_transform.Translation = lerp(
[],
follower_transform.Translation,
target_world_position,
0.1
);
follower_transform.Dirty = true;
}
}
}


var QUERY13 = 1 /* Transform */ | 128 /* Move */;
function sys_move(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY13) == QUERY13) {
update11(game2, i, delta);
}
}
}
function update11(game2, entity, delta) {
let transform2 = game2[0 /* Transform */][entity];
let move2 = game2[7 /* Move */][entity];
if (move2.Direction) {
scale(move2.Direction, move2.Direction, move2.MoveSpeed * delta);
add(transform2.Translation, transform2.Translation, move2.Direction);
transform2.Dirty = true;
move2.Direction = void 0;
for (let animate2 of components_of_type(game2, transform2, 6 /* Animate */)) {
animate2.Trigger = 2 /* Move */;
}
} else {
for (let animate2 of components_of_type(game2, transform2, 6 /* Animate */)) {
animate2.Trigger = 1 /* Idle */;
}
}
if (move2.Yaw) {
multiply2(transform2.Rotation, move2.Yaw, transform2.Rotation);
transform2.Dirty = true;
move2.Yaw = void 0;
}
}


var QUERY14 = 1 /* Transform */ | 128 /* Move */ | 262144 /* Walking */;
function sys_navigate(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY14) == QUERY14) {
update12(game2, i);
}
}
}
function update12(game2, entity) {
let walking2 = game2[18 /* Walking */][entity];
if (!walking2.Destination) {
if (walking2.Route.length) {
let dest = walking2.Route.pop();
let destination_entity = find_navigable(game2, dest);
walking2.DestinationX = dest.X;
walking2.DestinationY = dest.Y;
walking2.Destination = game2[0 /* Transform */][destination_entity].Translation;
}
}
if (walking2.Destination) {
let transform2 = game2[0 /* Transform */][entity];
let world_destination = [
walking2.Destination[0],
transform2.Translation[1],
walking2.Destination[2]
];
let dir = subtract([], world_destination, transform2.Translation);
if (length(dir) < 1) {
walking2.X = walking2.DestinationX;
walking2.Y = walking2.DestinationY;
walking2.Destination = null;
}
let move2 = game2[7 /* Move */][entity];
move2.Direction = normalize(dir, dir);
let forward = get_forward([], transform2.World);
let forward_theta = Math.atan2(forward[2], forward[0]);
let dir_theta = Math.atan2(dir[2], dir[0]);
move2.Yaw = from_euler([], 0, (forward_theta - dir_theta) * 57, 0);
}
}


var QUERY15 = 1 /* Transform */ | 65536 /* EmitParticles */;
function sys_particles(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY15) == QUERY15) {
update13(game2, i, delta);
}
}
}
function update13(game2, entity, delta) {
let emitter = game2[16 /* EmitParticles */][entity];
let transform2 = game2[0 /* Transform */][entity];
emitter.SinceLast += delta;
if (emitter.SinceLast > emitter.Frequency) {
emitter.SinceLast = 0;
let origin = get_translation([], transform2.World);
emitter.Instances.push(...origin, 0);
}
for (let i = 0; i < emitter.Instances.length; ) {
emitter.Instances[i + 3] += delta / emitter.Lifespan;
if (emitter.Instances[i + 3] > 1) {
emitter.Instances.splice(i, 4);
} else {
i += 4;
}
}
}


function sys_performance(game2, delta, target) {
if (target) {
target.textContent = `${delta.toFixed(1)} ms`;
}
}


var QUERY16 = 1 /* Transform */ | 2 /* Render */;
var LIGHTS = 1 /* Transform */ | 16 /* Light */;
function sys_render(game2, delta) {
game2.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
if (game2.Resized) {
game2.GL.viewport(0, 0, game2.Canvas3.width, game2.Canvas3.height);
}
let light_positions = [];
let light_details = [];
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & LIGHTS) == LIGHTS) {
let transform2 = game2[0 /* Transform */][i];
let position2 = get_translation([], transform2.World);
light_positions.push(...position2);
light_details.push(...game2[4 /* Light */][i]);
}
}
let current_material = null;
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY16) == QUERY16) {
let transform2 = game2[0 /* Transform */][i];
let render = game2[1 /* Render */][i];
if (render.Material !== current_material) {
current_material = render.Material;
game2.GL.useProgram(current_material.Program);
game2.GL.uniformMatrix4fv(current_material.Uniforms[0], false, game2.Camera.PV);
switch (render.Kind) {
case 1 /* Instanced */:
game2.GL.uniform1i(
current_material.Uniforms[4 /* LightCount */],
light_positions.length / 3
);
game2.GL.uniform3fv(
current_material.Uniforms[5 /* LightPositions */],
light_positions
);
game2.GL.uniform4fv(
current_material.Uniforms[6 /* LightDetails */],
light_details
);
break;
}
}
switch (render.Kind) {
case 0 /* Basic */:
draw_basic(game2, transform2, render);
break;
case 1 /* Instanced */:
draw_instanced(game2, transform2, render);
break;
case 2 /* Particles */: {
let emitter = game2[16 /* EmitParticles */][i];
if (emitter.Instances.length) {
draw_particles(game2, render, emitter);
}
break;
}
}
}
}
}
function draw_basic(game2, transform2, render) {
game2.GL.uniformMatrix4fv(render.Material.Uniforms[1 /* World */], false, transform2.World);
game2.GL.uniform4fv(render.Material.Uniforms[2 /* Color */], render.Color);
game2.GL.bindVertexArray(render.VAO);
game2.GL.drawElements(render.Material.Mode, render.Count, GL_UNSIGNED_SHORT, 0);
game2.GL.bindVertexArray(null);
}
function draw_instanced(game2, transform2, render) {
game2.GL.uniformMatrix4fv(
render.Material.Uniforms[1 /* World */],
false,
transform2.World
);
game2.GL.uniformMatrix4fv(
render.Material.Uniforms[2 /* Self */],
false,
transform2.Self
);
game2.GL.uniform3fv(
render.Material.Uniforms[3 /* Palette */],
render.Palette || game2.Palette
);
game2.GL.bindVertexArray(render.VAO);
game2.GL.drawElementsInstanced(
render.Material.Mode,
render.IndexCount,
GL_UNSIGNED_SHORT,
0,
render.InstanceCount
);
game2.GL.bindVertexArray(null);
}
function draw_particles(game2, render, emitter) {
game2.GL.uniform4fv(render.Material.Uniforms[1 /* Detail */], render.ColorSize);
game2.GL.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
game2.GL.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
game2.GL.enableVertexAttribArray(1 /* Origin */);
game2.GL.vertexAttribPointer(1 /* Origin */, 4, GL_FLOAT, false, 4 * 4, 0);
game2.GL.drawArrays(render.Material.Mode, 0, emitter.Instances.length / 4);
}


function raycast_aabb(colliders, origin, direction) {
let nearest_t = Infinity;
let nearest_i = null;
for (let i = 0; i < colliders.length; i++) {
let t = distance(origin, direction, colliders[i]);
if (t < nearest_t) {
nearest_t = t;
nearest_i = i;
}
}
if (nearest_i !== null) {
return colliders[nearest_i];
}
}
function distance(origin, direction, aabb) {
let max_lo = -Infinity;
let min_hi = Infinity;
for (let i = 0; i < 3; i++) {
let lo = (aabb.Min[i] - origin[i]) / direction[i];
let hi = (aabb.Max[i] - origin[i]) / direction[i];
if (lo > hi) {
[lo, hi] = [hi, lo];
}
if (hi < max_lo || lo > min_hi) {
return Infinity;
}
if (lo > max_lo)
max_lo = lo;
if (hi < min_hi)
min_hi = hi;
}
return max_lo > min_hi ? Infinity : max_lo;
}


var snd_click = {
Tracks: [
{
Instrument: [7, "lowpass", 8, 8, , , , , [["sine", 4, 1, 0, 3, 8]]],
Notes: [69]
}
],
Exit: 0.2
};


var QUERY17 = 1 /* Transform */ | 8 /* Camera */ | 2048 /* Select */;
var TARGET = 1 /* Transform */ | 256 /* Collide */;
var ANIMATED = 4 /* Navigable */ | 16 /* Player */;
function sys_select(game2, delta) {
let colliders = [];
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & TARGET) == TARGET) {
if (game2[8 /* Collide */][i].Flags !== 1 /* None */) {
colliders.push(game2[8 /* Collide */][i]);
}
}
}
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY17) == QUERY17) {
update14(game2, i, colliders);
}
}
}
function update14(game2, entity, colliders) {
let transform2 = game2[0 /* Transform */][entity];
let camera = game2[3 /* Camera */][entity];
let select2 = game2[11 /* Select */][entity];
let x = game2.Input.mx / game2.Canvas3.width * 2 - 1;
let y = -(game2.Input.my / game2.Canvas3.height) * 2 + 1;
let origin = [x, y, -1];
let target = [x, y, 1];
let direction = [0, 0, 0];
transform_point(origin, origin, camera.Unproject);
transform_point(origin, origin, transform2.World);
transform_point(target, target, camera.Unproject);
transform_point(target, target, transform2.World);
subtract(direction, target, origin);
normalize(direction, direction);
select2.Hit = raycast_aabb(colliders, origin, direction);
let t = (5 - origin[1]) / direction[1];
add(select2.Position, origin, scale(direction, direction, t));
if (select2.Hit && select2.Hit.Flags & ANIMATED && game2.Input.d0) {
let transform3 = game2[0 /* Transform */][select2.Hit.EntityId];
for (let animate2 of components_of_type(game2, transform3, 6 /* Animate */)) {
animate2.Trigger = 6 /* Select */;
}
for (let audio of components_of_type(game2, transform3, 5 /* AudioSource */)) {
audio.Trigger = snd_click;
}
}
}


var QUERY18 = 1 /* Transform */ | 2097152 /* Shake */;
function sys_shake(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY18) == QUERY18) {
update15(game2, i, delta);
}
}
}
function update15(game2, entity, delta) {
let shake2 = game2[21 /* Shake */][entity];
if (shake2.Duration > 0) {
shake2.Duration -= delta;
let transform2 = game2[0 /* Transform */][entity];
transform2.Translation = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
transform2.Dirty = true;
if (shake2.Duration <= 0) {
shake2.Duration = 0;
transform2.Translation = [0, 0, 0];
}
}
}


function create_flash() {
return {
Using: [light([1, 1, 1], 5), lifespan(0.2)]
};
}


function projectile(Damage) {
return (game2, entity) => {
game2.World[entity] |= 1048576 /* Projectile */;
game2[20 /* Projectile */][entity] = {
Damage
};
};
}


function create_projectile(damage, speed, color, size) {
return {
Using: [collide(true), projectile(damage), lifespan(3), move(speed), light(color, 2)],
Children: [
{
Scale: [0.3, 0.3, 0.3],
Using: [render_vox(new Float32Array(4), color)]
},
{
Using: [shake(5), emit_particles(1, 0.08), render_particles(color, size)]
}
]
};
}


var snd_shoot1 = {
Tracks: [
{
Instrument: [
5,
"lowpass",
10,
4,
,
,
,
,
[
[false, 10, 0, 0, 5],
["sine", 7, 0, 2, 2, 8]
]
],
Notes: [57]
}
],
Exit: 0.2
};


var snd_shoot2 = {
Tracks: [
{
Instrument: [4, "lowpass", 10, 4, , , , , [[false, 10, 0, 0, 5]]],
Notes: [57]
}
],
Exit: 0.2
};


var QUERY19 = 1 /* Transform */ | 4096 /* Shoot */;
function sys_shoot(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY19) == QUERY19) {
update16(game2, i);
}
}
}
function update16(game2, entity) {
let shoot2 = game2[12 /* Shoot */][entity];
if (shoot2.Target) {
let transform2 = game2[0 /* Transform */][entity];
let projectile2;
let snd_shoot;
if (game2.World[entity] & 8192 /* PlayerControl */) {
projectile2 = create_projectile(500, 40, [1, 1, 1], 9);
snd_shoot = snd_shoot1;
} else {
projectile2 = create_projectile(300, 30, [1, 0, 0], 7);
snd_shoot = snd_shoot2;
}
let Translation = get_translation([], transform2.Children[0].Children[0].World);
game2.Add({
...projectile2,
Translation,


Rotation: transform2.Rotation.slice()
});
game2.Add({
...create_flash(),
Translation
});
for (let audio of components_of_type(game2, transform2, 5 /* AudioSource */)) {
audio.Trigger = snd_shoot;
}
for (let animate2 of components_of_type(game2, transform2, 6 /* Animate */)) {
animate2.Trigger = 3 /* Shoot */;
}
}
shoot2.Target = null;
}


var QUERY20 = 1 /* Transform */;
function sys_transform(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY20) == QUERY20) {
update17(game2[0 /* Transform */][i]);
}
}
}
function update17(transform2) {
if (transform2.Dirty) {
transform2.Dirty = false;
set_children_as_dirty(transform2);
from_rotation_translation_scale(
transform2.World,
transform2.Rotation,
transform2.Translation,
transform2.Scale
);
if (transform2.Parent) {
multiply(transform2.World, transform2.Parent.World, transform2.World);
}
invert(transform2.Self, transform2.World);
}
}
function set_children_as_dirty(transform2) {
for (let child of transform2.Children) {
child.Dirty = true;
set_children_as_dirty(child);
}
}


var QUERY21 = 1 /* Transform */ | 256 /* Collide */ | 512 /* Trigger */;
function sys_trigger(game2, delta) {
for (let i = 0; i < game2.World.length; i++) {
if ((game2.World[i] & QUERY21) == QUERY21) {
update18(game2, i);
}
}
}
function update18(game2, entity) {
let collisions = game2[8 /* Collide */][entity].Collisions;
for (let collide2 of collisions) {
if (game2.World[collide2.EntityId] & 8192 /* PlayerControl */) {
game2.World[entity] &= ~512 /* Trigger */;
dispatch(game2, game2[9 /* Trigger */][entity].Action, [entity]);
}
}
}


function Defeat(state) {
return `
<div style="
width: 66%;
margin: 5vh auto;
text-align: center;
">
YOU DIE
<div style="
font: italic 5vmin serif;
">
You earned $${state.Gold.toLocaleString("en")}.
</div>
</div>

<div onclick="$(${2 /* EndChallenge */});" style="
font: italic bold small-caps 7vmin serif;
position: absolute;
bottom: 5%;
right: 10%;
">
Try Again
</div>
`;
}


function Intro() {
return `
<div style="
width: 66%;
margin: 10vh auto;
">
BACK<br>COUNTRY
<div onclick="$(${3 /* GoToTown */});" style="
font: italic bold small-caps 13vmin serif;
border-top: 20px solid #d45230;
">
Play Now
</div>
<div style="
font: italic 5vmin serif;
">
Earn as much money as you can in today's challenge.
</div>
</div>
`;
}


function Playing(state) {
return `
<div style="
margin: 3vmin 4vmin;
font: 10vmin Impact;
">
$${state.Gold.toLocaleString("en")}
</div>
`;
}


function Store(state) {
return `
<div style="
width: 66%;
margin: 5vh auto;
text-align: center;
color: #222;
">
GENERAL STORE
</div>

<div onclick="$(${11 /* ChangePlayerSeed */});" style="
font: italic bold small-caps 7vmin serif;
position: absolute;
bottom: 15%;
left: 10%;
">
${state.MonetizationEnabled ? "Change Outfit" : `
<s>Change Outfit</s>
<div style="font: italic 5vmin serif;">
Become a Coil subscriber!
</div>
`}
</div>

<div onclick="$(${3 /* GoToTown */});" style="
font: italic bold small-caps 7vmin serif;
position: absolute;
bottom: 5%;
right: 10%;
">
Confirm
</div>
`;
}


function Victory() {
return `
<div style="
width: 66%;
margin: 5vh auto;
text-align: center;
">
WELL DONE
</div>

<div onclick="$(${1 /* CompleteBounty */});" style="
font: italic bold small-caps 7vmin serif;
position: absolute;
bottom: 5%;
right: 10%;
">
Collect Bounty
</div>
`;
}


function Wanted(state) {
return `
<div style="
width: 66%;
margin: 5vh auto;
text-align: center;
color: #222;
">
WANTED
<div style="font-size: 7vmin;">
REWARD $${state.ChallengeLevel},000
</div>
</div>
<div onclick="$(${3 /* GoToTown */});" style="
font: italic bold small-caps 7vmin serif;
position: absolute;
bottom: 5%;
right: 10%;
">
Accept Quest
</div>
`;
}


function App(state) {
if (state.WorldFunc == world_intro) {
return Intro();
}
if (state.WorldFunc == world_store) {
return Store(state);
}
if (state.WorldFunc == world_wanted) {
return Wanted(state);
}
if (state.PlayerState == 1 /* Victory */) {
return Victory();
}
if (state.PlayerState == 2 /* Defeat */) {
return Defeat(state);
}
return Playing(state);
}


var prev;
function sys_ui(game2, delta) {
let next = App(game2);
if (next !== prev) {
game2.UI.innerHTML = prev = next;
}
}


var MAX_ENTITIES = 1e4;
var Game = class {
World;
Grid = [];
[0 /* Transform */] = [];
[1 /* Render */] = [];
[2 /* Draw */] = [];
[3 /* Camera */] = [];
[4 /* Light */] = [];
[5 /* AudioSource */] = [];
[6 /* Animate */] = [];
[7 /* Move */] = [];
[8 /* Collide */] = [];
[9 /* Trigger */] = [];
[10 /* Navigable */] = [];
[11 /* Select */] = [];
[12 /* Shoot */] = [];
[13 /* PlayerControl */] = [];
[14 /* Health */] = [];
[15 /* Mimic */] = [];
[16 /* EmitParticles */] = [];
[17 /* Cull */] = [];
[18 /* Walking */] = [];
[19 /* NPC */] = [];
[20 /* Projectile */] = [];
[21 /* Shake */] = [];
[22 /* Lifespan */] = [];
Canvas3;
Canvas2;
GL;
Context;
Audio = new AudioContext();
UI = document.querySelector("main");
Resized = false;
Input = {
mx: 0,
my: 0
};
WorldFunc = world_intro;

ChallengeSeed = ~~(Date.now() / (24 * 60 * 60 * 1e3));
PlayerSeed = this.ChallengeSeed;
ChallengeLevel = 1;
BountySeed = 0;
PlayerState = 0 /* Playing */;
PlayerXY;
Gold = 0;
MonetizationEnabled = false;
MaterialInstanced;
MaterialParticles;
MaterialWireframe;
Camera;
Player;
Models = [];
Palette = palette;
RAF = 0;
constructor() {
this.World = [];
document.addEventListener(
"visibilitychange",
() => document.hidden ? this.Stop() : this.Start()
);
this.Canvas3 = document.querySelector("canvas");
this.Canvas2 = document.querySelector("canvas + canvas");
this.GL = this.Canvas3.getContext("webgl2");
this.Context = this.Canvas2.getContext("2d");
this.UI.addEventListener("contextmenu", (evt) => evt.preventDefault());
this.UI.addEventListener("mousedown", (evt) => {
this.Input[`d${evt.button}`] = 1;
});
this.UI.addEventListener("mousemove", (evt) => {
this.Input.mx = evt.offsetX;
this.Input.my = evt.offsetY;
});
this.GL.enable(GL_DEPTH_TEST);
this.GL.enable(GL_CULL_FACE);
this.MaterialWireframe = mat_wireframe(this.GL);
this.MaterialInstanced = mat_instanced(this.GL);
this.MaterialParticles = mat_particles(this.GL);
}
CreateEntity(mask = 0) {
for (let i = 0; i < MAX_ENTITIES; i++) {
if (!this.World[i]) {
this.World[i] = mask;
return i;
}
}
throw new Error("No more entities available.");
}
Update(delta) {
let cpu = performance.now();
sys_lifespan(this, delta);
sys_select(this, delta);
sys_control_player(this, delta);
sys_control_ai(this, delta);
sys_control_projectile(this, delta);
sys_navigate(this, delta);
sys_aim(this, delta);
sys_particles(this, delta);
sys_shake(this, delta);
sys_animate(this, delta);
sys_move(this, delta);
sys_transform(this, delta);
sys_collide(this, delta);
sys_trigger(this, delta);
sys_shoot(this, delta);
sys_health(this, delta);
sys_mimic(this, delta);
sys_cull(this, delta);
sys_audio(this, delta);
sys_camera(this, delta);
sys_performance(this, performance.now() - cpu, document.querySelector("#cpu"));
let gpu = performance.now();
sys_render(this, delta);
sys_draw(this, delta);
sys_ui(this, delta);
sys_performance(this, performance.now() - gpu, document.querySelector("#gpu"));
sys_framerate(this, delta);
this.Input.d0 = 0;
this.Input.d2 = 0;
this.Resized = false;
}
Start() {
let last = performance.now();
let tick = (now) => {
let delta = (now - last) / 1e3;
this.Update(delta);
last = now;
this.RAF = requestAnimationFrame(tick);
};
this.Stop();
this.Audio.resume();
tick(last);
}
Stop() {
this.Audio.suspend();
cancelAnimationFrame(this.RAF);
}
Add({ Translation, Rotation, Scale, Using = [], Children = [] }) {
let entity = this.CreateEntity(0 /* Transform */);
transform(Translation, Rotation, Scale)(this, entity);
for (let mixin of Using) {
mixin(this, entity);
}
let entity_transform = this[0 /* Transform */][entity];
for (let subtree of Children) {
let child = this.Add(subtree);
let child_transform = this[0 /* Transform */][child];
child_transform.Parent = entity_transform;
entity_transform.Children.push(child_transform);
}
return entity;
}
Destroy(entity) {
let mask = this.World[entity];
if (mask & 1 /* Transform */) {
for (let child of this[0 /* Transform */][entity].Children) {
this.Destroy(child.EntityId);
}
}
this.World[entity] = 0;
}
};


function load(path) {
return fetch(path).then((response) => response.arrayBuffer()).then((buffer) => {
let buffer_array = new Uint16Array(buffer);
let model_data = [];
let i = 0;
while (i < buffer_array.length) {
let Size = [0, 0, 0];
let model_start = i + 1;
let model_length = buffer_array[i];
let model_end = model_start + model_length;
let model = [];
for (i = model_start; i < model_end; i++) {
let voxel = buffer_array[i];
model.push(
(voxel & 15) >> 0,
(voxel & 240) >> 4,
(voxel & 3840) >> 8,
(voxel & 61440) >> 12
);
}
for (let j = 0; j < model.length; j++) {
if (Size[j % 4] < model[j] + 1) {
Size[j % 4] = model[j] + 1;
}
}
model_data.push(
new Float32Array(model).map((val, idx) => {
switch (idx % 4) {
case 0:
return val - Size[0] / 2 + 0.5;
case 1:
return val - Size[1] / 2 + 0.5;
case 2:
return val - Size[2] / 2 + 0.5;
default:
return val;
}
})
);
}
return model_data;
});
}


var game = new Game();
window.$ = (...args) => dispatch(game, ...args);
window.game = game;
load(`${"."}/models.tfu`).then((models) => {
game.Models = models;
world_intro(game);
game.Start();
});
})();
