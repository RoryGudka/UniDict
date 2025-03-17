import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // A vibrant blue that's easy to read
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4f46e5", // A complementary indigo
      light: "#818cf8",
      dark: "#4338ca",
      contrastText: "#ffffff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Slate 800
      secondary: "#475569", // Slate 600
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none", // Prevents all-caps buttons
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
        elevation1: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default theme;
