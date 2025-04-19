import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

export const useKindeServerSession = () => {
    const { getAccessTokenRaw } = getKindeServerSession();
    return { getAccessTokenRaw };
};
