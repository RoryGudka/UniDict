"use client";

import ConfirmSignUpForm from "@/(auth)/_components/ConfirmSignUpForm";
import { confirmSignUp } from "aws-amplify/auth";
import { useHandleAuthSignUpStep } from "@/_lib/actions";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/_contexts/ToastContext";

export default function ConfirmSignUpPage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const email = searchParams.get("email") || "";
  const { showToast } = useToast();
  const handleAuthSignUpStep = useHandleAuthSignUpStep();

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const output = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      await handleAuthSignUpStep(output, email);
    } catch (e) {
      showToast((e as Error).message || "Error confirming sign up");
    }
  };

  return (
    <ConfirmSignUpForm
      email={email}
      code={code}
      setCode={setCode}
      onSubmit={handleConfirmSignUp}
    />
  );
}
