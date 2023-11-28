import { useEffect, useState } from 'react';
import Day from '../components/Day/Day';
import groups from '../mock/groups';
import mock from '../mock/days';

import styles from '../pageStyles/Main.module.css';

const Main = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState(1);
    const [text, setText] = useState('');
    const [placeHolder, setPlaceHolder] = useState('Номер группы');
    const [filterText, setFilterText] = useState('');

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
        urlParams.set('type', 1); // Устанавливаем параметр type в 1 при обновлении параметра page
        urlParams.set('text', ''); // Сбрасываем параметр text при обновлении параметра page
        setPage(page);
        setType(1); // Устанавливаем тип в 1 при обновлении параметра page
        setFilterText(''); // Сбрасываем текст при обновлении параметра page
        window.history.pushState({}, '', `?${urlParams}`);
    };

    const updateTypeInUrl = (type) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('type', type);
        // Сбрасываем параметр text при обновлении параметра type
        urlParams.set('text', '');
        setType(type);
        setFilterText(''); // Сбрасываем текст при обновлении параметра type
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
        setFilterText(newText);
    };

    useEffect(() => {
        if (!window.location.search) {
            window.history.replaceState({}, '', '?page=1&type=1&text=');
            updateUrlParams();
        } else {
            updateUrlParams();
        }
    }, [page, type, text]);

    //
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
                                            updateTextInUrl(item);
                                        }}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            }
            {text !== '' && mock.map((item, ind) => {
                return <Day day={item} key={ind} />;
            })}
        </div>
    );
};

export default Main;
