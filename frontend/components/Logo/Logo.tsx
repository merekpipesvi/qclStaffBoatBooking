import { Image, ImageProps } from '@mantine/core';

export const Logo = (props : Omit<ImageProps, 'src'>) => (<Image src="https://www.queencharlottelodge.com/wp-content/uploads/2016/09/qcl-haida-gwaii.png" {...props} />);
