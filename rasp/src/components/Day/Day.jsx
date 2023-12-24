import LessonLine from "../LessonLine/LessonLine";

import styles from './Day.module.scss';

const Day = ({ day, dayKey, option }) => {
    const daySet = {
        1: 'ПН',
        2: 'ВТ',
        3: 'СР',
        4: 'ЧТ',
        5: 'ПТ',
        6: 'СБ',
    }
    const result = daySet[dayKey];
    const dayDate = Object.values(day)[0]?.DATE;

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div>{result}</div>
                {option === 's' && <div>{dayDate}</div>}
            </div>
            <div className={styles.row}>
                {Object.entries(day).map(([lessonKey, lesson], ind) => (
                    <LessonLine key={ind} content={lesson} />
                ))}
            </div>
        </div>
    );
};

export default Day;