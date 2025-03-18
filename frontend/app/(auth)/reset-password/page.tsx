"use client";

import ResetPasswordForm from "@/(auth)/_components/ResetPasswordForm";
import { resetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/_contexts/ToastContext";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ username: email });
      router.push(`/reset-password/confirm?email=${encodeURIComponent(email)}`);
    } catch (e) {
      showToast((e as Error).message || "Error resetting password", "error");
    }
  };

  return (
    <ResetPasswordForm
      email={email}
      setEmail={setEmail}
      onSubmit={handleResetPassword}
    />
  );
}
