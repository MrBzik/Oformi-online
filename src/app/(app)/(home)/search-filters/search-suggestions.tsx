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
            <div className="h-3 w-60"/>
            <div style={{background: DEFAULT_BG_COLOR}}
                 className="w-fit text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px] cursor-pointer">
                <div>
                    {suggestions?.docs?.map((suggestion) => (
                        <div
                            onClick={() => onSuggestionClick({
                                category: suggestion.category!,
                                productName: suggestion.name
                            })}
                            key = {suggestion.id}
                              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between gap-x-2 items-center font-medium">
                            <span className="text-muted-foreground">
                                {suggestion.category?.name}
                            </span>
                            <span>
                                {" " + suggestion.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}