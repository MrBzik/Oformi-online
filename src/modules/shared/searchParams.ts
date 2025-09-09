import {createLoader, parseAsString} from "nuqs/server";

const params = {
    ref: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
}

export const loadReferral = createLoader(params)