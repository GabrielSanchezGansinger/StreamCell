export const getCSSVariable = (varName: string) => {
    getComputedStyle(document.documentElement).getPropertyValue(varName);
} 

const setCSSVariable = (varName: string, value: string) => {
    document.documentElement.style.setProperty(varName, value);
}

export const setTheme = (themeName: string) => {
    switch(themeName) {
        case "dark":
            setCSSVariable("--color-text", "white");
            setCSSVariable("--color-background", "black");
            break;
        case "light":
            setCSSVariable("--color-text", "black");
            setCSSVariable("--color-background", "white");
            break;
            
    }
}