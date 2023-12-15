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
    //url параметры
    const[page, setPage] = useState();
    const[type, setType] = useState();
    const[text, setText] = useState();
    //переключатель расписание или сессии
    const[option, setOption] = useState('r');
    //переключение недели
    const[chosenWeek, setChosenWeek] = useState('2');
    //плейсхолдер в инпуте
    const[placeHolder, setPlaceHolder] = useState('Номер группы');
    //текст по которому фольтруется
    const[filterText, setFilterText] = useState('');
    //параметры структуры
    const[facultet, setFacultet] = useState('');
    const[studyType, setStudyType] = useState('');
    const[studyYear, setStudyYear] = useState('');
    const[strText, setStrText] = useState('');
    //вложенные массивы в структуре
    const[level2, setLevel2] = useState([]);
    const[level3, setLevel3] = useState([]);
    const[structureLv1, setStructureLv1] = useState([]);
    const[structureLv2, setStructureLv2] = useState([]);
    const[structureLv3, setStructureLv3] = useState([]);
    //получение массива структур
    const[allData, setAllData] = useState({});
    //получение конкретного расписания
    const[searchData, setSearchData] =useState({});
    //состояние загрузки запроса всех структур
    const[loading, setLoading] = useState(true);
    //вложенный подмассив структуры
    const[data, setData] = useState([]);
    //массив отфильтрованных данных
    const[filteredMock, setFilteredMock] = useState([]);
    //загрузка по детальному поиску
    const[found, setFound] = useState(false);
    //запрос на получение всей структуры
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
    //пока загрузка сделай запрос на получние всей структуры
    if( loading ){
        getData();
    }
    //очистка детального запроса
    const clearDetail = () => {
        setSearchData({});
        setFound(false);
        console.log('cleared');
    }
    //обновление url параметров, если их нет то подсавь стандартные, если есть то проверь новые со старыми, если разные то обнови их
    const updateUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newPage = urlParams.get('page') || 'o';
        const newType = urlParams.get('type') || 'GROUP';
        const newText = urlParams.get('text') || '';
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
        window.history.pushState({}, '', `?${urlParams}`);
    };
    //определяет тип и по нему выносиить подмассив по выброному типу структупы
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
    //выполнение отслеживания изменений
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
    //нажатие на кнопку для отправки детального запроса
    const handleSearch = (item) => {
        updateTextInUrl(item);
    }
    //отслеживание изменений в инпуте
    const handleInputChange = (event) => {setFilterText(event.target.value)};
    //фильтрация по подмассиву
    useEffect(() => {
        if (filterText.length >= 3 && type !== 'STRUCTURE' && data.length > 0) {
            setFilteredMock(data.filter((item) => {
                return item.toLowerCase().includes(filterText.toLowerCase());
            }));
        }
    }, [filterText])
    //запрос на вывод конкретного расписания
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
    //вызов детального запроса
    useEffect(() => {detailSearch()}, [text, strText])
    //отслеживание состояния загрузки детального запроса
    useEffect(() => {
        if (Object.keys(searchData).length > 0){
            if(page === 'o') {
                setChosenWeek('2')
            } else if(page === 'z') {
                if(Object.keys(searchData).length < 2) {
                    setOption(Object.keys(searchData)[0])
                    const nestedKeys = Object.keys(searchData[option]);
                    if (nestedKeys.length > 0) {
                        const firstNestedKey = nestedKeys[0];
                        setChosenWeek(firstNestedKey);
                    }
                } else {
                    const nestedKeys = Object.keys(searchData[option]);
                    if (nestedKeys.length > 0) {
                        const firstNestedKey = nestedKeys[0];
                        setChosenWeek(firstNestedKey);
                    }
                }
            }
            setFound(true);
        }
    }, [searchData, found, page, option]);
    //получение ключей с определенного уровня вложенности
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
    //изменение текста плейсхолдера
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
    //функции обновления url параметров
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
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlParams();
        updateUrlStructure();
    };
    const updateTypeInUrl = (type) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('type', type);
        urlParams.set('text', '');
        setFilterText('');
        window.history.pushState({}, '', `?${urlParams}`);
        updateUrlParams();
    };
    // //работа со структурой
    // изменение выбранного факультета
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
    //изменение бакалавр/мага и тд
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
    //изменение выбранного курса в структуре
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
    //работа с неделями
    //изменение выбранной недели обучения
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
                <div className={styles.buttonset}>
                    {type === 'STRUCTURE' && structureLv1.length > 0 && structureLv1.map((item, ind) => {
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
                    {type === 'STRUCTURE' && facultet !== '' && level2.length > 0  && level2.map((item, ind) => {
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
                    {type === 'STRUCTURE' && facultet !== '' && studyType !== '' && level3.length > 0  && level3.map((item, ind) => {
                        return (
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: item === studyYear ,
                                })}
                                key={ind}
                                onClick={() => {studyYearUpdate(item)}}>
                                {`${item} курс`}
                            </div>);
                    })}
                </div>
                <div className={styles.buttonset}>
                    {type === 'STRUCTURE' && facultet !== '' && studyType !== '' && studyYear !== '' && allData?.STRUCTURE[page][facultet][studyType][studyYear].map((item, ind) => {
                        return (
                            <div
                                className={cn(styles.button, {
                                    [styles.activeButton]: item === text ,
                                })}
                                key={ind}
                                onClick={() => {handleSearch(item)}}>
                                {item}
                            </div>
                        );
                    })}
                </div>
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
                    </div>
                }
                {found === true && typeof text !== 'undefined' && text !== '' && typeof strText !== 'undefined' && strText !== '' && page === 'o' && option !== 's' &&
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
                                Сегодня: {(weekCounter + 1)}<br /> {formattedDate}<br /> Неделя: {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? <a>знаменатель</a> : <a>числитель</a>}
                            </div>
                        </div>
                    </div>
                } {found === true && Object.keys(searchData).length > 0 && page === 'o' && option === 'r' && chosenWeek !== null &&
                    typeof searchData.r[chosenWeek] === 'object' &&
                    Object.keys(searchData.r[chosenWeek]).map((dayKey, ind) => {
                        const day = searchData.r[chosenWeek][dayKey];
                        console.log(day, dayKey, ind)
                        return <Day day={day} dayKey={dayKey} key={ind} />;
                    })
                } {found === true && Object.keys(searchData).length > 0 && page === 'o' && option === 's' && Object.keys(searchData.s).map((weekKey) => (
                    Object.keys(searchData.s[weekKey]).map((dayKey) => {
                        const day = searchData.s[weekKey][dayKey];
                        return <Day day={day} dayKey={dayKey} key={`${weekKey}-${dayKey}`} />;
                    })
                ))} {found === true && page === 'z' && text !== '' && typeof text !== 'undefined' &&
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
                            <div className={styles.today}>
                                Сегодня:  {(weekCounter + 1)}<br /> {formattedDate}<br /> Неделя: {(weekCounter + 1 - currentWeekNumber1st + 1) % 2 === 0 ? <a>знаменатель</a> : <a>числитель</a>}
                            </div>
                        </div>
                    </div>
                } {found === true && Object.keys(searchData).length > 0 && page === 'z' && option === 'r' && chosenWeek !== null &&
                    searchData.r[chosenWeek] && typeof searchData.r[chosenWeek] === 'object' &&
                    Object.keys(searchData.r[chosenWeek]).map((dayKey, ind) => {
                        const day = searchData.r[chosenWeek][dayKey];
                        return <Day day={day} dayKey={dayKey} key={ind} />;
                    })
                } {found === true && Object.keys(searchData).length > 0 && page === 'z' && option === 's' && chosenWeek !== null &&
                    searchData.s[chosenWeek] && typeof searchData.s[chosenWeek] === 'object' &&
                    Object.keys(searchData.s[chosenWeek]).map((dayKey, ind) => {
                        const day = searchData.s[chosenWeek][dayKey];
                        return <Day day={day} dayKey={dayKey} key={ind} />;
                    })
                }
            </div>
        </div>
    );
};
export default Main;