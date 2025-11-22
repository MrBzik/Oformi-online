"use client"

import {useEffect} from "react";

export const ErrorHandler = () => {

    useEffect(() => {
        window.location.reload()
    }, []);

    return null;
}