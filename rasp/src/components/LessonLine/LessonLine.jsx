import styles from './LessonLine.module.scss'
import mock from '../../mock/pairs'
const LessonLine = ({content}) => {
    return(
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.pair}>{content?.pair} пара</div>
                <div>{mock[content.pair] && (
                    <p>{`${mock[content.pair]}`}</p>
                )}</div>
            </div>
            <div>{content?.title}</div>
            <div className={styles.cell}>{content?.place}</div>
            <div className={styles.cell}>{content?.teacher.join(', ')}</div>
        </div>
    )
}

export default LessonLine;