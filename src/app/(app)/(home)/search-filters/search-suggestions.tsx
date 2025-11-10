import {SuggestionsList} from "@/modules/products/types";
import {useEffect, useRef} from "react";
import {Category} from "@/payload-types";
import {DEFAULT_BG_COLOR} from "@/modules/home/constants";

interface Props {
    suggestions?: SuggestionsList;
    onClose: () => void;
    onSuggestionClick: (el: {
        category: Category;
        productName: string;
    }) => void;
}


export const SearchSuggestions = ({
    suggestions,
    onClose,
    onSuggestionClick,
}: Props
) => {

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: PointerEvent) {
            if(!containerRef.current?.contains(e.target as Node)){
                onClose?.();
            }
        }
        document.addEventListener("pointerdown", handleClick);
        return () => {
            document.removeEventListener("pointerdown", handleClick);
        };
    }, [onClose]);

    if (!suggestions) {
        return null;
    }

    return (

        <div
            ref={containerRef}
            className="absolute z-100"
             style={{
                 top: "100%",
                 left: 0,
             }}>
            <div className="hidden lg:block h-3 w-60"/>
            <div style={{background: DEFAULT_BG_COLOR}}
                 className="w-full lg:w-fit text-black lg:rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  cursor-pointer">
                <div>
                    {suggestions?.docs?.map((suggestion) => (
                        <p
                            onClick={() => onSuggestionClick({
                                category: suggestion.category!,
                                productName: suggestion.name
                            })}
                            key = {suggestion.id}
                              className="w-full text-left px-4 py-2 lg:py-4 hover:bg-black hover:text-white font-medium">
                            <span className="text-muted-foreground text-xs lg:text-base">
                                {suggestion.category?.name}
                            </span>
                            { " " + suggestion.name}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}