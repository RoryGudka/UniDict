import { Box } from "@mui/material";
import DefineSettingsLanguage from "./DefineSettingsLanguage";
import { Typography } from "@mui/material";

const DefineSettings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Dictionary entries
      </Typography>
      <Box>
        <DefineSettingsLanguage />
      </Box>
    </Box>
  );
};

export default DefineSettings;
