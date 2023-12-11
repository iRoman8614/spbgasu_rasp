import LessonLine from "../LessonLine/LessonLine";

import styles from './Day.module.scss';

const Day = ({ day, dayKey }) => {
    const daySet = {
        1: 'ПН',
        2: 'ВТ',
        3: 'СР',
        4: 'ЧТ',
        5: 'ПТ',
        6: 'СБ',
    }
    const result = daySet[dayKey];

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div>{result}</div>
                <div>{day?.DATE}</div>
            </div>
            <div className={styles.row}>
                {Object.values(day).map((lesson, ind) => (
                    <LessonLine key={ind} content={lesson} />
                ))}
            </div>
        </div>
    );
};

export default Day;
