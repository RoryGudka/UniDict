import { Box, Button, Typography } from "@mui/material";

import CustomInput from "@/_components/CustomInput";
import { SetState } from "@/_lib/model";
import { useSearchParams } from "next/navigation";

interface Props {
  code: string;
  setCode: SetState<string>;
  newPassword: string;
  setNewPassword: SetState<string>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ConfirmResetPasswordForm = ({
  code,
  setCode,
  newPassword,
  setNewPassword,
  onSubmit,
}: Props) => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Typography
        fontSize="24px"
        fontWeight={900}
        textAlign="center"
        color="#4e6cf9"
        sx={{ mb: "20px" }}
      >
        Reset your password
      </Typography>
      <Typography variant="body1">
        Enter the confirmation code sent to {email} and your new password.
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <CustomInput
          placeholder="Confirmation code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <CustomInput
          placeholder="New password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: "16px", py: "12px" }}
        >
          <Typography fontWeight={600}>Reset password</Typography>
        </Button>
      </form>
    </Box>
  );
};

export default ConfirmResetPasswordForm;
