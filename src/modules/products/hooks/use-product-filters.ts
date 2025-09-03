import {parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates} from "nuqs";

export const sortValues = ["новые", "популярные", "дешевле", "дороже", "по рейтингу"] as const;

export const filtersParams = {
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

export const useProductSideFilters = () => {
    return useQueryStates(filtersParams);
};

export const sortParams = {
    sort: parseAsStringLiteral(sortValues).withDefault("новые"),
}
export const useProductSortFilters = () => {
    return useQueryStates(sortParams);
};

export const categoryParams = {
    category: parseAsString
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault(""),
}

export const useCategoryFilters = () => {
    return useQueryStates(categoryParams)
}

export const params = {
    search: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
    ...sortParams,
    ...filtersParams,
    ...categoryParams
}

export const useProductFilters = () => {
    return useQueryStates(params);
};
