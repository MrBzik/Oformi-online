import {parseAsArrayOf, createLoader, parseAsString, parseAsStringLiteral} from "nuqs/server";
export const sortValues = ["новые", "популярные", "по умолчанию"] as const;

const params = {
    sort: parseAsStringLiteral(sortValues).withDefault("новые"),
    minPrice: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
    maxPrice: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
    tags: parseAsArrayOf(parseAsString)
        .withOptions({
            clearOnDefault: true
        })
        .withDefault([]),
}

export const loadProductFilters = createLoader(params)