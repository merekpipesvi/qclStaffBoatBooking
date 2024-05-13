import React from 'react';
import { useRouter } from 'next/router';
import { differenceInMinutes } from 'date-fns';
import { skipToken } from '@reduxjs/toolkit/query';
import { useExtendSessionQuery, useGetMeQuery } from '@/services/authApi';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isOnLoginPage = router.route === '/';
  const { data: currentUser, refetch: refetchMe } =
    useGetMeQuery(undefined, { skip: isOnLoginPage });
  const { isLoading: isExtending, refetch: refetchExtend } =
    useExtendSessionQuery(isOnLoginPage ? skipToken : undefined);
  const [lastExtension, setLastExtension] = React.useState(Date.now());

  React.useEffect(() => {
    const extendSession = async () => {
      const now = Date.now();
      const hasFiveMinutesPast = differenceInMinutes(now, lastExtension) > 5;
      if (!isOnLoginPage && ((hasFiveMinutesPast && !isExtending) || currentUser === undefined)) {
        /**
         * If we haven't extended the session in more than 5 minutes,
         * we should try call extend session to verify there is a session.
         */
          const { isError } = await refetchExtend();
          if (isError) {
            await refetchMe();
            router.push('/');
          } else {
            setLastExtension(now);
          }
      }
    };
    window.addEventListener('click', extendSession);
    return () => {
      window.removeEventListener('click', extendSession);
    };
  }, [router.route, currentUser]);

  return (currentUser !== undefined || isOnLoginPage ? children : <LoadingSpinner />);
};
