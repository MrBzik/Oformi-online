import {parseAsArrayOf, createLoader, parseAsString, parseAsStringLiteral} from "nuqs/server";
export const sortValues = ["популярные", "по рейтингу", "проверенные", "дешевле", "дороже"] as const;

const params = {
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

const refParam = {
    ref: parseAsString
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault(""),
}

export const loadRefLink = createLoader(refParam)

const refSellerParam = {
    refSeller: parseAsString
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault(""),
}

export const loadSellerRefLink = createLoader(refSellerParam)