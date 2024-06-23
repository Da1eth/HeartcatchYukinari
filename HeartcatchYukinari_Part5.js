// ==UserScript==
// @name         HeartcatchYukinari_Part5
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

    const existingLabel = document.querySelector('label.posting_option');

    if (existingLabel) {
        const newLabel = document.createElement('label');
        newLabel.className = 'posting_option 2';

        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.name = 'save_content';
        newCheckbox.className = 'posting_option_save_content';

        newLabel.append(newCheckbox, ' 본문 내용 유지');
        existingLabel.insertAdjacentElement('afterend', newLabel);

        newCheckbox.checked = localStorage.getItem('save_content_checked') === 'true';
        newCheckbox.checked && enableTextareaSave();

        newCheckbox.addEventListener('change', () => {
            localStorage.setItem('save_content_checked', newCheckbox.checked);
            newCheckbox.checked ? enableTextareaSave() : (disableTextareaSave(), clearTextareaContent());
        });

        document.querySelector('button.button_default.post_form_submit')?.addEventListener('click', clearTextareaContent);
    }

    function enableTextareaSave() {
        const textarea = document.querySelector('textarea[name="content"]');
        const threadId = textarea?.closest('.thread')?.id;
        if (textarea && threadId) {
            const savedContent = sessionStorage.getItem(`textarea_content_${threadId}`);
            savedContent && (textarea.value = savedContent);
            textarea.addEventListener('input', saveTextareaContent);
        }
    }

    function disableTextareaSave() {
        const textarea = document.querySelector('textarea[name="content"]');
        textarea?.removeEventListener('input', saveTextareaContent);
    }

    function saveTextareaContent(event) {
        const textarea = event.target;
        const threadId = textarea.closest('.thread')?.id;
        threadId && sessionStorage.setItem(`textarea_content_${threadId}`, textarea.value);
    }

    function clearTextareaContent() {
        const textarea = document.querySelector('textarea[name="content"]');
        const threadId = textarea?.closest('.thread')?.id;
        threadId && sessionStorage.removeItem(`textarea_content_${threadId}`);
    }
})();