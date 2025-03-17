"use client";

import SignInForm from "@/(auth)/_components/SignInForm";
import { signIn } from "aws-amplify/auth";
import { useHandleAuthSignInStep } from "@/_lib/actions";
import { useState } from "react";
import { useToast } from "@/_contexts/ToastContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const handleAuthSignInStep = useHandleAuthSignInStep();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const output = await signIn({ username: email, password });
      await handleAuthSignInStep(output, email);
    } catch (e) {
      showToast((e as Error).message || "Error signing in");
    }
  };

  return (
    <SignInForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSignIn}
    />
  );
}
