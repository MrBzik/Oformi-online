import {parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates} from "nuqs";
import {sortValues} from "@/modules/products/search-params";

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
    sort: parseAsStringLiteral(sortValues).withDefault("популярные"),
}
export const useProductSortFilters = () => {
    return useQueryStates(sortParams);
};

export const params = {
    search: parseAsString
        .withOptions({
            clearOnDefault: true
        })
        .withDefault(""),
    ...sortParams,
    ...filtersParams
}

export const useProductFilters = () => {
    return useQueryStates(params);
};
