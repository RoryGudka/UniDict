"use client";

import { useRouter, useSearchParams } from "next/navigation";

import ConfirmResetPasswordForm from "@/(auth)/_components/ConfirmResetPasswordForm";
import { confirmResetPassword } from "aws-amplify/auth";
import { useState } from "react";
import { useToast } from "@/_contexts/ToastContext";

export default function ConfirmResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const email = searchParams.get("email") || "";
  const { showToast } = useToast();

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      showToast("Password reset successfully!");
      router.push("/signin");
    } catch (e) {
      showToast((e as Error).message || "Error confirming password reset");
    }
  };

  return (
    <ConfirmResetPasswordForm
      email={email}
      code={code}
      setCode={setCode}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      onSubmit={handleConfirmResetPassword}
    />
  );
}
