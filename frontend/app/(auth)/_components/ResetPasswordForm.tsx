import { Box, Button, Typography } from "@mui/material";

import CustomInput from "@/_components/CustomInput";
import Link from "next/link";
import { SetState } from "@/_lib/model";

interface Props {
  email: string;
  setEmail: SetState<string>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ResetPasswordForm = ({ email, setEmail, onSubmit }: Props) => {
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
        Enter your email address and we'll send you a code to reset your
        password.
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <CustomInput
          placeholder="Email address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: "16px", py: "12px" }}
        >
          <Typography fontWeight={600}>Send reset code</Typography>
        </Button>
      </form>
      <Typography fontSize="14px" fontWeight={600} textAlign="center">
        Remember your password?{" "}
        <Link href="/signin" style={{ color: "#4e6cf9" }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};

export default ResetPasswordForm;
