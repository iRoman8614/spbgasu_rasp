import styles from './LessonLine.module.css'
const LessonLine = ({content}) => {
    return(
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.pair}>{content?.pair}</div>
                <div>{content?.time}</div>
            </div>
            <div>{content?.title}</div>
            <div>{content?.place}</div>
            <div>{content?.teacher.map((item) => {
                return(
                    <a>{item}</a>
                )
            })}</div>
        </div>
    )
}

export default LessonLine;