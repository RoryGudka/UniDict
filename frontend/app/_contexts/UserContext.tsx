"use client";

import {
  FetchUserAttributesOutput,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import {
  Profile,
  SetState,
  User,
  defaultNoUserProfile,
  defaultUserProfile,
} from "@/_lib/model";
import { createContext, useContext, useEffect, useState } from "react";

import { get } from "@/_lib/api";
import posthog from "posthog-js";
import { useToast } from "@/_contexts/ToastContext";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  signOutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  authToken: string | null;
  profile: Profile;
  setProfile: SetState<Profile>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [profile, setProfile] = useState(defaultNoUserProfile);
  const { showToast } = useToast();

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || null;
      if (!token) return;

      const currentUser = await getCurrentUser();
      let attributes = await fetchUserAttributes();

      const profile = await get<Profile>(
        `/api/profile/${currentUser.username}`,
        { authToken: token }
      );
      setAuthToken(token);
      setUser({ id: currentUser.userId, email: currentUser.username });
      setProfile({ ...defaultUserProfile, ...(profile || {}) });

      if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "local") {
        posthog.identify(currentUser.username, {
          email: currentUser.username,
          name: attributes.name,
        });
      }
    } catch (e) {
      setUser(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthToken(null);
      setProfile(defaultNoUserProfile);

      if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "local") {
        posthog.reset();
      }

      showToast("Successfully signed out", "success");
    } catch (e) {
      showToast((e as Error).message, "error");
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    isLoading,
    setUser,
    signOutUser,
    refreshUser,
    authToken,
    profile,
    setProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
