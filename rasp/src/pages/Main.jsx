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

function getDateRange(weekNumber) {
    const weekNumberAsInt = parseInt(weekNumber, 10);
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear(), 0, 2 + (weekNumberAsInt - 1) * 7);
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear(), 0, 7 + (weekNumberAsInt - 1) * 7);
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return `${startDate.toLocaleDateString('ru-RU', options)} - ${endDate.toLocaleDateString('ru-RU', options)}`;
}

const Main = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const weekCounter = getCurrentWeekNumber(year, month, day);
    const startDate = new Date('2023-09-01');
    const currentWeekNumber1st = getCurrentWeekNumber1st(startDate);

    const[page, setPage] = useState();
    const[type, setType] = useState();
    const[text, setText] = useState();
    const[option, setOption] = useState('r');
    const[chosenWeek, setChosenWeek] = useState('2');
    const[placeHolder, setPlaceHolder] = useState('Номер группы');
    const[filterText, setFilterText] = useState('');
    const[facultet, setFacultet] = useState('');
    const[studyType, setStudyType] = useState('');
    const[studyYear, setStudyYear] = useState('');
    const[strText, setStrText] = useState('');
    const[level2, setLevel2] = useState([]);
    const[level3, setLevel3] = useState([]);
    const[structureLv1, setStructureLv1] = useState([]);
    const[structureLv2, setStructureLv2] = useState([]);
    const[structureLv3, setStructureLv3] = useState([]);
    const[allData, setAllData] = useState({});
    const[searchData, setSearchData] =useState({});
    const[loading, setLoading] = useState(true);
    const[data, setData] = useState([]);
    const[filteredMock, setFilteredMock] = useState([]);
    const[found, setFound] = useState(false);

    const getData = async () => {
        const requestData = {
            token: "d0a47ed8f69a0844d71001d68fb71f1922be499989562c5b2f7b91e63c6d2293",
            action: "getData"
        };
        const url = '/api/v1/';
        const res = await axios.post(url, requestData);
        setAllData(res.data);
        setLoading(false);
    };
    if( loading ){
        getData();
    }

    const clearDetail = () => {
        setSearchData({});
        setFound(false);
    }

    function check() {
        if (Object.keys(searchData).length > 0) {
            if (page === 'o') {
                if (Object.keys(searchData).length < 2) {
                    if (Object.keys(searchData)[0] === 'r') {
                        setOption('r')
                        if((weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 1) {
                            setChosenWeek('3')
                        } else {
                            setChosenWeek('2')
                        }
                    } else if (Object.keys(searchData)[0] === 's') {
                        setOption('s')
                        const nestedKeys = Object.keys(searchData.s);
                        if (nestedKeys.length > 0) {
                            const firstNestedKey = nestedKeys[0];
                            setChosenWeek(firstNestedKey);
                        } else {
                            const nestedKeys = Object.keys(searchData[option]);
                            if (nestedKeys.length > 0) {
                                const firstNestedKey = nestedKeys[0];
                                setChosenWeek(firstNestedKey);
                            }
                        }
                    }
                } else {
                    if((weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 1) {
                        setChosenWeek('3')
                    } else {
                        setChosenWeek('2')
                    }
                }
                setFound(true);
            } else if (page === 'z') {
                if (Object.keys(searchData).length < 2) {
                    if (Object.keys(searchData)[0] === 'r') {
                        setOption('r')
                        const nestedKeys = Object.keys(searchData.r);
                        if (nestedKeys.length > 0) {
                            const firstNestedKey = nestedKeys[0];
                            setChosenWeek(nestedKeys.includes(weekCounter + 1) ? weekCounter + 1 : firstNestedKey);
                        }
                    } else if (Object.keys(searchData)[0] === 's') {
                        setOption('s')
                        const nestedKeys = Object.keys(searchData.s);
                        if (nestedKeys.length > 0) {
                            const firstNestedKey = nestedKeys[0];
                            setChosenWeek(nestedKeys.includes(weekCounter + 1) ? weekCounter + 1 : firstNestedKey);
                        }
                    }
                } else {
                    const nestedKeys = Object.keys(searchData.r);
                    if (nestedKeys.length > 0) {
                        const firstNestedKey = nestedKeys[0];
                        setChosenWeek(nestedKeys.includes(weekCounter + 1) ? weekCounter + 1 : firstNestedKey);
                    }
                }
                setFound(true);
            }
        }
    }

    useEffect(() => {
        check();
    }, [option])

    const updateUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newPage = urlParams.get('page') || 'o';
        const newType = urlParams.get('type') || 'GROUP';
        const newText = urlParams.get('text') || '';
        setFilterText('')
        setOption('r');
        if(newPage !== page) {
            setPage(newPage);
            urlParams.set('page', newPage);
            clearDetail();
        }
        if(newType !== type) {
            setType(newType);
            urlParams.set('type', newType);
            clearDetail();
        }
        if(newText !== text) {
            setText(newText);
            urlParams.set('text', newText);
            clearDetail();
        }
        if(newText !== '' && typeof newText !== 'undefined') {
            setFilterText(newText)
        }
        window.history.pushState({}, '', `?${urlParams}`);
    };

    const dataFilter = () => {
        let newData = [];
        let strData;
        let strLv1, strLv2, strLv3;
        if ( !loading ) {
            if (type === 'STRUCTURE'){
                if ( data.length > 0 ){setData(newData)};
                strData = allData?.STRUCTURE && allData.STRUCTURE[page]
                strLv1 = getKeysByLevel(strData, 1);
                strLv2 = getKeysByLevel(strData, 2);
                strLv3 = getKeysByLevel(strData, 3);
                setStructureLv1(strLv1);
                setStructureLv2(strLv2);
                setStructureLv3(strLv3);
            }else{
                if (type === 'GROUP') {
                    newData = allData?.GROUPS && allData.GROUPS[page];
                } else if (type === 'PROFESSOR') {
                    newData = allData?.PROFESSORS;
                } else if (type === 'AUDITORIUM') {
                    newData = allData?.AUDITORIUMS;
                }
                setData(newData);
            }
        }
    }

    useEffect(() => {
        if (Object.keys(allData).length > 0){
            updateUrlParams();
            updateUrlStructure();
            dataFilter();
            if(typeof page !== 'undefined' && typeof type !== 'undefined' && typeof text !== 'undefined' && strText !== '') {
                detailSearch();
            }
        }
    }, [allData, data, page, type, text]);

    const handleSearch = (item) => {
        updateTextInUrl(item);
    }

    const handleInputChange = (event) => {setFilterText(event.target.value)};
    //фильтрация по подмассиву
    useEffect(() => {
        if (filterText.length >= 3 && type !== 'STRUCTURE' && data.length > 0) {
            setFilteredMock(data.filter((item) => {
                return item.toLowerCase().includes(filterText.toLowerCase());
            }));
        }
    }, [filterText])

    const detailSearch = async() => {
        if (typeof text !== 'undefined' && text !== '') {
            let requestData;
            if (type === 'STRUCTURE') {
                requestData = {
                    "token": "d0a47ed8f69a0844d71001d68fb71f1922be499989562c5b2f7b91e63c6d2293",
                    "action": "search",
                    "type": "GROUP",
                    "page": page,
                    "search": text
                };
            } else {
                requestData = {
                    "token": "d0a47ed8f69a0844d71001d68fb71f1922be499989562c5b2f7b91e63c6d2293",
                    "action": "search",
                    "type": type,
                    "page": page,
                    "search": text
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
        }
    }

    useEffect(() => {
        detailSearch();
    }, [text, strText])

    useEffect(() => {
        check();
    }, [searchData])

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

    useEffect(() => {
        switch (type) {
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
                setPlaceHolder('Номер группы');
        }
    }, [type]);

    const updateTextInUrl = (text) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('text', text);
        urlParams.set('strText', text);
        setFilterText(text)
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlParams();
        updateUrlStructure();
    };
    const updatePageInUrl = (page) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', page);
        urlParams.set('type', 'GROUP');
        urlParams.set('text', '');
        urlParams.set('facultet', '');
        urlParams.set('studyType', '');
        urlParams.set('studyYear', '');
        urlParams.set('strText', '');
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlParams();
        updateUrlStructure();
    };
    const updateTypeInUrl = (type) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('type', type);
        urlParams.set('text', '');
        urlParams.set('facultet', '');
        urlParams.set('studyType', '');
        urlParams.set('studyYear', '');
        urlParams.set('strText', '');
        setData([])
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlParams();
    };

    const facultetUpdate = (item) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('facultet', item);
        setFacultet(item);
        urlParams.set('text', '');
        urlParams.set('strText', '');
        if(studyYear.length > 0) {
            setStudyYear('');
            urlParams.set('studyYear', '');
        }
        if(studyType.length > 0) {
            setStudyType('');
            urlParams.set('studyType', '');
        }
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlStructure();
    }

    const studyTypeUpdate = (item) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('studyType', item);
        setStudyType(item);
        urlParams.set('text', '');
        urlParams.set('strText', '');
        if(studyYear.length > 0) {
            setStudyYear('');
            urlParams.set('studyYear', '');
        }
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlStructure();
    }

    const studyYearUpdate = (item) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('studyYear', item);
        setStudyYear(item);
        urlParams.set('text', '');
        urlParams.set('strText', '');
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlStructure();
    }
    const updateUrlStructure = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newFacultet = urlParams.get('facultet') || '';
        const newStudyType = urlParams.get('studyType') || '';
        const newStudyYear = urlParams.get('studyYear') || '';
        const newStrText = urlParams.get('strText') || '';
        setOption('r');
        if(newFacultet !== facultet) {
            setFacultet(newFacultet);
            urlParams.set('facultet', newFacultet);
        }
        if(newStudyType !== studyType) {
            setStudyType(newStudyType);
            urlParams.set('studyType', newStudyType);
            clearDetail();
        }
        if(newStudyYear !== studyYear) {
            setStudyYear(newStudyYear);
            urlParams.set('studyYear', newStudyYear);
            clearDetail();
        }
        if(newStrText !== strText) {
            clearDetail();
            setStrText(newStrText);
            setText(newStrText);
            urlParams.set('strText', newStrText);
            urlParams.set('text', newStrText);
        }
        window.history.pushState({}, '', `?${urlParams}`);
    };
    useEffect(() => {
        if(facultet !== '') {
            const filteredArray = structureLv2.filter(item => item.startsWith(facultet)).map(item => item.split('.')[1]);
            setLevel2(filteredArray);
            if(level3.length>0) {
                const i = []
                setLevel3(i);
            }
        }
    }, [facultet, structureLv2])

    useEffect(() => {
        if(facultet !== '' && studyType !== '') {
            const filteredArray = structureLv3.filter(item => item.startsWith(`${facultet}.${studyType}`)).map(item => item.split('.').pop());
            setLevel3(filteredArray)
            setStudyYear('')
        }
    }, [facultet, studyType, structureLv3])

    useEffect(() => {
        updateUrlStructure();
    }, [facultet, studyType, studyYear, strText])

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
                {type !== 'STRUCTURE' && <div>
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
                                                handleSearch(item);
                                            }}>
                                            {item}
                                        </div>
                                    );
                                })
                            }
                        </div>
                </div>}
                {type === 'STRUCTURE' && structureLv1.length > 0 &&
                    <div className={styles.buttonset}>
                        {structureLv1.map((item, ind) => {
                            return (
                                <div
                                    className={cn(styles.button, {
                                        [styles.activeButton]: item === facultet,
                                        })}
                                    key={ind}
                                    onClick={() => {
                                        facultetUpdate(item);
                                    }}>
                                    {item}
                                </div>
                            );
                        })}
                    </div>}
                {type === 'STRUCTURE' && facultet !== '' && level2.length > 0  &&
                    <div className={styles.buttonset}>
                        {level2.map((item, ind) => {
                                return (
                                    <div
                                        className={cn(styles.button, {
                                            [styles.activeButton]: item === studyType,
                                        })}
                                        key={ind}
                                        onClick={() => {
                                            studyTypeUpdate(item)
                                        }}>
                                        {item}
                                    </div>
                                );
                            })
                        }
                        </div>}
                {type === 'STRUCTURE' && facultet !== '' && studyType !== '' && level3.length > 0  &&
                    <div className={styles.buttonset}>{
                            level3.map((item, ind) => {
                                return (
                                    <div
                                        className={cn(styles.button, {
                                            [styles.activeButton]: item === studyYear,
                                        })}
                                        key={ind}
                                        onClick={() => {
                                            studyYearUpdate(item)
                                        }}>
                                        {`${item} курс`}
                                    </div>);
                            })
                        }</div>}
                {type === 'STRUCTURE' && facultet !== '' && studyType !== '' && studyYear !== '' &&
                    <div className={styles.buttonset}>
                        {allData?.STRUCTURE[page][facultet][studyType][studyYear].map((item, ind) => {
                            return (
                                <div
                                    className={cn(styles.button, {
                                        [styles.activeButton]: item === text,
                                    })}
                                    key={ind}
                                    onClick={() => {
                                        handleSearch(item)
                                    }}>
                                    {item}
                                </div>
                            )})}
                    </div>}
                {found === true && typeof text !== 'undefined' && text !== '' && typeof strText !== 'undefined' && strText !== '' &&
                    <div className={styles.links}>
                        <div className={styles.options}>
                            {searchData.r && <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: option === 'r',
                                })}
                                onClick={() => setOption('r')}>
                                Расписание
                            </div>}
                            {searchData.s && <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: option === 's',
                                })}
                                onClick={() => setOption('s')}>
                                Сессия
                            </div>}
                        </div>
                        <div>
                            <div className={styles.excel}>
                                    <a href={`https://rasp.spbgasu.ru/getExcel.php?TYPE=GROUPS&FIND=${text}`}>Выгрузить в Excel</a>
                                </div>
                            </div>
                        </div>}
                {found === true && typeof text !== 'undefined' && text !== '' && typeof strText !== 'undefined' && strText !== '' && page === 'o' && option === 'r'  &&
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
                            <div className={styles.today}>
                                    Сегодня:<br /> {formattedDate}<br /> Неделя: {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? <a>знаменатель</a> : <a>числитель</a>}
                                </div>
                        </div>
                    </div>}
                {
                    found === true && Object.keys(searchData).length > 0 && page === 'o' && option === 'r' && chosenWeek !== null &&
                    searchData.r[chosenWeek] && typeof searchData.r[chosenWeek] === 'object' &&
                    Array.from({ length: 6 }, (_, ind) => {
                        const dayKey = String(ind + 1); // Преобразуем индекс в строку, так как в ваших данных ключи представлены строками
                        const day = searchData.r[chosenWeek][dayKey] || {}; // Если ключ отсутствует, создаем пустой объект
                        return <Day day={day} dayKey={dayKey} option={option} key={ind} />;
                    })
                }
                {found === true && Object.keys(searchData).length > 0 && page === 'o' && option === 's' && Object.keys(searchData.s).map((weekKey) => (
                    Object.keys(searchData.s[weekKey]).map((dayKey) => {
                        const day = searchData.s[weekKey][dayKey];
                        return <Day day={day} dayKey={dayKey} option={option} key={`${weekKey}-${dayKey}`} />;
                    })
                ))}
                {found === true && page === 'z' && text !== '' && typeof text !== 'undefined' &&
                    <div className={styles.weekBlock}>
                        <div className={styles.weekSet}>
                            {getKeysByLevel(searchData[option], 1).map((item, ind) => {
                                return(
                                    <div className={cn(styles.button, {
                                        [styles.activeButton]: chosenWeek === item,
                                    })} key={ind} onClick={() => setChosenWeek(item)}>{item} неделя <br />{getDateRange(item)}</div>
                                )
                            })}
                        </div>
                    </div>
                }
                {found === true && Object.keys(searchData).length > 0 && page === 'z' && option === 'r' && chosenWeek !== null &&
                    searchData.r && searchData.r[chosenWeek] && typeof searchData.r[chosenWeek] === 'object' &&
                    Array.from({ length: 6 }, (_, ind) => {
                        const dayKey = String(ind + 1);
                        const day = searchData.r[chosenWeek][dayKey] || {};
                        return <Day day={day} dayKey={dayKey} option={option} key={ind} page={page} />;
                    })
                }
                {found === true && Object.keys(searchData).length > 0 && page === 'z' && option === 's' && chosenWeek !== null &&
                    searchData.s && searchData.s[chosenWeek] && typeof searchData.s[chosenWeek] === 'object' &&
                    Object.keys(searchData.s[chosenWeek]).map((dayKey, ind) => {
                        const day = searchData.s[chosenWeek][dayKey];
                        return <Day day={day} dayKey={dayKey} option={option} key={ind} />;
                    })
                }
                {Object.keys(searchData).length === 0 && text !== '' && typeof text !== 'undefined' &&
                    <div className={styles.notFound}>Расписание отсутствует</div>
                }
            </div>
        </div>
    );
};
export default Main;