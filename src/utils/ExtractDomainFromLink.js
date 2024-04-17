export const extractDomain = (url) => {
    let domain = '';
    // Find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    // Find & remove www
    if (domain.indexOf("www.") > -1) {
        domain = domain.split('www.')[1];
    }
    return domain;
};