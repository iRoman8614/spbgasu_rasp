import styles from './LessonLine.module.scss';
import mock from '../../mock/pairs';

const LessonLine = ({ content }) => {
    const timeToPairMap = {
        '9.00-10.30': 1,
        '10.45-12.15': 2,
        '12.30-14.00': 3,
        '15.00-16.30': 4,
        '16.45-18.15': 5,
        '18.30-20.00': 6,
        '20.15-21.45': 7,
    };
    const pair = timeToPairMap[content?.TIME];

    return (
        <div>
            {content?.MODULE === undefined &&  <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.pair}>{pair} пара</div>
                    <div>
                        <p>{content?.TIME}</p>
                    </div>
                </div>
                <div>{content?.LESSON}</div>
                <div className={styles.cell}>{content?.AUDITORIUM}</div>
                <div className={styles.cell}>{content?.PROFESSOR}</div>
            </div>}


            {content?.MODULE === 1 && <div className={styles.moduleRoot}>
                <div className={styles.container}>
                    <div className={styles.pair}>{pair} пара</div>
                    <div>
                        <p>{content?.TIME}</p>
                    </div>
                </div>
                <div className={styles.table}>
                    <div>Модуль</div>
                    {content?.LESSON.map((item, ind) => {
                        return(
                            <div className={styles.moduleContainer} key={ind}>
                                <div>{item?.LESSON}</div>
                                <div className={styles.cell}>{item?.AUDITORIUM}</div>
                                <div className={styles.cell}>
                                    <div className={styles.profs}>
                                        <div>{item.KAF}</div>
                                        <div>{item?.PROFESSOR}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>}
        </div>

    );
};

export default LessonLine;
