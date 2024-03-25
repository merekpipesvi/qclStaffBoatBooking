import classes from '../styles/LogInPage.module.css';
import { LogIn } from '../components/LogIn/LogIn';

const HomePage = () => (
    <div className={classes.container}>
        <LogIn />
    </div>
);
export default HomePage;
