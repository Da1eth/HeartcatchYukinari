// ==UserScript==
// @name         HeartcatchYukinari_Part2
// @namespace    https://github.com/Da1eth
// @version      0.2.1
// @description  maybe good script with Tunaground
// @author       Daleth
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .overlaybutton, .container {
            position: fixed;
            bottom: 20px;
            display: flex;
            align-items: center;
        }
        .overlaybutton {
            right: 24px;
            width: 2.4em;
            height: 2.4em;
            border-radius: 50% 25%;
            background: #7799CC;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
            justify-content: center;
        }
        .overlaybutton::before {
            content: '';
            width: 50%;
            height: 50%;
            border: 4px solid #fff;
            border-radius: 50%;
        }
        .container {
            right: 72px;
            width: 12em;
            transform: translateY(-50%);
        }
        .searchtripbox, .focusbutton {
            vertical-align: middle;
            margin-right: 6px;
            font-size: 16px;
            height: 24px;
            border-radius: 8px;
            border: 2px solid #5577CC;
        }
        .searchtripbox {
            width: 10em;
            padding-left: 4px;
        }
        .searchtripbox:focus {
            outline: none;
        }
        .focusbutton {
            background: #7799CC;
            color: white;
            cursor: pointer;
            text-align: center;
        }
    `;

    const addStyles = () => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    const OverlayModule = (() => {
        const createElement = (tag, className, props = {}) => {
            const element = document.createElement(tag);
            className && element.classList.add(className);
            Object.assign(element, props);
            return element;
        };

        const createOverlayButton = (container) => {
            const overlayButton = createElement('div', 'overlaybutton');
            container.style.display = 'none';
            const searchTripBox = container.querySelector('.searchtripbox');

            overlayButton.addEventListener('click', () => {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
                container.style.display === 'block' && searchTripBox.focus();
            });

            document.body.appendChild(overlayButton);
            document.body.appendChild(container);
        };

        const createContainer = () => {
            const container = createElement('div', 'container');
            container.addEventListener('click', e => e.stopPropagation());

            const searchTripBox = createElement('input', 'searchtripbox', { type: 'text', spellcheck: false });
            searchTripBox.addEventListener('keyup', e => e.code === 'Enter' && handleRemoveResponses());

            const focusButton = createElement('button', 'focusbutton', { innerHTML: 'Focus' });
            focusButton.addEventListener('click', handleRemoveResponses);

            container.appendChild(searchTripBox);
            container.appendChild(focusButton);
            return container;
        };

        const getResponseText = (className, response) => response.getElementsByClassName(className)[0].textContent.trim();

        const handleRemoveResponses = () => {
            const searchTripBoxValue = document.querySelector('.searchtripbox').value.toLowerCase();
            Array.from(document.getElementsByClassName('response')).forEach(response => {
                const sequence = response.querySelector('.response_info .response_sequence');
                if (sequence && sequence.textContent !== '0') {
                    const owner = getResponseText('response_owner', response).toLowerCase();
                    const ownerId = getResponseText('response_owner_id', response).toLowerCase();
                    (!owner.includes(searchTripBoxValue) && !ownerId.includes(searchTripBoxValue)) && response.remove();
                }
            });
        };

        return {
            init: () => {
                const urlPattern = /(?:trace\.php|mthread\.php)\/([^\/]+)\/(\d+)/;
                urlPattern.test(window.location.href) && (addStyles(), createOverlayButton(createContainer()));
            },
        };
    })();

    OverlayModule.init();
})();