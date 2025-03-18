import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import CustomInput from "@/_components/CustomInput";
import { resendSignUpCode } from "aws-amplify/auth";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/_contexts/ToastContext";

interface ConfirmSignUpFormProps {
  code: string;
  setCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ConfirmSignUpForm({
  code,
  setCode,
  onSubmit,
}: ConfirmSignUpFormProps) {
  const [cooldown, setCooldown] = useState(0);
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      setCooldown(60);
      showToast("Verification code resent successfully!");
    } catch (e) {
      showToast((e as Error).message || "Error resending verification code");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Typography
        fontSize="24px"
        fontWeight={900}
        textAlign="center"
        color="#4e6cf9"
        sx={{ mb: "20px" }}
      >
        Confirm your email
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          A 6-digit confirmation code has been sent to {email}. The code will
          expire after 5 minutes.
        </Typography>
        <CustomInput
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoFocus
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="text"
            onClick={handleResendCode}
            disabled={cooldown > 0}
            color="secondary"
          >
            <Typography fontSize="14px" fontWeight={600}>
              {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </Typography>
          </Button>
        </Box>
        <Button type="submit" fullWidth variant="contained" sx={{ py: "12px" }}>
          <Typography fontWeight={600}>Confirm Account</Typography>
        </Button>
      </form>
    </Box>
  );
}
