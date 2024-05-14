import { Image, ImageProps } from '@mantine/core';
import { useRouter } from 'next/router';

export const Logo = (props : Omit<ImageProps, 'src'>) => {
    const router = useRouter();
    return(
        <Image 
            src="https://www.queencharlottelodge.com/wp-content/uploads/2016/09/qcl-haida-gwaii.png" 
            onClick={() => router.push('/booking')} 
            {...props} 
        />
    );
};
