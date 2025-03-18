"use client";

import { Suspense, useState } from "react";

import ConfirmSignUpForm from "@/(auth)/_components/ConfirmSignUpForm";
import { confirmSignUp } from "aws-amplify/auth";
import { useHandleAuthSignUpStep } from "@/_lib/actions";
import { useToast } from "@/_contexts/ToastContext";

export default function ConfirmSignUpPage() {
  const [code, setCode] = useState("");
  const { showToast } = useToast();
  const handleAuthSignUpStep = useHandleAuthSignUpStep();

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = window.location.search;
      const email = new URLSearchParams(params).get("email") || "";

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
    <Suspense fallback={<></>}>
      <ConfirmSignUpForm
        code={code}
        setCode={setCode}
        onSubmit={handleConfirmSignUp}
      />
    </Suspense>
  );
}
