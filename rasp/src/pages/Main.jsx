import styles from '../pageStyles/Main.module.css'
import mock from "../mock/days";
import Day from "../components/Day/Day";

const Main = () => {
    return(
        <div>
            <div className={styles.navbar}>
                <div className={styles.link}>Расписание ОФО</div>
                <div className={styles.link}>Расписание ОЗФО и ЗФО</div>
                <div className={styles.link}>Расписание Сессии</div>
            </div>
            <div className={styles.typebar}>
                <div>поиск</div>
                <div>аудитории</div>
                <div>преподаватели</div>
                <div>структура</div>
            </div>
            {
                mock.map((item, ind) => {
                    return(
                        <Day day={item} key={ind} />
                    )
                })
            }
        </div>
    )
}

export default Main;