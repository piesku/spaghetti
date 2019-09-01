import {AudioClip} from "../components/com_audio_source";

export let snd_click = <AudioClip>{
    Tracks: [
        {
            Instrument: [
                7,
                true,
                "lowpass",
                8,
                8,
                false,
                false,
                "sine",
                8,
                8,
                [[0, 4, 1, 0, 3, "sine", 8, false, false, 7, 7, 7]],
            ],
            Notes: [69],
        },
    ],
    Exit: 0.2,
};
