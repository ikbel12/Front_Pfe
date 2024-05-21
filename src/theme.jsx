export const getDesignTokens = (mode) => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            /* j ai importer le code de Material ui si tu veux changer la  palette de couleur
             light mode ajuster ici */
          }
        : {
            // palette values for dark mode
          }),
    },
  });