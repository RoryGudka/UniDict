"use client";

import { Amplify } from "aws-amplify";
import { useEffect } from "react";

const AmplifyConfigure: React.FC = () => {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
          userAttributes: { name: { required: true } },
          loginWith: {
            email: true,
            oauth: {
              domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN!,
              redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN!],
              redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT!],
              responseType: "code",
              providers: ["Google"],
              scopes: [
                "openid",
                "email",
                "profile",
                "aws.cognito.signin.user.admin",
              ],
            },
          },
        },
      },
    });
  }, []);

  return <></>;
};

export default AmplifyConfigure;
