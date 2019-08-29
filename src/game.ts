import {Action, effect} from "./actions.js";
import {Blueprint} from "./blueprints/blu_common.js";
import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {ClickControl} from "./components/com_control_click.js";
import {PlayerControl} from "./components/com_control_player.js";
import {Cull} from "./components/com_cull.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Health} from "./components/com_health.js";
import {ComponentData, Get} from "./components/com_index.js";
import {Light} from "./components/com_light.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {Navigable} from "./components/com_navigable.js";
import {RayTarget} from "./components/com_ray_target.js";
import {Render} from "./components/com_render.js";
import {Select} from "./components/com_select.js";
import {Shoot} from "./components/com_shoot.js";
import {transform, Transform} from "./components/com_transform.js";
import {Trigger} from "./components/com_trigger.js";
import {Material} from "./materials/mat_common.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {Mat} from "./materials/mat_index.js";
import {mat_instanced} from "./materials/mat_instanced.js";
import {mat_particles} from "./materials/mat_particles.js";
import {mat_wireframe} from "./materials/mat_wireframe.js";
import {Model} from "./model.js";
import {palette} from "./palette.js";
import {sys_aim} from "./systems/sys_aim.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio} from "./systems/sys_audio.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_cull} from "./systems/sys_cull.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_health} from "./systems/sys_health.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_mimic} from "./systems/sys_mimic.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_navigate} from "./systems/sys_navigate.js";
import {sys_particles} from "./systems/sys_particles.js";
import {sys_performance} from "./systems/sys_performance.js";
import {sys_player_control} from "./systems/sys_player_control.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_select} from "./systems/sys_select.js";
import {sys_shoot} from "./systems/sys_shoot.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
import {sys_ui} from "./systems/sys_ui.js";
import {INIT_UI_STATE, reducer, UIState} from "./ui/state.js";

const MAX_ENTITIES = 10000;

export type Entity = number;

export interface InputState {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
}

export interface EventState {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
    wheel_y: number;
}

export class Game implements ComponentData {
    public world: Array<number>;
    public distance_field: Array<Array<number | string>> = [];
    public [Get.Transform]: Array<Transform> = [];
    public [Get.Render]: Array<Render> = [];
    public [Get.Camera]: Array<Camera> = [];
    public [Get.Light]: Array<Light> = [];
    public [Get.AudioSource]: Array<AudioSource> = [];
    public [Get.Animate]: Array<Animate> = [];
    public [Get.Named]: Array<Named> = [];
    public [Get.Move]: Array<Move> = [];
    public [Get.ClickControl]: Array<ClickControl> = [];
    public [Get.Collide]: Array<Collide> = [];
    public [Get.Trigger]: Array<Trigger> = [];
    public [Get.RayTarget]: Array<RayTarget> = [];
    public [Get.Navigable]: Array<Navigable> = [];
    public [Get.Select]: Array<Select> = [];
    public [Get.Shoot]: Array<Shoot> = [];
    public [Get.PlayerControl]: Array<PlayerControl> = [];
    public [Get.Health]: Array<Health> = [];
    public [Get.Mimic]: Array<Mimic> = [];
    public [Get.EmitParticles]: Array<EmitParticles> = [];
    public [Get.Cull]: Array<Cull> = [];

    public canvas: HTMLCanvasElement;
    public gl: WebGL2RenderingContext;
    public audio: AudioContext = new AudioContext();
    public ui: HTMLElement = document.querySelector("main")!;

    public input: InputState = {
        mouse_x: 0,
        mouse_y: 0,
    };
    public event: EventState = {
        mouse_x: 0,
        mouse_y: 0,
        wheel_y: 0,
    };
    public state: UIState = INIT_UI_STATE;
    public dispatch = (action: Action, ...args: Array<unknown>) => {
        this.state = reducer(this.state, action, args);
        effect(this, action, args);
    };

    public materials: Array<Material> = [];
    public cameras: Array<Camera> = [];
    public lights: Array<Light> = [];
    public models: Array<Model> = [];
    public palette: Array<number> = palette;
    public targets: Array<RayTarget> = [];
    private raf: number = 0;

    constructor() {
        this.world = [];

        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.stop() : this.start()
        );

        this.canvas = document.querySelector("canvas")!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener("keydown", evt => (this.input[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.input[evt.code] = 0));
        this.canvas.addEventListener("contextmenu", evt => evt.preventDefault());
        this.canvas.addEventListener("mousedown", evt => {
            this.input[`mouse_${evt.button}`] = 1;
            this.event[`mouse_${evt.button}_down`] = 1;
        });
        this.canvas.addEventListener("mouseup", evt => {
            this.input[`mouse_${evt.button}`] = 0;
            this.event[`mouse_${evt.button}_up`] = 1;
        });
        this.canvas.addEventListener("mousemove", evt => {
            this.input.mouse_x = evt.offsetX;
            this.input.mouse_y = evt.offsetY;
            this.event.mouse_x = evt.movementX;
            this.event.mouse_y = evt.movementY;
        });

        this.gl = this.canvas.getContext("webgl2")!;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CW);

        this.materials[Mat.Wireframe] = mat_wireframe(this.gl);
        this.materials[Mat.Gouraud] = mat_gouraud(this.gl);
        this.materials[Mat.Instanced] = mat_instanced(this.gl);
        this.materials[Mat.Particles] = mat_particles(this.gl);
    }

    create_entity(mask: number) {
        for (let i = 0; i < MAX_ENTITIES; i++) {
            if (!this.world[i]) {
                this.world[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    fixed_update(delta: number) {
        let now = performance.now();

        // Player input.
        sys_select(this, delta);
        sys_player_control(this, delta);
        // Game logic.
        sys_aim(this, delta);
        sys_navigate(this, delta);
        sys_animate(this, delta);
        sys_particles(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        // Post-transform logic.
        sys_collide(this, delta);
        sys_trigger(this, delta);
        sys_shoot(this, delta);
        sys_health(this, delta);
        sys_mimic(this, delta);
        sys_cull(this, delta);

        // Performance.
        sys_performance(this, performance.now() - now, document.querySelector("#fixed"));

        // Debug.
        false && sys_debug(this, delta);

        for (let name in this.event) {
            this.event[name] = 0;
        }
    }

    frame_update(delta: number) {
        let now = performance.now();

        sys_audio(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_ui(this, delta);

        // Performance.
        sys_performance(this, performance.now() - now, document.querySelector("#frame"));
        sys_framerate(this, delta);
    }

    start() {
        let step = 1 / 60;
        let accumulator = 0;
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            accumulator += delta;
            while (accumulator > step) {
                accumulator -= step;
                this.fixed_update(step);
            }
            this.frame_update(delta);

            last = now;
            this.raf = requestAnimationFrame(tick);
        };

        this.stop();
        this.audio.resume();
        tick(last);
    }

    stop() {
        this.audio.suspend();
        cancelAnimationFrame(this.raf);
    }

    add({translation, rotation, scale, using = [], children = []}: Blueprint) {
        let entity = this.create_entity(Get.Transform);
        transform(translation, rotation, scale)(this)(entity);
        for (let mixin of using) {
            mixin(this)(entity);
        }
        let entity_transform = this[Get.Transform][entity];
        for (let subtree of children) {
            let child = this.add(subtree);
            let child_transform = this[Get.Transform][child];
            child_transform.parent = entity_transform;
            entity_transform.children.push(child_transform);
        }
        return entity;
    }

    destroy(entity: Entity) {
        let mask = this.world[entity];
        if (mask & (1 << Get.Transform)) {
            for (let child of this[Get.Transform][entity].children) {
                this.destroy(child.entity);
            }
        }
        this.world[entity] = 0;
    }
}
