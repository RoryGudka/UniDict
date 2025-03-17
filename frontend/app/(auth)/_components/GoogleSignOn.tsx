import { Button, Typography } from "@mui/material";

import Image from "next/image";
import google from "@/public/google.svg";
import { signInWithRedirect } from "aws-amplify/auth";
import { useToast } from "@/_contexts/ToastContext";

interface Props {
  isSignIn: boolean;
}

const GoogleSignOn: React.FC<Props> = ({ isSignIn }) => {
  const { showToast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (e) {
      showToast((e as Error).message || "Error signing in with Google");
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<Image src={google} alt="Google" width={24} height={24} />}
      onClick={handleGoogleSignIn}
      sx={{ borderColor: "black", color: "black", py: "12px" }}
    >
      <Typography fontWeight={600}>
        {isSignIn ? "Sign in with Google" : "Sign up with Google"}
      </Typography>
    </Button>
  );
};

export default GoogleSignOn;
