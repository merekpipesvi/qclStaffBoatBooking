import { useRouter } from "next/router";

export const useIsOnLogin = () => (useRouter().route === '/')