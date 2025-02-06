// ==UserScript==
// @name         Shingetsu_Main
// @namespace    https://github.com/Da1eth
// @version      1.0.1
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
        const isTextarea = target.matches('textarea[name="content"]');
        const isInput = target.matches('input');
        const isSubmitButton = target.matches('button[type="submit"]');

        isTabKey && isTextarea ? (
            event.preventDefault(),
            target.closest('form')?.querySelector('button')?.focus()
        ) : isEnterKey && isInput ? (
            event.preventDefault(),
            target.closest('form')?.querySelectorAll('input, textarea, button, select, a[href]')
            .item(Array.from(target.closest('form').querySelectorAll('input, textarea, button, select, a[href]')).indexOf(target) + 1)
            ?.focus()
        ) : isEnterKey && isSubmitButton ? (
            setTimeout(() => {
                target.closest('form')?.querySelector('textarea[name="content"]')?.focus();
            }, 250)
        ) : null;
    });

    const adjustHeight = textarea => requestAnimationFrame(() => {
        const { lineHeight, fontSize } = getComputedStyle(textarea);
        const normalHeight = lineHeight === 'normal' ? parseFloat(fontSize) * 1.155 : parseFloat(lineHeight);
        textarea.style.height = `${textarea.value.split('\n').length * normalHeight}px`;
    });

    const heightObserver = () => new MutationObserver(mutations =>
                                                      mutations.forEach(m => m.target.matches('textarea[name="content"]') && adjustHeight(m.target))
                                                     ).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    window.addEventListener('load', () => {
        document.querySelectorAll('textarea[name="content"]').forEach(textarea => {
            textarea.style.whiteSpace = 'nowrap';
            adjustHeight(textarea);
        });
        heightObserver();
    });

    document.addEventListener('input', e => e.target.matches('textarea[name="content"]') && adjustHeight(e.target));

    document.addEventListener("click", event => {
        const link = event.target.closest("a[href]");
        link && !link.href.startsWith(location.origin) &&
            (event.preventDefault(), (newTab => newTab && newTab.focus())(window.open(link.href, "_blank")));
    });

    const bbsLinks = () => {
        document.querySelectorAll('span > span').forEach(span => {
            const matchLinks = span.textContent.match(/(\w+?)>(\d{10})>(\d+)(?:-(\d+))?/);
            matchLinks && (() => {
                const [, boardname, postnumber, response1, response2] = matchLinks;
                const fullUrl = `https://bbs.tunaground.net/trace.php/${boardname}/${postnumber}/${response1}${response2 ? `/${response2}` : ''}`;

                const parentSpan = span.parentElement;
                const link = parentSpan.querySelector('a');
                link && (link.href = fullUrl);

                const newLink = document.createElement('a');
                newLink.href = fullUrl;
                newLink.appendChild(span.cloneNode(true));
                span.replaceWith(newLink);
            })();
        });
    };

    window.addEventListener('load', bbsLinks);

    const bbsLinkObserver = new MutationObserver(bbsLinks);
    bbsLinkObserver.observe(document.body, { childList: true, subtree: true });

})();
