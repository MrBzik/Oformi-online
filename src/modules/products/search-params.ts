import {parseAsArrayOf, createLoader, parseAsString, parseAsStringLiteral} from "nuqs/server";
export const sortValues = ["популярные", "по рейтингу", "дешевле", "дороже"] as const;

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
    sort: parseAsStringLiteral(sortValues).withDefault("популярные"),
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