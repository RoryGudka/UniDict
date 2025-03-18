"use client";

import { Suspense, useState } from "react";

import ConfirmResetPasswordForm from "@/(auth)/_components/ConfirmResetPasswordForm";
import { confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/_contexts/ToastContext";

export default function ConfirmResetPasswordPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { showToast } = useToast();

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const params = window.location.search;
      const email = new URLSearchParams(params).get("email") || "";

      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      showToast("Password reset successfully!", "success");
      router.push("/signin");
    } catch (e) {
      showToast(
        (e as Error).message || "Error confirming password reset",
        "error"
      );
    }
  };

  return (
    <Suspense fallback={<></>}>
      <ConfirmResetPasswordForm
        code={code}
        setCode={setCode}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onSubmit={handleConfirmResetPassword}
      />
    </Suspense>
  );
}
