import React, { useState, useEffect } from 'react';

const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear + 86400000) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const App = () => {
    const [weekNumber, setWeekNumber] = useState(0);

    useEffect(() => {
        const currentDate = new Date();
        setWeekNumber(getWeekNumber(currentDate));
    }, []);

    return (
        <div>
            <h1>Current Week Number</h1>
            <p>{weekNumber}</p>
        </div>
    );
};

export default App;