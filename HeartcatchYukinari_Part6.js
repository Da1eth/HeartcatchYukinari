// ==UserScript==
// @name         HeartcatchYukinari_Part6
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

    const currentUrl = window.location.href;
    let boardUid, threadUid;

    function recentCheck(url) {
        const urlPattern = /trace\.php\/([^\/]+)\/([^\/]+)(\/recent(\/[^\/]+)?(\/[^\/]+)?)?(#.*)?$/;
        const match = url.match(urlPattern);

        if (match) {
            boardUid = match[1];
            threadUid = match[2];
            return true;
        }
        return false;
    }

    if (!recentCheck(currentUrl)) return;

    function getExistingResponseIds() {
        return new Set([...document.querySelectorAll('.response')].map(div => div.id));
    }

    function applyLink(el) {
        const urlRegex = /https?:\/\/[^\s<>"'`{}|\\^~[\]`]+/g;
        el.innerHTML = el.innerHTML.replace(urlRegex, match => `<a href="${match}" target="_blank">${match}</a>`);
    }

    function applyAnchor(el) {
        const anchorPattern = /([a-z]*)&gt;([0-9]*)&gt;([0-9]*)-?([0-9]*)|&gt;&gt;([0-9]+)(-([0-9]+))?/gm;
        el.innerHTML = el.innerHTML.replace(anchorPattern, (match, boardUidMatch, threadUidMatch, responseStart, responseEnd) => {
            const newBoardUid = boardUidMatch || boardUid;
            const newThreadUid = threadUidMatch || threadUid;
            const responseEndValue = responseEnd || '';

            return responseStart ?
                `<a href="/trace.php/${newBoardUid}/${newThreadUid}/${responseStart}/${responseEndValue}">${match}</a>` :
                (!responseEnd && document.getElementById(`response_${newThreadUid}_${responseStart}`)) ?
                    `<a href="#response_${newThreadUid}_${responseStart}" onclick="jump('response_${newThreadUid}_${responseStart}')">${match}</a>` :
                    `<a href="/trace.php/${newBoardUid}/${newThreadUid}/${responseStart}/${responseEndValue}">${match}</a>`;
        });
    }

    function addNewIndicator(responseDiv) {
        const responseInfo = responseDiv.querySelector('p.response_info');
        if (responseInfo) {
            const newIndicator = document.createElement('span');
            newIndicator.className = 'response_test_indicator';
            newIndicator.textContent = 'New!';
            responseInfo.appendChild(newIndicator);
        }
    }

    async function fetchData() {
        try {
            const response = await fetch(currentUrl);
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const newResponses = doc.querySelectorAll('.response');
            const threadBody = document.querySelector('.thread_body');

            const existingResponseIds = getExistingResponseIds();

            newResponses.forEach(newDiv => {
                const newResponseId = newDiv.id;
                if (!existingResponseIds.has(newResponseId)) {
                    const clonedDiv = newDiv.cloneNode(true);
                    applyLink(clonedDiv);
                    applyAnchor(clonedDiv);
                    addNewIndicator(clonedDiv);
                    threadBody.appendChild(clonedDiv);
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const intervalId = setInterval(fetchData, 10000);

    window.addEventListener('beforeunload', () => {
        clearInterval(intervalId);
    });
})();