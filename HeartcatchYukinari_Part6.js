// ==UserScript==
// @name         HeartcatchYukinari_Part6
// @namespace    https://github.com/Da1eth
// @version      0.2
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let boardUid, threadUid, intervalId;

    function recentCheck(url) {
        const urlPattern = /trace\.php\/([^\/]+)\/([^\/]+)\/recent(\/[^\/]+)?(#.*)?$/;
        const match = url.match(urlPattern);
        return match ? ((boardUid = match[1]), (threadUid = match[2]), true) : false;
    }

    if (!recentCheck(window.location.href)) return;

    const getExistingResponseIds = () => new Set([...document.querySelectorAll('.response')].map(div => div.id));

    const applyLink = el => {
        const urlRegex = /https?:\/\/[^\s<>"'`{}|\\^~[\]`]+/g;
        el.innerHTML = el.innerHTML.replace(urlRegex, match => `<a href="${match}" target="_blank">${match}</a>`);
    };

    const applyAnchor = el => {
        const anchorPattern = /([a-z]*)&gt;([0-9]*)&gt;([0-9]*)-?([0-9]*)|&gt;&gt;([0-9]+)(-([0-9]+))?/gm;
        el.innerHTML = el.innerHTML.replace(anchorPattern, (match, boardUidMatch, threadUidMatch, responseStart, responseEndMatch) => {
            const BoardUid = boardUidMatch || boardUid;
            const ThreadUid = threadUidMatch || threadUid;
            const responseEnd = responseEndMatch || '';
            return responseStart ?
                `<a href="/trace.php/${BoardUid}/${ThreadUid}/${responseStart}/${responseEnd}">${match}</a>` :
                (!responseEnd && document.getElementById(`response_${ThreadUid}_${responseStart}`)) ?
                    `<a href="#response_${ThreadUid}_${responseStart}" onclick="jump('response_${ThreadUid}_${responseStart}')">${match}</a>` :
                    `<a href="/trace.php/${BoardUid}/${ThreadUid}/${responseStart}/${responseEnd}">${match}</a>`;
        });
    };

    const addNewIndicator = responseDiv => {
        const responseInfo = responseDiv.querySelector('p.response_info');
        if (responseInfo) {
            const newIndicator = document.createElement('span');
            newIndicator.className = 'response_test_indicator';
            newIndicator.textContent = 'New!';
            responseInfo.appendChild(newIndicator);
        }
    };

    const fetchData = async () => {
        if (document.visibilityState !== 'visible') return;

        fetch(`/trace.php/${boardUid}/${threadUid}/recent/30`)
            .then(response => response.text())
            .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const newResponses = doc.querySelectorAll('.response');
            const threadBody = document.querySelector('.thread_body');

            const existingResponseIds = getExistingResponseIds();

            newResponses.forEach(newDiv => {
                if (!existingResponseIds.has(newDiv.id)) {
                    const clonedDiv = newDiv.cloneNode(true);
                    applyLink(clonedDiv);
                    applyAnchor(clonedDiv);
                    addNewIndicator(clonedDiv);
                    threadBody.appendChild(clonedDiv);
                }
            });
        })
            .catch(() => {});
    };
    const visibilityChange = () => {
        document.visibilityState === 'visible' && (
            fetchData(),
            intervalId = intervalId || setInterval(fetchData, 15000)
        );

        document.visibilityState !== 'visible' && (
            intervalId && (clearInterval(intervalId), intervalId = null)
        );
    };

    document.addEventListener('visibilitychange', visibilityChange);
    document.visibilityState === 'visible' && visibilityChange();
})();