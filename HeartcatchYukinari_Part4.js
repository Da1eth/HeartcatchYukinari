// ==UserScript==
// @name         HeartcatchYukinari_Part4
// @namespace    https://github.com/Da1eth
// @version      0.2.2
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
        Object.assign(popup.style, {
            position: 'absolute',
            border: '1px solid #cccccc',
            backgroundColor: '#fafafa',
            padding: '10px',
            display: 'none',
        });
        document.body.appendChild(popup);
        return popup;
    };

    const popup = createPopup();
    const hidePopup = () => popup.style.display = 'none';
    const showPopup = (content, x, y) => {
        popup.innerHTML = content;
        popup.querySelectorAll('p').forEach(el => el.style.margin = '0');
        popup.querySelectorAll('*').forEach(el => {
            const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (fontSize > 16) el.style.fontSize = '16px';
        });
        popup.querySelectorAll('.response_create_date').forEach(el => el.style.fontSize = '0.7em');
        popup.querySelectorAll('.button_default.clr_copy').forEach(button => button.remove());
        popup.style.display = 'block';
        popup.style.left = `${x + 10}px`;
        popup.style.top = `${y - 10 - popup.offsetHeight}px`;
    };

    const cache = new Map();

    const handleMouseOver = async (event) => {
        const target = event.target;
        if (popup.contains(target) || target.closest('nav') || !target.matches('a[href^="#response_"], a[href^="/trace.php/"]')) return;
        clearTimeout(popup.hideTimeout);

        const innerResponseMatch = target.href.match(/#response_(\d+)_(\d+)/);
        if (innerResponseMatch) {
            const responseElement = document.querySelector(`div[id$="_${innerResponseMatch[1]}_${innerResponseMatch[2]}"]`);
            responseElement && showPopup(responseElement.innerHTML, event.pageX, event.pageY);
            return;
        }

        const outerResponseMatch = target.href.match(/\/trace.php\/([^\/]+)\/(\d+)\/(\d+)\//);
        if (!outerResponseMatch) return;

        const cachedContent = cache.get(target.href);
        cachedContent ? showPopup(cachedContent, event.pageX, event.pageY) : fetch(target.href)
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");
                const responseElement = doc.querySelector(`div[id$="_${outerResponseMatch[2]}_${outerResponseMatch[3]}"]`);
                if (responseElement) {
                    const content = responseElement.innerHTML;
                    cache.set(target.href, content);
                    showPopup(content, event.pageX, event.pageY);
                }
            }).catch(() => {});
    };

    const handleMouseOut = (event) => {
        const isInPopup = popup.contains(event.target);
        const isLeavingPopup = !popup.contains(event.relatedTarget);
        isInPopup ? clearTimeout(popup.hideTimeout) : isLeavingPopup && (popup.hideTimeout = setTimeout(hidePopup, 200));
    };

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
})();