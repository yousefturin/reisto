/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




/**
 * Extracts the domain from a given URL.
 *
 * @param {string} url - The URL from which to extract the domain.
 * @returns {string} The extracted domain.
 */
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