import { Box, Button, Typography } from "@mui/material";

import CustomInput from "@/_components/CustomInput";
import GoogleSignOn from "@/(auth)/_components/GoogleSignOn";
import Link from "next/link";
import { SetState } from "@/_lib/model";

interface Props {
  email: string;
  setEmail: SetState<string>;
  password: string;
  setPassword: SetState<string>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Typography
        fontSize="24px"
        fontWeight={900}
        textAlign="center"
        color="#4e6cf9"
        sx={{ mb: "20px" }}
      >
        Unlock your potential
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
        <CustomInput
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ lineHeight: 1 }}
        />
        <Link href="/reset-password" style={{ color: "#4e6cf9" }}>
          <Typography textAlign="right" fontSize="14px" fontWeight={600}>
            Forgot password?
          </Typography>
        </Link>
        <Button fullWidth type="submit" variant="contained" sx={{ py: "12px" }}>
          <Typography fontWeight={600}>Sign in</Typography>
        </Button>
      </form>
      <GoogleSignOn isSignIn={true} />
      <Typography fontSize="14px" fontWeight={600} textAlign="center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "#4e6cf9" }}>
          Sign up
        </Link>
      </Typography>
    </Box>
  );
};

export default SignInForm;
