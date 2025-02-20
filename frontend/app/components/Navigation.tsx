import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { BsBook, BsTranslate } from "react-icons/bs";

import { SetState } from "@/lib/model";

interface Props {
  tab: string;
  setTab: SetState<string>;
}

const Navigation: React.FC<Props> = ({ tab, setTab }) => {
  return (
    <Box>
      <Box sx={{ height: "64px" }} />
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid rgba(0, 0, 0, 0.6)",
          bgcolor: "white",
        }}
      >
        <BottomNavigation
          showLabels
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
        >
          <BottomNavigationAction
            value="dictionary"
            icon={<BsBook size="28px" />}
            disableRipple
            sx={{ py: "8px" }}
            label="Dictionary"
          />
          <BottomNavigationAction
            value="translator"
            icon={<BsTranslate size="28px" />}
            disableRipple
            sx={{ py: "8px" }}
            label="Translator"
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Navigation;
