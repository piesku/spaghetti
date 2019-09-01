import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {ease_in_out_quart, ease_out_quart} from "../math/easing.js";
import {from_euler} from "../math/quat.js";
import {element, rand} from "../math/random.js";
import {Models} from "../models_map.js";
import {palette} from "../palette.js";
import {Blueprint, Mixin} from "./blu_common.js";
import {create_gun} from "./items/blu_gun.js";
import {create_shotgun} from "./items/blu_shotgun.js";

let hat_models = [
    Models.HAT1,
    Models.HAT2,
    Models.HAT3,
    Models.HAT4,
    Models.HAT5,
    Models.HAT6,
    Models.HAT7,
];

// const enum CustomColorIndex {
//     Shirt = 0,
//     Pants = 1,
//     Hat = 2,
//     Extra = 3,
//     Skin = 4,
//     Hair = 5,
// }

type Color = [number, number, number];

interface CustomColors {
    shirt?: Color;
    pants?: Color;
    hat?: Color;
    extra?: Color;
    skin?: Color;
    hair?: Color;
}

let shirt_colors: Array<Color> = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]];
let hat_colors: Array<Color> = [[0.2, 0.2, 0.2], [0.9, 0.9, 0.9], [0.53, 0, 0], [1, 0, 0]];
let extra_colors: Array<Color> = [[0, 0, 0], [1, 1, 1], [1, 1, 0], [0.9, 0, 0]];
let skin_colors: Array<Color> = [[1, 0.8, 0.6], [1, 0.8, 0.6], [0.6, 0.4, 0]];
let hair_colors: Array<Color> = [[1, 1, 0], [0, 0, 0], [0.6, 0.4, 0], [0.4, 0, 0]];
let pants_colors: Array<Color> = [
    [0, 0, 0],
    [0.53, 0, 0],
    [0.53, 0, 0],
    [0.6, 0.4, 0.2],
    [0.33, 0.33, 0.33],
];

function create_custom_palette(colors: CustomColors) {
    let new_palette = palette.slice();
    if (colors.shirt) {
        new_palette.splice(0, 3, ...colors.shirt);
    }

    if (colors.pants) {
        new_palette.splice(3, 3, ...colors.pants);
    }

    if (colors.hat) {
        new_palette.splice(6, 3, ...colors.hat);
    }

    if (colors.extra) {
        new_palette.splice(9, 3, ...colors.extra);
    }

    if (colors.skin) {
        new_palette.splice(12, 3, ...colors.skin);
    }

    if (colors.hair) {
        new_palette.splice(15, 3, ...colors.hair);
    }

    return new_palette;
}

export function get_hat(game: Game, palette: Array<number>): Blueprint {
    let hat_index = element(hat_models) as Models;
    let body_height = game.models[Models.BODY].size[1];
    let hat_height = game.models[hat_index].size[1];
    let is_rotated = rand() > 0.8;

    return {
        Translation: is_rotated
            ? [0, body_height / 2 - 2, hat_height / 2 + 1]
            : [0, hat_height / 2 + body_height / 2, 0],
        Rotation: is_rotated ? from_euler([], 90, 0, 0) : [0, 1, 0, 0],
        Using: [(game: Game) => render_vox(game.models[hat_index], palette)(game)],
    };
}

export function get_character_blueprint(game: Game): Blueprint {
    let shirt_color = element(shirt_colors) as Color;
    let pants_color = element(pants_colors) as Color;
    let hat_color = element(hat_colors) as Color;
    let extra_color = element(extra_colors) as Color;
    let skin_color = element(skin_colors) as Color;
    let hair_color = element(hair_colors) as Color;

    let palette = create_custom_palette({
        shirt: shirt_color,
        pants: pants_color,
        hat: hat_color,
        extra: extra_color,
        skin: skin_color,
        hair: hair_color,
    });

    let items = [create_gun, create_gun, create_shotgun];

    let right_hand_item = rand() > 0.3 ? {} : (element(items) as Mixin)(game);
    let left_hand_item = rand() > 0.5 ? {} : (element(items) as Mixin)(game);

    return {
        Rotation: [0, 1, 0, 0],
        Children: [
            {
                //body
                Using: [
                    render_vox(game.models[Models.BODY], palette),
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Rotation: from_euler([], 0, 5, 0),
                                },
                                {
                                    Timestamp: 0.5,
                                    Rotation: from_euler([], 0, -5, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Rotation: from_euler([], 0, 5, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], 0, -5, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [0, 0, 0],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [0, 2, 0],
                                    Rotation: from_euler([], 15, 0, 0),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [0, 0, 0],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [get_hat(game, palette)],
            },
            {
                // right arm
                Translation: [1.5, 0, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                                {
                                    Timestamp: 0.5,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 60, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], -30, 0, 0),
                                },
                            ],
                        },
                        [Anim.Shoot]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 50, 0, 0),
                                },
                                {
                                    Timestamp: 0.1,
                                    Rotation: from_euler([], 90, 0, 0),
                                    Ease: ease_out_quart,
                                },
                                {
                                    Timestamp: 0.13,
                                    Rotation: from_euler([], 110, 0, 0),
                                },
                                {
                                    Timestamp: 0.3,
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [1.5, 2, 0.5],
                                    Rotation: from_euler([], 0, 0, 135),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1, 0],
                        Using: [render_vox(game.models[Models.HAND], palette)],
                    },
                    right_hand_item,
                ],
            },
            {
                // left arm
                Translation: [-1.5, 0, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                                {
                                    Timestamp: 0.5,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -30, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], 60, 0, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [-1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [-1.5, 2, 0.5],
                                    Rotation: from_euler([], 0, 0, -135),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [-1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1, 0],
                        Using: [render_vox(game.models[Models.HAND], palette)],
                    },
                    left_hand_item,
                ],
            },
            {
                // right foot
                Translation: [0.5, -2, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                                {
                                    Timestamp: 1,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -45, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], 45, 0, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [0.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 45),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1.5, 0],
                        Using: [render_vox(game.models[Models.FOOT], palette)],
                    },
                ],
            },
            {
                // left foot
                Translation: [-0.5, -2, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                                {
                                    Timestamp: 1,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 45, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], -45, 0, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [-0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [-0.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, -45),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [-0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1.5, 0],
                        Using: [render_vox(game.models[Models.FOOT], palette)],
                    },
                ],
            },
        ],
    };
}
