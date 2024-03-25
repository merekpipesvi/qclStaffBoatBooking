import { Loader, Text } from '@mantine/core';
import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = () => (
    <div className={styles.container}>
        <Loader color="blue" size={100} />
        <Text inherit variant="gradient" className={styles.loadingText}>
          Loading...
        </Text>
    </div>);
