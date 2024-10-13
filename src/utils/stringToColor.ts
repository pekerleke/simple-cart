export const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    const saturation = 70;
    const lightness = 85;
    const colorPastel = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const contrastLightness = 40;
    const colorContrast = `hsl(${hue}, ${saturation}%, ${contrastLightness}%)`;

    return { pastel: colorPastel, contrast: colorContrast };
};