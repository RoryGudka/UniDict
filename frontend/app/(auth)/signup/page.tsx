"use client";

import SignUpForm from "@/(auth)/_components/SignUpForm";
import { signUp } from "aws-amplify/auth";
import { useHandleAuthSignUpStep } from "@/_lib/actions";
import { useState } from "react";
import { useToast } from "@/_contexts/ToastContext";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const handleAuthSignUpStep = useHandleAuthSignUpStep();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const output = await signUp({
        username: email,
        password,
        options: { autoSignIn: true, userAttributes: { name } },
      });
      await handleAuthSignUpStep(output, email);
    } catch (e) {
      showToast((e as Error).message || "Error signing up", "error");
    }
  };

  return (
    <SignUpForm
      email={email}
      setEmail={setEmail}
      name={name}
      setName={setName}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSignUp}
    />
  );
}
