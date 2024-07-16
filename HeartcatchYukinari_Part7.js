// ==UserScript==
// @name         HeartcatchYukinari_Part7
// @namespace    https://github.com/Da1eth
// @version      0.1.1
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const unicodeSpaceList = ['\u2002', '\u2003', '\u2004', '\u2005', '\u2006', '\u2007', '\u2008', '\u2009', '\u200A'];

    const space = () => {
        const checkSpace = Array.from(document.querySelectorAll('.post_form_console'))
            .some(el => el.value.split('.').includes('space'));

        const checkUnicode = Array.from(document.querySelectorAll('.post_form_content'))
            .some(el => unicodeSpaceList.some(char => el.value.includes(char)));

        return checkSpace && checkUnicode;
    };

    document.querySelector('.post_form_test').addEventListener('click', function(event) {
        if (space()) {
            alert('유니코드 공백이 포함되어 있습니다');
        }
    });
})();