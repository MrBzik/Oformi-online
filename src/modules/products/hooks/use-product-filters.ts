import {parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates} from "nuqs";

export const sortValues = ["новые", "популярные", "по умолчанию"] as const;

export const params = {
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

export const useProductFilters = () => {
    return useQueryStates(params);
};

