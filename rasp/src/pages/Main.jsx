import React, {useEffect, useState} from 'react';
import axios from 'axios'
import cn from 'classnames'
import Day from '../components/Day/Day';

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

    const[page, setPage] = useState('o');
    const[type, setType] = useState('GROUP');
    const[text, setText] = useState('');
    const[option, setOption] = useState('r')
    const[chosenWeek, setChosenWeek] = useState(null)
    const[placeHolder, setPlaceHolder] = useState('Номер группы');
    const[filterText, setFilterText] = useState('');
    const[facultet, setFacultet] = useState('')
    const[studyType, setStudyType] = useState('')
    const[studyYear, setStudyYear] = useState('')
    const[level2, setLevel2] = useState([])
    const[level3, setLevel3] = useState([])
    const[allData, setAllData] = useState({});
    const[searchData, setSearchData] =useState({})

    //useEffect(() => {
    const request = () => {
        console.log('the first useEffect starts');
        const requestData = {
            token: "d0a47ed8f69a0844d71001d68fb71f1922be499989562c5b2f7b91e63c6d2293",
            action: "getData"
        };
        const url = '/api/v1/';
        axios.post(url, requestData)
            .then(response => {
                setAllData(response.data);
                console.log('response.data', response.data)
                console.log('allData', allData)
            })
            .catch(error => {
                console.error('Axios error:', error);
            });
    }
    //}, []);

    useEffect(() => {
        let requestData;
        if(type === 'STRUCTURE') {
            requestData = {
                "token":"d0a47ed8f69a0844d71001d68fb71f1922be499989562c5b2f7b91e63c6d2293",
                "action":"search",
                "type": "GROUP",
                "page": page,
                "search":text
            };
        } else {
            requestData = {
                "token":"d0a47ed8f69a0844d71001d68fb71f1922be499989562c5b2f7b91e63c6d2293",
                "action":"search",
                "type": type,
                "page": page,
                "search":text
            };
        }
        const url = '/api/v1/';
        axios.post(url, requestData)
            .then(response => {
                setSearchData(response.data);
            })
            .catch(error => {
                console.error('Axios error:', error);
            });
    }, [text]);

    function getKeysByLevel(obj, targetLevel, currentLevel = 1) {
        let keys = [];
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                if (currentLevel === targetLevel) {keys.push(key)}
                keys = keys.concat(getKeysByLevel(obj[key], targetLevel, currentLevel + 1).map(subKey => `${key}.${subKey}`));
            }
        }
        return keys;
    }

    console.log('allData', allData)
    let data, structureLv1, structureLv2, structureLv3;

    useEffect(() => {
        request()
        if (type === 'GROUP') {
            console.log('groups', allData)
            data = allData?.GROUPS && allData.GROUPS[page];
            console.log('groups', data)
        } else if (type === 'PROFESSOR') {
            data = allData?.PROFESSORS;
            console.log('PROFESSORS', data)
        } else if (type === 'AUDITORIUM') {
            data = allData?.AUDITORIUMS;
            console.log('AUDITORIUMS', data)
        } else if (type === 'STRUCTURE') {
            data = [];
            structureLv1 = getKeysByLevel(allData?.STRUCTURE[page], 1)
            structureLv2 = getKeysByLevel(allData?.STRUCTURE[page], 2)
            structureLv3 = getKeysByLevel(allData?.STRUCTURE[page], 3)
        }
    }, [type]);

    const facultetUpdate = (item) => {
        setFacultet(item);
        setStudyYear('');
        setStudyType('');
        updateTextInUrl('');
    }

    useEffect(() => {
        if(facultet !== '') {
            const filteredArray = structureLv2.filter(item => item.startsWith(facultet)).map(item => item.split('.')[1]);
            setLevel2(filteredArray);
            setLevel3([]);
            setStudyYear('');
            setStudyType('');
        }
    }, [facultet])

    const studyTypeUpdate = (item) => {
        setStudyType(item)
    }

    useEffect(() => {
        if(facultet !== '' && studyType !== '') {
            const filteredArray = structureLv3.filter(item => item.startsWith(`${facultet}.${studyType}`)).map(item => item.split('.').pop());
            setLevel3(filteredArray)
            setStudyYear('')
        }
    }, [studyType])

    const studyYearUpdate = (item) => {
        setStudyYear(item)
    }

    useEffect(() => {
        setChosenWeek((weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? '2' : '3');
    }, [weekCounter, currentWeekNumber1st]);

    const handleInputChange = (event) => {
        setFilterText(event.target.value);
    };

    let filteredMock;
    useEffect(() => {
        console.log('filteredMock', data)
        filteredMock = data?.filter((item) => {
            if(type === 'STRUCTURE' && data !== undefined) {
                return null
            } else {
                return item.toLowerCase().includes(filterText.toLowerCase());
            }
        });
        console.log('filteredMockMock', filteredMock)
    }, [handleInputChange])

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
        urlParams.set('type', 'GROUP');
        urlParams.set('text', '');
        setPage(page);
        setType('GROUP');
        setFilterText('');
        window.history.pushState({}, '', `?${urlParams}`);
    };
    const updateTypeInUrl = (type) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('type', type);
        urlParams.set('text', '');
        setType(type);
        setFilterText('');
        setFacultet('')
        setStudyType('')
        setStudyYear('')
        window.history.pushState({}, '', `?${urlParams}`);
    };
    const updateUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newPage = urlParams.get('page') || 'o';
        const newType = urlParams.get('type') || 'GROUP';
        const newText = urlParams.get('text') || '';
        setPage(newPage);
        setType(newType);
        setText(newText);
    };
    useEffect(() => {
        if (!window.location.search) {
            window.history.replaceState({}, '', '?page=o&type=GROUP&text=');
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
        const urlType = urlParams.get('type') || 'GROUP';
        setType(urlType);
        const isValidType = ['GROUP', 'PROFESSOR', 'AUDITORIUM', 'STRUCTURE'].includes(urlType);
        setType(isValidType ? urlType : 'GROUP');
        switch (urlType) {
            case 'GROUP':
                setPlaceHolder('Номер группы');
                break;
            case 'AUDITORIUM':
                setPlaceHolder('Номер аудитории');
                break;
            case 'PROFESSOR':
                setPlaceHolder('ФИО');
                break;
            default:
                setPlaceHolder('');
        }
    }, [type]);

    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString("ru-RU", options);
    const handleClick = (num) => {
        if (num !== chosenWeek) {
            setChosenWeek(num);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.navbar}>
                <div
                    className={cn(styles.link, {
                        [styles.activeLink]: page === 'o',
                    })}
                    onClick={() => updatePageInUrl('o')}>
                    Расписание ОФО
                </div>
                <div
                    className={cn(styles.link, {
                        [styles.activeLink]: page === 'z',
                    })}
                    onClick={() => updatePageInUrl('z')}>
                    Расписание ОЗФО и ЗФО
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.typebar}>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 'GROUP',
                        })}
                        onClick={() => updateTypeInUrl('GROUP')}>Поиск</div>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 'AUDITORIUM',
                        })}
                        onClick={() => updateTypeInUrl('AUDITORIUM')}>Аудитории</div>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 'PROFESSOR',
                        })}
                        onClick={() => updateTypeInUrl('PROFESSOR')}>Преподаватели</div>
                    <div
                        className={cn(styles.type, {
                            [styles.activeType]: type === 'STRUCTURE',
                        })}
                        onClick={() => updateTypeInUrl('STRUCTURE')}>Структура</div>
                </div>
                {type !== 'STRUCTURE' &&
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
                                            }}>
                                            {item}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                }
                <div className={styles.buttonset}>
                    {type === 'STRUCTURE' && structureLv1.map((item, ind) => {
                        return (
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: item === facultet ,
                                })}
                                key={ind}
                                onClick={() => {
                                    facultetUpdate(item);
                                }}>
                                {item}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.buttonset}>
                    {type === 'STRUCTURE' && facultet !== '' && level2 !== []  && level2.map((item, ind) => {
                        return (
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: item === studyType ,
                                })}
                                key={ind}
                                onClick={() => {studyTypeUpdate(item)}}>
                                {item}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.buttonset}>
                    {type === 'STRUCTURE' && facultet !== '' && studyType !== '' && level3 !== []  && level3.map((item, ind) => {
                        return (
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: item === studyYear ,
                                })}
                                key={ind}
                                onClick={() => {studyYearUpdate(item)}}>
                                {`${item} курс`}
                            </div>);})}
                </div>
                <div className={styles.buttonset}>
                    {type === 'STRUCTURE' && facultet !== '' && studyType !== '' && studyYear !== '' && allData.STRUCTURE[page][facultet][studyType][studyYear].map((item, ind) => {
                        return (
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: item === text ,
                                })}
                                key={ind}
                                onClick={() => {updateTextInUrl(item)}}>
                                {item}
                            </div>
                        );
                    })}
                </div>
                {text !== '' &&
                    <div className={styles.options}>
                        <div
                            className={cn(styles.button, {
                                [styles.activeButton]: option === 'r',
                            })}
                            onClick={() => setOption('r')}>
                            Расписание
                        </div>
                        <div
                            className={cn(styles.button, {
                                [styles.activeButton]: option === 's',
                            })}
                            onClick={() => setOption('s')}>
                            Сессия
                        </div>
                    </div>
                }
                {text !== '' && page === 'o' && option !== 's' &&
                    <div className={styles.weekBlock}>
                        <div className={styles.weekSet}>
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: chosenWeek === '3',
                                })}
                                onClick={() => handleClick('3')}>
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
                        <div className={styles.links}>
                            <div className={styles.excel}>
                                <a href={`https://rasp.spbgasu.ru/getExcel.php?TYPE=GROUPS&FIND=${text}`}>Выгрузить в
                                    Excel</a>
                            </div>
                            <div className={styles.today}>
                                Сегодня:<br /> {formattedDate}<br /> Неделя: {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? <a>знаменатель</a> : <a>числитель</a>}
                            </div>
                        </div>
                    </div>
                }
                {page === 'o' && text !== '' && option === 'r' && chosenWeek !== null &&
                    typeof searchData.r[chosenWeek] === 'object' &&
                    Object.keys(searchData.r[chosenWeek]).map((dayKey, ind) => {
                        const day = searchData.r[chosenWeek][dayKey];
                        return <Day day={day} dayKey={dayKey} key={ind} />;
                    })
                }
                {page === 'o' && text !== '' && option === 's' && Object.keys(searchData.s).map((weekKey) => (
                    Object.keys(searchData.s[weekKey]).map((dayKey) => {
                        const day = searchData.s[weekKey][dayKey];
                        return <Day day={day} dayKey={dayKey} key={`${weekKey}-${dayKey}`} />;
                    })
                ))}
                {page === 'z' && text !== '' &&
                    <div className={styles.weekBlock}>
                        <div className={styles.weekSet}>
                            {getKeysByLevel(searchData[option], 1).map((item, ind) => {
                                return(
                                    <div className={cn(styles.button, {
                                        [styles.activeButton]: chosenWeek === item,
                                    })} key={ind} onClick={() => setChosenWeek(item)}>{item} неделя</div>
                                )
                            })}
                        </div>
                        <div className={styles.links}>
                            <div className={styles.excel}>
                                <a href={`https://rasp.spbgasu.ru/getExcel.php?TYPE=GROUPS&FIND=${text}`}>Выгрузить в Excel</a>
                            </div>
                            <div className={styles.today}>
                                Сегодня:<br /> {formattedDate}<br /> Неделя: {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? <a>знаменатель</a> : <a>числитель</a>}
                            </div>
                        </div>
                    </div>
                }
                {page === 'z' && text !== '' && option === 'r' && chosenWeek !== null &&
                    searchData.r[chosenWeek] && typeof searchData.r[chosenWeek] === 'object' &&
                    Object.keys(searchData.r[chosenWeek]).map((dayKey, ind) => {
                        const day = searchData.r[chosenWeek][dayKey];
                        return <Day day={day} dayKey={dayKey}  key={ind} />;
                    })
                }
                {page === 'z' && text !== '' && option === 's' && Object.keys(searchData.s).map((weekKey) => (
                    Object.keys(searchData.s[weekKey]).map((dayKey) => {
                        const day = searchData.s[weekKey][dayKey];
                        return <Day day={day} dayKey={dayKey} key={`${weekKey}-${dayKey}`} />;
                    })
                ))}
            </div>
        </div>
    );
};
export default Main;