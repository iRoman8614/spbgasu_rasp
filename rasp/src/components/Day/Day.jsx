import styles from './Day.module.css'
import LessonLine from "../LessonLine/LessonLine";

const Day = ({day}) => {
    return(
        <div className={styles.root}>
            <div className={styles.container}>
                <div>{day?.day}</div>
                <div>{day?.data}</div>
            </div>
            <div className={styles.row}>
                {day?.lessons.map((item, ind) => {
                    return(
                        <LessonLine key={ind} content={item} />
                    )
                })}
            </div>
        </div>
    )
}

export default Day;