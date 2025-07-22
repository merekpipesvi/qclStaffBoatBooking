import React from 'react';
import { useRouter } from 'next/router';
import { differenceInMinutes, subMinutes } from 'date-fns';
import { skipToken } from '@reduxjs/toolkit/query';
import { useExtendSessionQuery, useGetMeQuery } from '@/services/authApi';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useIsOnLogin } from './useIsOnLogin';
import { Container, Paper, Stack, Text } from '@mantine/core';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isOnLoginPage = useIsOnLogin();
  const { data: currentUser, isFetching: isFetchingMe } = useGetMeQuery(undefined, { skip: isOnLoginPage });
  const { isFetching: isExtending, refetch: refetchExtend } =
    useExtendSessionQuery(isOnLoginPage ? skipToken : undefined);

  // Hacky inital value but I want it to load on first click to make sure we are on the right page
  const [lastExtension, setLastExtension] = React.useState(subMinutes(Date.now(), 6).getTime());
  const isIllegallyOnAdminPage = router.route === '/admin' && currentUser !== undefined && currentUser?.role !== 'admin';

  React.useEffect(() => {
    const extendSession = async () => {
      const now = Date.now();
      const hasFiveMinutesPast = differenceInMinutes(now, lastExtension!) > 5;
      if (!isOnLoginPage && hasFiveMinutesPast && !isExtending) {
        /**
         * If we haven't extended the session in more than 5 minutes,
         * we should try call extend session to verify there is a session.
         */
        const { isError: isRefetchError } = await refetchExtend();
        if (isRefetchError) {
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
  }, [router.route, isFetchingMe, isExtending]);

  if(currentUser !== undefined && !currentUser.isConfirmed) {
    return (
      <Container size="15rem" mt='md' pt="10rem">
        <Paper withBorder>
          <Stack ta="center">
            <Text fw={700}>
              Your account is unconfirmed!
            </Text>
            <Text>
              Please politely annoy an admin to confirm it for you.
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  } else {
    return (isFetchingMe || (currentUser === undefined && !isOnLoginPage) || isIllegallyOnAdminPage ? <LoadingSpinner /> : children);
  }

  
};
