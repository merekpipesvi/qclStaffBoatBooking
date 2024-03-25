import React from 'react';
import { useRouter } from 'next/router';
import { useGetMeQuery } from '@/services/authApi';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isOnLoginPage = router.route === '/';
  const { data: currentUser, isFetching, isUninitialized } =
    useGetMeQuery(undefined, { skip: isOnLoginPage });
  const [shouldRenderChildren, setShouldRenderChildren] = React.useState(false);

  React.useEffect(() => {
    if (!isFetching && !isUninitialized && currentUser === undefined && !isOnLoginPage) {
        /**
         * If we're done fetching, and the current user is still undefined, and we're not on login page,
         * we should route back to the login page. This is because the user likely hasn't been authorized.
         */
        router.push('/');
    } else {
        // Otherwise, show the page!
        setShouldRenderChildren(true);
    }
  }, [isFetching, currentUser, router.route]);

  return (shouldRenderChildren ? children : <LoadingSpinner />);
};
