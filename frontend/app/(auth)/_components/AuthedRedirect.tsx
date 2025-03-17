"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/_contexts/UserContext";

const AuthedRedirect = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return <></>;
};

export default AuthedRedirect;
