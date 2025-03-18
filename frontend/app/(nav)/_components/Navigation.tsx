"use client";

import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

import React from "react";

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tab = pathname.split("/").pop();

  return (
    <>
      <Box height="56px" />
      <BottomNavigation
        value={tab}
        onChange={(_, newValue) => router.push(newValue)}
        sx={{ width: "100%", position: "fixed", bottom: 0, left: 0 }}
      >
        <BottomNavigationAction value="define" icon={<HomeIcon />} />
        <BottomNavigationAction value="translate" icon={<TranslateIcon />} />
        <BottomNavigationAction value="profile" icon={<SettingsIcon />} />
      </BottomNavigation>
    </>
  );
};

export default Navigation;
