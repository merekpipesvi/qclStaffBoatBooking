import { useIsOnLogin } from '@/utils/useIsOnLogin';
import { Button, Image, ImageProps } from '@mantine/core';
import { useRouter } from 'next/router';

export const Logo = (props : Omit<ImageProps, 'src'>) => {
    const router = useRouter();
    const isOnLogin = useIsOnLogin();
    return(
        <Button variant='subtle' h="60px">
            <Image 
                src="../../static/QCL_Logo.png" 
                onClick={() => isOnLogin ? null : router.push('/booking')} 
                {...props} 
            />
        </Button>
    );
};
