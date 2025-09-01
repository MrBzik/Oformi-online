import {createLoader, parseAsString} from "nuqs/server";

const params = {
    token: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
}

export const loadAuthToken = createLoader(params)