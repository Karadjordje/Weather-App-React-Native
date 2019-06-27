const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

export const formattedToday = () => {
    return new Date().toLocaleDateString('sr-Latn-RS', options);
};

export const convertSecToDate = (seconds) => {
    return new Date(seconds * 1000).toLocaleDateString('sr-RS');
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getDayName = (timestamp) => {
    let date = new Date(timestamp);
    return days[date.getDay()];
};

export const capitalizeFirstLatter = (str) => {
    return str.split(' ').map(item => {
        return item.slice(0, 1).toUpperCase() + item.slice(1);
    }).join(' ');
};

// Params has to be object
export const getApiData = (url, params) => {
    if (params) {
        if (checkIfObj(params)) {
            const queryString = objToQueryString(params);
            url = `${url}?${queryString}`;
            console.log(url);
        } else {
            console.error('Parameters error.', 'Parameters need to be send as plain object.');
            return;
        }
    }

    return fetch(url)
        .then(response => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return {
                    error: 'Bad request'
                };
            }

            return response.json();
        })
        .then(data => data)
        .catch(error => console.log(error));
};

function objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
}

function checkIfObj(params) {
    return typeof params == 'object' && params instanceof Object && !(params instanceof Array);
}

export const groupArrBy = (prop, arr) => {
    return arr.reduce(function (acc, el) {
        acc[el[prop]] = acc[el[prop]] || [];
        acc[el[prop]].push(el);
        return acc;
    }, Object.create(null));
};