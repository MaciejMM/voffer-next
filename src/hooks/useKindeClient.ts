import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export const useKindeClient = () => {
    const { user, getUser, getAccessTokenRaw } = useKindeBrowserClient();
    return { user, getUser, getAccessTokenRaw };
};
