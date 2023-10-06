import React from "react";
import ThemeChangeButtonView from "./ThemeChangeButton.view";
import { useTheme } from "next-themes";

const ThemeChangeButton = () => {
  const { theme, setTheme } = useTheme();

  let iconSourceUrl = "";
  let iconSize: number;
  if (theme === "dark"){
    iconSize= 30;
    iconSourceUrl = "/icons/sun-fill.svg";
  }
  else {
    iconSize = 25;
    iconSourceUrl = "/icons/moon-dark.svg";
  }

  const handleThemeChange = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  return <ThemeChangeButtonView
  iconSize={iconSize}
    iconUrl={iconSourceUrl}
    handleClick={handleThemeChange}
  />;
};

export default ThemeChangeButton;
