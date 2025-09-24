"use client"

import {CategoryDropdown} from "@/app/(app)/(home)/search-filters/category-dropdown";
import {useEffect, useRef, useState} from "react";
import {CategoriesList} from "@/modules/categories/types";
import {useParams} from "next/navigation";

interface Props {
    data: CategoriesList,
    onCategoryColorChange: (color: string) => void,
}

export const Categories = ({
    data,
    onCategoryColorChange,
} : Props) => {

    const params = useParams();

    const [isAnyHovered, setIsAnyHovered] = useState(false);

    const activeCategory = params.category as string | undefined;

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {

        const calculateVisible = () => {
            if (!containerRef.current) return;

            const parentRect = containerRef.current.getBoundingClientRect();
            const parentWidth = parentRect.width;

            let lastVisible = data.length - 1;

            for (let i = 0; i < itemRefs.current.length; i++) {
                const el = itemRefs.current[i];
                if (!el) continue;

                const elRect = el.getBoundingClientRect();
                const elRight = elRect.right - parentRect.left; // relative to container

                if (elRight > parentWidth) {
                    lastVisible = i - 1;
                    break;
                }
            }

            setLastVisibleItem(lastVisible);
        };


        const resizeObserver = new ResizeObserver(calculateVisible);
        resizeObserver.observe(containerRef.current!)

        return () => {
            resizeObserver.disconnect()
        }

    }, [data.length]);

    const [lastVisibleItem, setLastVisibleItem] = useState(data.length)

    return (
        <div className="relative w-full">
            <div ref={containerRef}
                onMouseEnter={() => setIsAnyHovered(true)}
                onMouseLeave={() => setIsAnyHovered(false)}
                className="flex flex-nowrap items-center w-full gap-2 ">
                {data.slice(0, 30).map((category, i) => (
                    <div key={category.id}
                         ref={(el) => {itemRefs.current[i] = el}}
                    >
                        <CategoryDropdown
                            onCategoryColorChange={onCategoryColorChange}
                            category={category}
                            isActive={activeCategory === category.slug}
                            isNavigationHovered={isAnyHovered}
                            isHidden={lastVisibleItem < i}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}