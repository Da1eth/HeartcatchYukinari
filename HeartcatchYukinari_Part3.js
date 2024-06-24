// ==UserScript==
// @name         HeartcatchYukinari_Part3
// @namespace    https://github.com/Da1eth
// @version      0.3
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function addCopyButton(maskButton) {
        const copyButton = document.createElement('button');
        copyButton.className = 'button_default clr_copy';
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', () => {
            const parentDiv = maskButton.closest('div[id]');
            const contentDiv = parentDiv.querySelector('.content');
            let htmlToCopy = contentDiv.innerHTML;

            const patterns = {
                firstWhitespace: /^\n {16}/,
                lastWhitespace: / {4}$/,
                hrefTag: /<a href="[^"]*">(.*?)<\/a>/g,
                brTag: /<br>/g,
                monaTag: /<p class="mona">/g,
                closemonaTag: /<\/p>/g,
                diceTag: /<span style="color:[^;]+; font-weight:[^;]+;">\.dice \d+ \d+\..*?<\/span>/g,
                rubyTag: /<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g,
                spoilerTag: /<span class="spoiler">/g,
                clrTag: /<span style="color: ([^;"]+);?">/g,
                shadowTag: /<span style="color: ([^;"]+); text-shadow: 0px 0px 6px ([^;"]+);?">/g,
                closeTag: /<\/span>/g
            };

            htmlToCopy = htmlToCopy.replace(patterns.firstWhitespace, '')
                .replace(patterns.lastWhitespace, '')
                .replace(patterns.hrefTag, '$1')
                .replace(patterns.brTag, '\n')
                .replace(patterns.monaTag, '')
                .replace(patterns.closemonaTag, '')
                .replace(patterns.diceTag, match => {
                    const dicePattern = /\.dice \d+ \d+\./;
                    const diceMatch = match.match(dicePattern);
                    return diceMatch ? diceMatch[0] : '';
                })
                .replace(patterns.rubyTag, '<ruby $2>$1</ruby>')
                .replace(patterns.spoilerTag, '<spo>')
                .replace(patterns.shadowTag, (match, color1, color2) => {
                    return `<clr ${color1} ${color2}>`;
                })
                .replace(patterns.clrTag, (match, color1) => {
                    return `<clr ${color1}>`;
                })
                .replace(patterns.closeTag, '</clr>');

            htmlToCopy = decodeHtmlEntities(htmlToCopy);

            navigator.clipboard.writeText(htmlToCopy).then(() => {
                alert('성공!');
            }).catch(err => {
                alert('실패...');
            });
        });
        maskButton.appendChild(copyButton);
    }

    window.addEventListener('load', () => {
        document.querySelectorAll('.response_mask_button').forEach(maskButton => {
            addCopyButton(maskButton);
        });

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            node.querySelectorAll('.response_mask_button').forEach(maskButton => {
                                addCopyButton(maskButton);
                            });
                        }
                    });
                }
            }
        });

        const config = { childList: true, subtree: true };
        const targetNode = document.body;

        observer.observe(targetNode, config);
    });
})();