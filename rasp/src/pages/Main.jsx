import styles from '../pageStyles/Main.module.css'
import mock from "../mock/days";
import Day from "../components/Day/Day";
import {useState} from "react";
import groups from '../mock/groups'

const Main = () => {
    const[placeHolder, setPlaceHolder] = useState('Номер группы')
    const[filterText, setFilterText] = useState('');

    const handleInputChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredMock = groups.filter(item => {
        return item.toLowerCase().includes(filterText.toLowerCase());
    });

    return(
        <div className={styles.root}>
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
            <form className={styles.formBlock}>
                <input className={styles.input} type={"text"} placeholder={placeHolder} onChange={handleInputChange} />
            </form>
            <div className={styles.buttonset}>
                {(filterText !== '') && filteredMock.map((item, ind) => {
                        return(
                            <div className={styles.button} key={ind}>{item}</div>
                        )
                    })
                }
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