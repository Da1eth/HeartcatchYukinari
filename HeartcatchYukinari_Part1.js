// ==UserScript==
// @name         HeartcatchYukinari_Part1
// @namespace    https://github.com/Da1eth
// @version      0.3.1
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const rubyStyle = `
        p.mona ruby.downer { line-height: 1em; position: relative; display: inline-block; }
        p.mona rt.upper { display: block; width: 100%; top: -1em; text-align: center; }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = rubyStyle;
    document.head.appendChild(styleElement);

    const processRubyTags = (ruby) => {
        const hasOnlyRt = [...ruby.childNodes].every(node =>
            node.nodeType === Node.ELEMENT_NODE && node.tagName === 'RT' ||
            node.nodeType === Node.TEXT_NODE && /^[\u0020]*$/.test(node.textContent)
        );
        hasOnlyRt && (ruby.classList.add('downer'), ruby.querySelectorAll('rt').forEach(rt => rt.classList.add('upper')));
    };

    document.querySelectorAll('ruby').forEach(processRubyTags);

    new MutationObserver(mutations => mutations.forEach(({ addedNodes }) =>
        [...addedNodes].forEach(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'RUBY' ? processRubyTags(node) : node.querySelectorAll && node.querySelectorAll('ruby').forEach(processRubyTags))
    )).observe(document.body, { childList: true, subtree: true });

    const shiftJisReturn = (text) =>
    text.replace(
        /[^\u0000-\u00FF\u0370-\u04FF\u2010-\u218F\u2200-\u23FF\u2500-\u25FF\u3000-\u9FFF\uFF01-\uFFEF]|[\u2027-\u202F]|[\u3130-\u318F]/g,
        (char) => `&#${char.codePointAt(0)};`
    );

    const nctToChar = (text) => text.replace(/&#(0x|x)?([0-9a-fA-F]+);/gm, (_, isHex, match) => String.fromCodePoint(parseInt(match, isHex ? 16 : 10)));

    const handleInput = el => {
        const nextEl = el.nextElementSibling;
        const updateValue = () => el.value.includes('nct')
        ? nextEl.value = nctToChar(nextEl.value)
        : el.value.includes('ncn') && (nextEl.value = shiftJisReturn(nextEl.value));

        if (!el.value.includes('nct') && !el.value.includes('ncn')) return;

        nextEl.removeEventListener('input', updateValue);
        nextEl.addEventListener('input', updateValue);
        updateValue();
    };

    document.querySelectorAll('.post_form_console').forEach(el => {
        el.addEventListener('input', () => handleInput(el));
        el.dispatchEvent(new Event('input'));
    });

    if (window.location.href.includes('mthread.php')) {
        window.onload = () => {
            const addButton = (text, action) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.classList.add('button_default');
                btn.onclick = () => {
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach((c, index) => {
                        index !== 0 ? c.checked = action : null;
                    });
                };
                document.querySelector('.manage_button_set').appendChild(btn);
            };

            addButton('Check All', true);
            addButton('Uncheck All', false);
        };
    }

    const addSee1_50 = () => {
        const match = window.location.href.match(/trace\.php\/([^\/]+)\/(\d+)/);
        if (match) {
            const ul = document.querySelector('nav ul');
            if (ul) {
                const newLi = document.createElement('li');
                newLi.innerHTML = `<a href="/trace.php/${match[1]}/${match[2]}/1/50">1-50 보기</a>`;
                ul.insertBefore(newLi, ul.children[5]);
            }
        }
    };

    addSee1_50();

})();