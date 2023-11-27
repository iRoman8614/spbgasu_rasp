import styles from '../pageStyles/Main.module.css';
import mock from '../mock/days';
import Day from '../components/Day/Day';
import { useEffect, useState } from 'react';
import groups from '../mock/groups';

const Main = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState(1);
    const [group, setGroup] = useState('');
    const [placeHolder, setPlaceHolder] = useState('Номер группы');
    const [filterText, setFilterText] = useState('');

    const handleInputChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredMock = groups.filter((item) => {
        return item.toLowerCase().includes(filterText.toLowerCase());
    });

    const updateGroupInUrl = (group) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('group', group);
        setGroup(group)
        window.history.pushState({}, '', `?${urlParams}`);
        console.log('Updated URL with group:', group);
    };

    const updatePageInUrl = (page) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', page);
        setPage(page)
        window.history.pushState({}, '', `?${urlParams}`);
        console.log('Updated URL with page:', page);
    };

    const updateTypeInUrl = (type) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('type', type);
        setType(type)
        window.history.pushState({}, '', `?${urlParams}`);
        console.log('Updated URL with type:', type);
    };

    const updateUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newPage = parseInt(urlParams.get('page')) || 1;
        const newType = parseInt(urlParams.get('type')) || 1;
        const newGroup = urlParams.get('group') || '';

        setPage(newPage);
        setType(newType);
        setGroup(newGroup);
        setFilterText(newGroup);
    };

    useEffect(() => {
        // Обновление URL с новыми параметрами
        if (!window.location.search) {
            window.history.replaceState({}, '', '?page=1&type=1&group=');
            updateUrlParams();
        } else {
            updateUrlParams();
        }
    }, [page, type, group]);

    //
    useEffect(() => {
        // Обработка изменения истории браузера
        const handlePopState = () => {
            updateUrlParams();
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        // Обновление value при изменении page или type
        setFilterText('');
    }, [page, type]);

    useEffect(() => {
        // Обновление значения type при загрузке страницы
        const urlParams = new URLSearchParams(window.location.search);
        const urlType = parseInt(urlParams.get('type')) || 1;
        setType(urlType);

        const isValidType = [1, 2, 3, 4].includes(urlType);

        setType(isValidType ? urlType : 1);

        // Обновление значения placeholder в зависимости от параметра type в URL
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
            case 4:
                setPlaceHolder('');
                setFilterText(''); // Очищаем значение при выборе "структура"
                break;
            default:
                setPlaceHolder('');
        }
    }, [type]);

    return (
        <div className={styles.root}>
            <div className={styles.navbar}>
                <div className={styles.link} onClick={() => updatePageInUrl(1)}>
                    Расписание ОФО
                </div>
                <div className={styles.link} onClick={() => updatePageInUrl(2)}>
                    Расписание ОЗФО и ЗФО
                </div>
                <div className={styles.link} onClick={() => updatePageInUrl(3)}>
                    Расписание Сессии
                </div>
            </div>
            <div className={styles.typebar}>
                <div onClick={() => updateTypeInUrl(1)}>поиск</div>
                <div onClick={() => updateTypeInUrl(2)}>аудитории</div>
                <div onClick={() => updateTypeInUrl(3)}>преподаватели</div>
                <div onClick={() => updateTypeInUrl(4)}>структура</div>
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
                                        className={styles.button}
                                        key={ind}
                                        onClick={() => {
                                            updateGroupInUrl(item); // Обновление параметра group в URL
                                        }}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            }
            {mock.map((item, ind) => {
                return <Day day={item} key={ind} />;
            })}
        </div>
    );
};

export default Main;
