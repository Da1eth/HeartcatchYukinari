// ==UserScript==
// @name         Shingetsu_Main
// @namespace    https://github.com/Da1eth
// @version      1.0.3
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs2.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

 (function() {
    'use strict';

    document.addEventListener('keydown', event => {
        const { target, key } = event;
        const isTabKey = key === 'Tab';
        const isEnterKey = key === 'Enter';
        const isTextarea = target.matches('textarea');
        const isSubmitButton = target.matches('button[type="submit"]');
        const form = target.closest('form');

        isTabKey && isTextarea ? (
            event.preventDefault(),
            form?.querySelector('button[type="submit"]')?.focus()
        ) : isEnterKey ? (
            !isTextarea && !isSubmitButton ? (
                event.preventDefault(),
                ((elems) => {
                    const nextIdx = elems.indexOf(target) + 1;
                    elems[nextIdx]?.focus();
                })(Array.from(form?.querySelectorAll('input, textarea, button, select, a[href]') || []))
            ) : null
        ) : null;
    });
})();
