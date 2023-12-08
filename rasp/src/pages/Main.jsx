import React, {useEffect, useState} from 'react';
import Day from '../components/Day/Day';
import groups from '../mock/groups';
import mock from '../mock/days';
import cn from 'classnames'

import styles from '../pageStyles/Main.module.scss';

function getCurrentWeekNumber(year, month, day) {
    const date = new Date(year, month - 1, day);
    const diff = date.getTime() - new Date(year, 0, 1).getTime();
    return Math.ceil((diff / 86400000 + 1) / 7);
}
function getCurrentWeekNumber1st(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear + 86400000) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

const Main = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const weekCounter = getCurrentWeekNumber(year, month, day);

    const startDate = new Date('2023-09-01');
    const currentWeekNumber1st = getCurrentWeekNumber1st(startDate);

    const [page, setPage] = useState(1);
    const [type, setType] = useState(1);
    const [text, setText] = useState('');
    const [option, setOption] = useState('R')
    const [chosenWeek, setChosenWeek] = useState(null)
    const [placeHolder, setPlaceHolder] = useState('Номер группы');
    const [filterText, setFilterText] = useState('');
    const [sliceStart, setSliceStart] = useState(0)
    const [sliceEnd, setSliceEnd] = useState(6)

    useEffect(() => {
        setChosenWeek((weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? '2' : '1');
    }, [weekCounter, currentWeekNumber1st]);

    const handleInputChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredMock = groups.filter((item) => {
        return item.toLowerCase().includes(filterText.toLowerCase());
    });

    const updateTextInUrl = (text) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('text', text);
        setFilterText(text)
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlParams();
    };

    const updatePageInUrl = (page) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', page);
        urlParams.set('type', '1');
        urlParams.set('text', '');
        setPage(page);
        setType(1);
        setFilterText('');
        window.history.pushState({}, '', `?${urlParams}`);
    };

    const updateTypeInUrl = (type) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('type', type);
        urlParams.set('text', '');
        setType(type);
        setFilterText('');
        window.history.pushState({}, '', `?${urlParams}`);
    };

    const updateUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newPage = parseInt(urlParams.get('page')) || 1;
        const newType = parseInt(urlParams.get('type')) || 1;
        const newText = urlParams.get('text') || '';
        setPage(newPage);
        setType(newType);
        setText(newText);
    };

    useEffect(() => {
        if (!window.location.search) {
            window.history.replaceState({}, '', '?page=1&type=1&text=');
            updateUrlParams();
        } else {
            updateUrlParams();
        }
    }, [page, type, text]);

    useEffect(() => {
        const handlePopState = () => {
            updateUrlParams();
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlType = parseInt(urlParams.get('type')) || 1;
        setType(urlType);
        const isValidType = [1, 2, 3, 4].includes(urlType);
        setType(isValidType ? urlType : 1);
        switch (urlType) {
            case 1:
                setPlaceHolder('Номер группы');
                break;
            case 2:
                setPlaceHolder('Номер аудитории');
                break;
            case 3:
                setPlaceHolder('ФИО');
                break;
            default:
                setPlaceHolder('');
        }
    }, [type]);

    const changeWeek = (start, end) => {
        setSliceStart(start)
        setSliceEnd(end)
    }

    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString("ru-RU", options);

    const handleClick = (num) => {
        if (num !== chosenWeek) {
            setChosenWeek(num);
            if (chosenWeek === '1') {
                changeWeek(0, 6);
            } else {
                changeWeek(6, 12);
            }
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.navbar}>
                <div
                    className={cn(styles.link, {
                        [styles.activeLink]: page === 1,
                    })}
                    onClick={() => updatePageInUrl(1)}>
                    Расписание ОФО
                </div>
                <div
                    className={cn(styles.link, {
                        [styles.activeLink]: page === 2,
                    })}
                    onClick={() => updatePageInUrl(2)}>
                    Расписание ОЗФО и ЗФО
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.typebar}>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 1,
                        })}
                        onClick={() => updateTypeInUrl(1)}>Поиск</div>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 2,
                        })}
                        onClick={() => updateTypeInUrl(2)}>Аудитории</div>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 3,
                        })}
                        onClick={() => updateTypeInUrl(3)}>Преподаватели</div>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 4,
                        })}
                        onClick={() => updateTypeInUrl(4)}>Структура</div>
                </div>
                {type !== 4 &&
                    <div>
                        <form className={styles.formBlock}>
                            <input
                                className={styles.input}
                                type={'text'}
                                placeholder={placeHolder}
                                onChange={handleInputChange}
                                value={filterText}
                            />
                        </form>
                        <div className={styles.buttonset}>
                            {filterText !== '' &&
                                filteredMock.map((item, ind) => {
                                    return (
                                        <div
                                            className={cn(styles.button, {
                                                [styles.activeButton]: item === text ,
                                            })}
                                            key={ind}
                                            onClick={() => {
                                                updateTextInUrl(item);
                                            }}
                                        >
                                            {item}
                                        </div>
                                    );
                                })}
                        </div>
                        {text !== '' &&
                            <div className={styles.options}>
                                <div
                                    className={cn(styles.button, {
                                        [styles.activeButton]: option === 'R',
                                    })}
                                    onClick={() => setOption('R')}>
                                    Расписание
                                </div>
                                <div
                                    className={cn(styles.button, {
                                        [styles.activeButton]: option === 'S',
                                    })}
                                    onClick={() => setOption('S')}>
                                    Сессия
                                </div>
                            </div>
                        }
                        {text !== '' && page === 1 &&
                            <div className={styles.weekBlock}>
                                <div className={styles.weekSet}>
                                    <div
                                        className={cn(styles.button, {
                                            [styles.activeButton]: chosenWeek === '1',
                                        })}
                                        onClick={() => handleClick('1')}>
                                        {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 1 && <a>Сегодня</a>} Числитель
                                    </div>
                                    <div
                                        className={cn(styles.button, {
                                            [styles.activeButton]: chosenWeek === '2',
                                        })}
                                        onClick={() => handleClick('2')}>
                                        {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 && <a>Сегодня</a>} Знаменатель
                                    </div>
                                </div>
                                <div className={styles.today}>
                                    Сегодня:<br /> {formattedDate}<br /> Неделя: {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? <a>знаменатель</a> : <a>числитель</a>}
                                </div>
                            </div>
                        }
                    </div>
                }
                {page === 3 && <div>
                    <p>Номер текущей недели с начала года: {weekCounter + 1}</p>
                    <p>Номер недели в которую входит дата 1.09: {currentWeekNumber1st}</p>
                    <p>номер текущей учебной недели {weekCounter + 1 - currentWeekNumber1st + 1}</p>
                </div>}
                {text !== '' && option === 'R' && mock.R.slice(sliceStart, sliceEnd).map((item, ind) => {
                    return <Day day={item} key={ind} />;
                })}
                {text !== '' && option === 'S' && mock.S.map((item, ind) => {
                    return <Day day={item} key={ind} />;
                })}
            </div>
        </div>
    );
};

export default Main;
