// ==UserScript==
// @name         HeartcatchYukinari_Part8
// @namespace    https://github.com/Da1eth
// @version      0.1
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const commonSpace = [
        { char: '　', length: 11 },
        { char: ' ', length: 5 }
    ];

    const unicodeSpace = [
        { char: ' ', length: 10 },
        { char: ' ', length: 8 },
        { char: ' ', length: 4 },
        { char: ' ', length: 3 },
        { char: ' ', length: 2 },
        { char: ' ', length: 1 }
    ];

    const getSpaceLength = (char) => {
        const space = [...commonSpace, ...unicodeSpace].find(space => space.char === char);
        return space ? space.length : 0;
    };

    const spaceOptions = [...commonSpace, ...unicodeSpace];

    const getSpaceString = (length) => {
        const oberon = Array(length + 1).fill(null);
        oberon[0] = '';

        for (let i = 1; i <= length; i++) {
            for (const space of spaceOptions) {
                if (i >= space.length && oberon[i - space.length] !== null) {
                    const titania = space.char + oberon[i - space.length];
                    oberon[i] = !oberon[i] || titania.length < oberon[i].length ? titania : oberon[i];
                }
            }
        }

        return oberon[length];
    };

    const replaceSpacesAndMoveCursor = (startPos, endPos, spaceLength) => {
        const newSpaceString = getSpaceString(spaceLength);
        if (!newSpaceString) return;

        const textarea = document.querySelector('textarea');
        const text = textarea.value;

        const newText = text.slice(0, startPos) + newSpaceString + text.slice(endPos);
        textarea.value = newText;
        textarea.setSelectionRange(startPos + newSpaceString.length, startPos + newSpaceString.length);
    };

    document.addEventListener('keydown', (event) => {
        if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;

        const textarea = document.querySelector('textarea');
        const cursorPos = textarea.selectionStart;
        const text = textarea.value;

        event.preventDefault();
        let spaceLength = 0, startPos = cursorPos, endPos = cursorPos;

        for (let i = cursorPos - 1; i >= 0; i--) {
            const length = getSpaceLength(text[i]);
            if (!length) break;
            spaceLength += length;
            startPos = i;
        }
        for (let i = cursorPos; i < text.length; i++) {
            const length = getSpaceLength(text[i]);
            if (!length) break;
            spaceLength += length;
            endPos = i + 1;
        }

        if (spaceLength > 0) {
            spaceLength += (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0);
            replaceSpacesAndMoveCursor(startPos, endPos, spaceLength);
        }
    });
})();