"use client";

import {
  Book as BookIcon,
  Person as PersonIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

import React from "react";

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tab = pathname.split("/").pop();

  return (
    <BottomNavigation
      value={tab}
      onChange={(_, newValue) => router.push(newValue)}
      sx={{ width: "100%", position: "fixed", bottom: 0, left: 0 }}
    >
      <BottomNavigationAction
        label="Dictionary"
        value="define"
        icon={<BookIcon />}
      />
      <BottomNavigationAction
        label="Translator"
        value="translate"
        icon={<TranslateIcon />}
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<PersonIcon />}
      />
    </BottomNavigation>
  );
};

export default Navigation;
