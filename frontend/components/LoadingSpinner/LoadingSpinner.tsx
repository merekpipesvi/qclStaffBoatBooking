import { Loader, Text } from '@mantine/core';
import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = () => (
    <div className={styles.container}>
        <Loader size={100} />
        <Text className={styles.loadingText} c="qclRed">
          Loading...
        </Text>
    </div>);
