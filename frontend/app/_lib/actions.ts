import { Entry, Part, Request, SetState, Translation } from "@/_lib/model";
import { SignInOutput, SignUpOutput } from "aws-amplify/auth";

import { createId } from "@/_lib/misc";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useUser } from "@/_contexts/UserContext";

const getPartsRequest = `requestId:GET_PARTS:partId:segment`;
const getEntriesRequest = `requestId:GET_ENTRIES:entryId:segment`;
const getEntryDetailsRequest = `requestId:GET_ENTRY_DETAILS:entryId:detailId:segment`;
const getEntryModificationRequest = `requestId:GET_ENTRY_MODIFICATION:entryId:detailId:segment`;
const getEntryConversationRequest = `requestId:GET_ENTRY_CONVERSATION:entryId:detailId:segment`;
const setEntryDoneRequest = `requestId:SET_DONE:ENTRY:entryId`;
const getTranslationRequest = `requestId:GET_TRANSLATION:segment`;
const getTranslationConversationRequest = `requestId:GET_TRANSLATION_CONVERSATION:translationId:segment`;
const setRequestDoneRequest = `requestId:SET_DONE:REQUEST`;

interface Context {
  setParts: SetState<Part[]>;
  setEntries: SetState<Entry[]>;
  setTranslations: SetState<Translation[]>;
  setRequests: SetState<Request[]>;
}

type Handler = (context: Context) => (args: { [key: string]: string }) => void;

const getPartsHandler: Handler =
  ({ setParts }) =>
  ({ partId, segment }) => {
    setParts((prev) => [...prev, { id: partId, value: segment }]);
  };

const getEntriesHandler: Handler =
  ({ setEntries }) =>
  ({ entryId, segment }) => {
    setEntries((prev) => [...prev, { id: entryId, value: segment }]);
  };

const getEntryDetailsHandler: Handler =
  ({ setEntries }) =>
  ({ entryId, detailId, segment }) => {
    setEntries(
      produce((prev) => {
        const entry = prev.find((entry) => entry.id === entryId);
        if (!entry) return prev;
        if (!entry.details) entry.details = [];
        const detail = entry.details?.find((detail) => detail.id === detailId);
        if (!detail) {
          entry.details.push({
            id: detailId,
            value: segment,
            messages: [],
          });
        } else {
          detail.value = `${detail.value}${segment}`;
        }
      })
    );
  };

const getEntryModificationHandler: Handler =
  ({ setEntries }) =>
  ({ entryId, detailId, segment }) => {
    setEntries(
      produce((prev) => {
        const entry = prev.find((entry) => entry.id === entryId);
        if (!entry) return prev;
        if (!entry.details) entry.details = [];
        const detail = entry.details?.find((detail) => detail.id === detailId);
        if (!detail) {
          entry.details.push({
            id: detailId,
            value: segment,
            messages: [],
          });
        } else {
          detail.value = `${detail.value}${segment}`;
        }
      })
    );
  };

const getEntryConversationHandler: Handler =
  ({ setEntries }) =>
  ({ entryId, detailId, segment }) => {
    setEntries(
      produce((prev) => {
        const entry = prev.find((entry) => entry.id === entryId);
        if (!entry) return prev;
        if (!entry.details) entry.details = [];
        const detail = entry.details?.find((detail) => detail.id === detailId);
        if (!detail?.messages) return;
        const message = detail.messages[detail.messages.length - 1];
        if (message.source !== "assistant") {
          detail.messages.push({ source: "assistant", content: segment });
        } else {
          message.content += segment;
        }
      })
    );
  };

const setEntryDoneHandler: Handler =
  ({ setEntries }) =>
  ({ entryId }) => {
    setEntries(
      produce((prev) => {
        const entry = prev.find((entry) => entry.id === entryId);
        if (!entry) return prev;
        entry.isDone = true;
      })
    );
  };

const getTranslationHandler: Handler =
  ({ setTranslations }) =>
  ({ segment }) => {
    setTranslations((prev) => {
      if (!prev.length) {
        return [{ id: createId(), value: segment, messages: [] }];
      } else {
        return [{ ...prev[0], value: prev[0].value + segment }];
      }
    });
  };

const getTranslationConversationHandler: Handler =
  ({ setTranslations }) =>
  ({ translationId, segment }) => {
    setTranslations(
      produce((prev) => {
        const translation = prev.find(({ id }) => id === translationId);
        if (!translation) return prev;
        if (!translation?.messages) return;
        const message = translation.messages[translation.messages.length - 1];
        if (message.source !== "assistant") {
          translation.messages.push({ source: "assistant", content: segment });
        } else {
          message.content += segment;
        }
      })
    );
  };

const setRequestDoneHandler: Handler =
  ({ setRequests }) =>
  ({ requestId }) => {
    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  };

export const getHandlers = (c: Context) => ({
  [getPartsRequest]: getPartsHandler(c),
  [getEntriesRequest]: getEntriesHandler(c),
  [getEntryDetailsRequest]: getEntryDetailsHandler(c),
  [getEntryModificationRequest]: getEntryModificationHandler(c),
  [getEntryConversationRequest]: getEntryConversationHandler(c),
  [setEntryDoneRequest]: setEntryDoneHandler(c),
  [getTranslationRequest]: getTranslationHandler(c),
  [getTranslationConversationRequest]: getTranslationConversationHandler(c),
  [setRequestDoneRequest]: setRequestDoneHandler(c),
});

type MatcherFn = (arg: { [key: string]: string }) => void;
type MatcherMap = { [matcher: string]: MatcherFn };

export const handleMessage = async (message: string, map: MatcherMap) => {
  const isMessageVariable = (part: string) => {
    return part[0] === part[0].toLowerCase();
  };

  const messageParts = message.split("⌺");
  const matchers = Object.keys(map);
  for (let i = 0; i < matchers.length; i++) {
    const matcher = matchers[i];
    const matcherParts = matcher.split(":");
    if (matcherParts.length !== messageParts.length) continue;
    const isMatch = messageParts.every((messagePart, i) => {
      const matcherPart = matcherParts[i];
      if (isMessageVariable(matcherPart)) return true;
      return messagePart === matcherPart;
    });
    const values = matcherParts
      .map((matcherPart, i) => [matcherPart, messageParts[i]])
      .filter(([matcherPart]) => isMessageVariable(matcherPart));
    const args = Object.fromEntries(values);
    if (isMatch) return await map[matcher](args);
  }
};

export const useHandleAuthSignUpStep = () => {
  const router = useRouter();

  return async (output: SignUpOutput, email: string) => {
    const { signUpStep } = output.nextStep;
    if (signUpStep === "CONFIRM_SIGN_UP") {
      await router.push(`/confirm-signup?email=${encodeURIComponent(email)}`);
    } else {
      await router.push("/signin");
    }
  };
};

export const useHandleAuthSignInStep = () => {
  const router = useRouter();
  const { refreshUser } = useUser();

  return async (output: SignInOutput, email: string) => {
    const { signInStep } = output.nextStep;
    if (signInStep === "CONFIRM_SIGN_UP") {
      await router.push(`/confirm-signup?email=${encodeURIComponent(email)}`);
    } else {
      await refreshUser();
      await router.push("/");
    }
  };
};
