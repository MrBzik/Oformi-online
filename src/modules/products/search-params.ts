import {parseAsArrayOf, createLoader, parseAsString, parseAsStringLiteral} from "nuqs/server";
export const sortValues = ["новые", "популярные", "дешевле", "дороже", "по рейтингу"] as const;

const params = {
    category: parseAsString
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault(""),
    search: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
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