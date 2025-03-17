import { Box, Button, Typography } from "@mui/material";

import CustomInput from "@/_components/CustomInput";
import GoogleSignOn from "@/(auth)/_components/GoogleSignOn";
import Link from "next/link";
import { SetState } from "@/_lib/model";

interface Props {
  email: string;
  setEmail: SetState<string>;
  name: string;
  setName: SetState<string>;
  password: string;
  setPassword: SetState<string>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignUpForm = ({
  email,
  setEmail,
  name,
  setName,
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
        Create your account
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
          placeholder="Full name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <CustomInput
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: "16px", py: "12px" }}
        >
          Sign up
        </Button>
      </form>
      <GoogleSignOn isSignIn={false} />
      <Typography fontSize="14px" fontWeight={600} textAlign="center">
        Don&apos;t have an account?{" "}
        <Link href="/signin" style={{ color: "#4e6cf9" }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpForm;
