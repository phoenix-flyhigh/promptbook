"use client"

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface ThemeSwitcherProps {
    onClick: () => void
}

const ThemeSwitcher = ({ onClick }: ThemeSwitcherProps) => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleThemeSwitch = () => {
        if (theme === "dark")
            setTheme("light")
        else
            setTheme("dark")
        onClick()
    }

    return (
        <span onClick={handleThemeSwitch}>
            {`Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`}
        </span>

    );
}

export default ThemeSwitcher