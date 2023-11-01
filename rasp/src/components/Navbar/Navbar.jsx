import styles from './Navbar.module.css';
import {NavLink} from "react-router-dom";

const Navbar = () => {
    return(
        <div className={styles.root}>
            <NavLink to={'/'}>Расписание ОФО</NavLink>
            <NavLink to={'/Room'}>Расписание ОЗФО и ЗФО</NavLink>
            <NavLink to={'/Teacher'}>Расписание Сессии</NavLink>
        </div>
    )
}

export default Navbar;