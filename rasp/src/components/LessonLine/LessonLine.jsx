import styles from './LessonLine.module.css'
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
            <div>{content?.place}</div>
            <div>{content?.teacher.join(', ')}</div>
        </div>
    )
}

export default LessonLine;