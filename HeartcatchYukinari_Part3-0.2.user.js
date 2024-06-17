// ==UserScript==
// @name         HeartcatchYukinari_Part3
// @namespace    https://github.com/Da1eth
// @version      0.2
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        document.querySelectorAll('.response_mask_button').forEach(maskButton => {
            const copyButton = document.createElement('button');
            copyButton.className = 'button_default clr_copy';
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => {
                const parentDiv = maskButton.closest('div[id]');
                const contentDiv = parentDiv.querySelector('.content');
                if (contentDiv) {
                    const transformedString = transformContent(contentDiv.innerHTML);
                    GM_setClipboard(transformedString);
                    alert('성공!');
                }
            });
            maskButton.appendChild(copyButton);
        });
    });

    function transformContent(content) {
        const div = document.createElement('div');
        div.innerHTML = content;
        return parseElement(div).trimOnly();
    }

    function parseElement(element) {
        let result = '';
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                const color = cssColorToHex(node.style.color || '');
                const textShadow = node.style.textShadow || '';
                const shadowColor = textShadow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)|#([0-9a-f]{3,8})|(\w+)/i);
                const shadowColorString = shadowColor ? cssColorToHex(shadowColor[0]) : '';

                let startTag = '', endTag = '';

                if (tagName === 'span') {
                    startTag = node.className.includes('spoiler') ? '<spo>' : `<clr ${color}${shadowColorString ? ' ' + shadowColorString : ''}>`;
                    endTag = '</clr>';
                } else if (tagName === 'br') {
                    result += '\n';
                } else if (tagName === 'ruby') {
                    const rtNode = node.querySelector('rt');
                    if (rtNode) {
                        const rtText = parseElement(rtNode);
                        node.removeChild(rtNode);
                        const rubyText = parseElement(node);
                        result += `<ruby ${rtText}>${rubyText}</ruby>`;
                        return;
                    }
                }

                result += startTag + parseElement(node) + endTag;
            }
        });
        return result;
    }

    function cssColorToHex(color) {
        color = color.trim();
        if (!color) return '';

        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = color;
        return ctx.fillStyle === color ? color : '';
    }

    String.prototype.trimOnly = function() {
        return this.replace(/^\n\s{0,16}/, '').replace(/\s+$/, '');
    };
})();