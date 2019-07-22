function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function removeParam(parameter) {
    let url = document.location.href;
    let urlparts = url.split('?');

    if (urlparts.length >= 2) {
        let urlBase = urlparts.shift();
        let queryString = urlparts.join("?");

        let prefix = encodeURIComponent(parameter);
        let pars = queryString.split(/[&;]/g);
        for (let i = pars.length; i-- > 0;)
            if (pars[i].lastIndexOf(prefix, 0) !== -1)
                pars.splice(i, 1);

        url = urlBase + (pars.length == 0 ? '' : '?') + pars.join('&');
        window.history.replaceState('', document.title, url);

    }
    return url;
}