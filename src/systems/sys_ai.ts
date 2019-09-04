import {Get} from "../components/com_index.js";
import {find_first} from "../components/com_named.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {integer} from "../math/random.js";
import {get_neighbors, get_route} from "./sys_player_control.js";

const QUERY = (1 << Get.Transform) | (1 << Get.NPC) | (1 << Get.Walking) | (1 << Get.PathFind);

export function sys_ai(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let path_find = game[Get.PathFind][entity];
    let walking = game[Get.Walking][entity];
    let is_friendly = game[Get.NPC][entity].Friendly;
    let can_shoot = game[Get.NPC][entity].LastShot <= 0;
    let player = find_first(game, "player");
    let player_walking = game[Get.Walking][player];
    let distance_to_player = Math.abs(
        game.Grid[walking.X][walking.Y] - game.Grid[player_walking.X][player_walking.Y]
    );
    let route: false | [number, number][] = [];

    if (!path_find.Route.length && !path_find.Destination) {
        if (is_friendly || distance_to_player > 5) {
            let destination_depth = integer(1, 15);
            while (destination_depth === game.Grid[walking.X][walking.Y]) {
                destination_depth = integer(1, 15);
            }

            route = get_random_route(game, entity, destination_depth);
        } else {
            route = get_route(game, player, walking);

            if (route) {
                route.pop();
                route.pop();
                route = route.reverse();
            }
        }

        if (route && route.length > 1) {
            path_find.Route = route;
        }
    }

    if (!is_friendly && game.World[entity] & (1 << Get.Shoot)) {
        if (distance_to_player < 4 && can_shoot) {
            game[Get.Shoot][entity].Target = game[Get.Transform][player].Translation;
            game[Get.NPC][entity].LastShot = 0.2;
            path_find.Route = [];
        } else {
            game[Get.NPC][entity].LastShot -= delta;
        }
    }
}

function get_random_route(game: Game, entity: Entity, destination_depth: number) {
    let walking = game[Get.Walking][entity];
    let current_cell = game[Get.Navigable][find_navigable(game, walking.X, walking.Y)];
    let current_depth = game.Grid[walking.X][walking.Y];
    let modifier = destination_depth > current_depth ? 1 : -1;

    let route: Array<[number, number]> = [];

    if (!(current_depth < 16)) {
        return false;
    }

    while (destination_depth !== current_depth) {
        if (route.length > 10) {
            destination_depth = integer(1, 15);
            current_depth = game.Grid[walking.X][walking.Y];
            modifier = destination_depth > current_depth ? 1 : -1;
        }

        route.push([current_cell.X, current_cell.Y]);

        let neighbors = get_neighbors(game, current_cell.X, current_cell.Y, walking.Diagonal).sort(
            () => 0.5 - Math.random()
        );

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor_coords = neighbors[i];
            if (
                game.Grid[neighbor_coords.x][neighbor_coords.y] ===
                current_depth + 1 * modifier
                //  ||
                // game.grid[neighbor_coords.x][neighbor_coords.y] === current_depth
            ) {
                current_cell =
                    game[Get.Navigable][find_navigable(game, neighbor_coords.x, neighbor_coords.y)];
                current_depth = game.Grid[current_cell.X][current_cell.Y];
                break;
            }
        }
    }

    return route.reverse();
}
