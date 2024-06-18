// ==UserScript==
// @name         HeartcatchYukinari_Part4
// @namespace    https://github.com/Da1eth
// @version      0.101
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const createPopup = () => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        Object.assign(popup.style, {
            position: 'absolute',
            border: '1px solid #cccccc',
            backgroundColor: '#fafafa',
            padding: '10px',
            display: 'none',
        });
        document.body.appendChild(popup);

        popup.addEventListener('mouseover', () => clearTimeout(popup.hideTimeout));
        popup.addEventListener('mouseout', () => {
            popup.hideTimeout = setTimeout(hidePopup, 200);
        });

        return popup;
    };

    const popup = createPopup();

    const showPopup = (content, x, y) => {
        popup.innerHTML = content;

        popup.querySelectorAll('p').forEach(el => {
            el.style.margin = '0';
        });
        popup.querySelectorAll('*').forEach(el => {
            const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (fontSize > 16) {
                el.style.fontSize = '16px';
            }
        });
        popup.querySelectorAll('.response_create_date').forEach(el => {
            el.style.fontSize = '0.7em';
        });
        popup.querySelectorAll('.button_default.clr_copy').forEach(button => button.remove());

        popup.style.display = 'block';
        Object.assign(popup.style, {
            left: `${x + 10}px`,
            top: `${y - 10 - popup.offsetHeight}px`
        });
    };

    const hidePopup = () => {
        popup.style.display = 'none';
    };

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('mouseover', event => {
            const linkText = link.textContent;
            const match = linkText.match(/>>(\d+)/)
                || (linkText.split('>').length === 3 && linkText.split('>')[2].trim().match(/(\d+)/));
            if (match && link.href.includes('#response_')) {
                const responseElement = document.querySelector(`div[id$="_${match[1]}"]`);
                if (responseElement) {
                    showPopup(responseElement.innerHTML, event.pageX, event.pageY);
                }
            }
        });

        link.addEventListener('mouseout', () => {
            popup.hideTimeout = setTimeout(hidePopup, 200);
        });
    });
})();