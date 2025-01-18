import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { CiClock1, CiHome, CiSearch, CiSettings } from "react-icons/ci";

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
            value="home"
            icon={<CiHome size="28px" />}
            disableRipple
            sx={{ py: "8px" }}
          />
          <BottomNavigationAction
            value="search"
            icon={<CiSearch size="28px" />}
            disableRipple
            sx={{ py: "8px" }}
          />
          <BottomNavigationAction
            value="history"
            icon={<CiClock1 size="28px" />}
            disableRipple
            sx={{ py: "8px" }}
          />
          <BottomNavigationAction
            value="account"
            icon={<CiSettings size="28px" />}
            disableRipple
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Navigation;
