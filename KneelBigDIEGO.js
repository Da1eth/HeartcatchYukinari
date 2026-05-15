// ==UserScript==
// @name         KneelBigDIEGO
// @namespace    https://github.com/Da1eth
// @version      1.0
// @description  maybe good script with AAMZ
// @author       Daleth
// @match        https://aa.yaruyomi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaruyomi.com
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const CSV_URL = 'https://docs.google.com/spreadsheets/d/1MSh8Sczp3Q-DR26buYT9PR9VYPgBYmXopyytNRaeSdw/gviz/tq?tqx=out:csv&sheet=CSV';
    const HEADER_TRANSLATION_STORAGE_KEY = 'bigdiegoTranslateHeader';
    const BOOKMARK_BACKUP_STORAGE_KEY = 'bigdiegoBookmarkBackups';
    const MAX_BOOKMARK_BACKUPS = 3;
    const HEADER_SETTING_SELECTOR = '[data-bigdiego-header-translation-checkbox]';
    const BOOKMARK_BACKUP_EXPORT_SELECTOR = '[data-bigdiego-bookmark-backup-export]';
    const TRANSLATION_SETTING_SELECTOR = '[data-bigdiego-translation-settings]';
    const SETTINGS_TITLES = new Set(['設定', '설정']);
    const ACTION_SETTING_TITLES = new Set(['動作設定', '일반 동작 설정']);
    const BOOKMARK_TITLES = new Set(['ブックマーク', '북마크']);
    const TEXT_NODE = Node.TEXT_NODE;
    const ELEMENT_NODE = Node.ELEMENT_NODE;
    const IGNORED_UI_TAGS = new Set(['SCRIPT', 'STYLE']);
    const IGNORED_UI_SELECTOR = '.view-aa-content, .view-aa-source, canvas, template';

    const bigDIEGO = Object.freeze({
        'まとめZIP ': '마토메 ZIP ',
        'まとめZIP': '마토메 ZIP',
        '検索': '검색',
        '見出し検索': '소제목 검색',
        'フィルター': '파일 이름 검색',
        '検索文字列': '검색할 내용을 입력',
        '前バージョンとの比較': '신규 작성/수정된 파일',
        'ブックマーク': '북마크',
        'お知らせ': '공지사항',
        '設定': '설정',
        '画面表示（ドラッグで表示位置の並び替えが可能）': '화면 표시 설정 (마우스 드래그로 순서 변경 가능)',
        'まとめZIPリスト': '마토메 ZIP 리스트',
        '前バージョンとの比較リスト': '이전 버전과의 차이점 리스트',
        'メインビュー': '메인 뷰',
        'サムネイルビュー': '섬네일 뷰',
        '動作設定': '일반 동작 설정',
        '終了時のタブを保存し、次回復元する': '종료 시 열려있던 탭 기록을 보존',
        'AAコピー時、対象AA全体をコピーする': '복사 시 언제나 AA 전체를 복사',
        'AAの画像保存時、背景色を白にする': 'AA를 이미지로 저장할 때 배경을 흰색으로 저장',
        'サムネイルを濃くする': '섬네일 이미지를 진하게 하기',
        'タブの閉じるボタンを左側にする': '탭 닫기 버튼을 탭의 왼쪽에 두기',
        'まとめZIPリストのひらがな・カタカナを区別せず並び替える': '리스트를 정렬할 때 히라가나/가타가나를 구분하지 않기',
        'まとめZIPリストのアルファベットの大文字・小文字を区別せず並び替える': '리스트를 정렬할 때 알파벳 대문자/소문자를 구분하지 않기',
        'エクスポート': '내보내기',
        'インポート': '가져오기',
        '更新情報': '파일 갱신 기록',
        '個別ページを開く': '새 창에서 열기',
        '個別ページ表示': '새 창에서 열기',
        '　個別ページ表示': '　새 창에서 열기',
        '名前を変更': '이름 바꾸기',
        '　ブックマークへ追加': '　북마크에 추가',
        'フォルダをブックマークに追加': '폴더를 북마크에 추가',
        'フォルダをダウンロード': '폴더를 다운로드',
        'ファイルをブックマークに追加': '파일을 북마크에 추가',
        'ファイルをダウンロード': '파일을 다운로드',
        'フォルダ追加': '폴더 만들기',
        '全て削除': '전부 삭제',
        'ブックマークから削除': '북마크에서 삭제',
        '　ブックマークから削除': '　북마크에서 삭제',
        'このAAをコピー': 'AA를 복사',
        'サムネイル': '섬네일',
        'サムネイル画像.zip': 'AA섬네일.zip',
        '画像を保存': '섬네일 이미지를 저장',
        '画像化して保存': '이미지로 저장',
        'ダウンロード': '다운로드',
        '　ダウンロード': '　다운로드',
        'ダウンロード履歴をクリアしてもよろしいですか？': '다운로드 기록을 전부 삭제해도 괜찮을까요?',
        'まとめZIPファイルをミラーからダウンロード': '마토메 ZIP 파일 전체를 다운로드',
        'ダウンロード履歴（最大 30 件） ※個別ページのダウンロードは対象外です': '파일 다운로드 기록 (최대 30개) ※새 창에서 열기로 다운로드한 내역은 기록되지 않습니다.',
        'ダウンロード履歴をクリア': '다운로드 기록 삭제',
        '画像一括ダウンロード': '섬네일 이미지 일괄 다운로드',
        'パス': '파일 패스(위치)',
        'ファイル名': '파일 이름',
        'ファイルサイズ': '파일 크기',
        'アクション': '액션',
        'コピー': '복사',
        'ソース表示': '소스 보기',
        '全てのタブを閉じる': '모든 탭 닫기',
        '全てのタブを閉じてもよろしいですか？': '탭을 전부 닫아도 괜찮을까요?',
        'ブックマークを全て削除してもよろしいですか？': '북마크를 전부 삭제해도 괜찮을까요?',
        'ブックマークは全て置き換えられますが、よろしいですか？': '북마크를 전부 덮어쓰기해도 괜찮을까요?',
    });

    let csvCache = null;
    let csvPromise = null;
    let mutationFlushQueued = false;
    let shouldCheckSettings = false;
    let viewRefreshQueued = false;
    let headerTranslationEnabled = localStorage.getItem(HEADER_TRANSLATION_STORAGE_KEY) !== 'false';
    const pendingTranslationNodes = new Set();

    const textOf = (node) => (node?.textContent || '').trim();
    const translateText = (text) => bigDIEGO[text] || text.replace(/(\d+)\s?文字/g, '$1 자');
    const setIfChanged = (node, prop, value) => node[prop] !== value ? node[prop] = value : null;
    const parseJSON = (value, fallback = null) => {
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    };
    const isElement = (node) => node?.nodeType === ELEMENT_NODE;
    const isTextNode = (node) => node?.nodeType === TEXT_NODE;
    const isIgnoredUiNode = (node) => isElement(node) && (
        IGNORED_UI_TAGS.has(node.tagName) || node.matches(IGNORED_UI_SELECTOR)
    );
    const isSettingsCandidate = (node) => isElement(node) && (
        node.matches('h2, section.section') || !!node.querySelector('h2, section.section')
    );

    const translateSelf = (node) => isTextNode(node)
        ? setIfChanged(node, 'textContent', translateText(node.textContent))
        : isElement(node) && node.tagName === 'INPUT' && node.placeholder
            ? setIfChanged(node, 'placeholder', translateText(node.placeholder))
            : null;

    const translateUI = (root) => {
        if (!root || isIgnoredUiNode(root)) return;

        translateSelf(root);

        const walkerRoot = isElement(root) ? root : null;
        if (!walkerRoot) return;

        const walker = document.createTreeWalker(
            walkerRoot,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            { acceptNode: (node) => isIgnoredUiNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }
        );

        for (let node = walker.nextNode(); node; node = walker.nextNode()) translateSelf(node);
    };

    const flushMutations = () => {
        mutationFlushQueued = false;
        pendingTranslationNodes.forEach(translateUI);
        pendingTranslationNodes.clear();
        shouldCheckSettings ? injectTranslationSetting() : null;
        shouldCheckSettings = false;
    };

    const scheduleMutationFlush = () => {
        if (mutationFlushQueued) return;
        mutationFlushQueued = true;
        queueMicrotask(flushMutations);
    };

    const observeUI = () => new MutationObserver((mutations) => {
        mutations.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
            pendingTranslationNodes.add(node);
            shouldCheckSettings = shouldCheckSettings || isSettingsCandidate(node);
        }));
        scheduleMutationFlush();
    }).observe(document.body, { childList: true, subtree: true });

    const fetchCSV = async () => csvCache || (csvPromise ||= fetch(CSV_URL)
        .then((res) => res.text())
        .then((data) => {
            csvCache = data.split('\n').reduce((acc, row) => {
                const parts = row.match(/(?:[^,"]+|"[^"]*")+/g);
                const [original, translated] = parts?.length === 2 ? parts.map((value) => value.replace(/"/g, '')) : [];
                original && translated ? acc[original] = translated : null;
                return acc;
            }, {});
            return csvCache;
        }));

    const translateMappedName = (csvData, key, isFile = true) => csvData[key]
        ? `${csvData[key]}${isFile ? '.mlt' : ''}`
        : key;

    const translateMappedDir = (csvData, dir = '') => dir
        .split('/')
        .map((item) => item ? translateMappedName(csvData, item, false) : item)
        .join('/');

    const preserveOriginalName = (item) => {
        item.originalFilename ??= item.filename;
        item.originalDir ??= item.dir;
        return item;
    };

    const getOriginalName = (item) => item?.originalFilename || item?.filename || '';
    const matchesName = (item, query) => [item?.filename || '', getOriginalName(item)].some((name) => name.includes(query));

    const getVueProxy = () => {
        const vueApp = document.querySelector('#app')?.__vue_app__;
        return vueApp?._instance?.proxy || vueApp?._container?._vnode?.component?.proxy || null;
    };

    const getBookmarkBackups = () => parseJSON(localStorage.getItem(BOOKMARK_BACKUP_STORAGE_KEY), []) || [];

    const isBackupableBookmarks = (bookmarks) => Array.isArray(bookmarks) && bookmarks.length > 0;

    const cloneBookmarks = (bookmarks) => parseJSON(JSON.stringify(bookmarks), []);

    const saveBookmarkBackup = (bookmarks, source = 'unknown') => {
        if (!isBackupableBookmarks(bookmarks)) return false;

        const snapshot = cloneBookmarks(bookmarks);
        const signature = JSON.stringify(snapshot);
        const backups = getBookmarkBackups().filter((backup) => backup?.signature !== signature);

        backups.unshift({
            savedAt: new Date().toISOString(),
            source,
            signature,
            bookmarks: snapshot,
        });

        try {
            localStorage.setItem(BOOKMARK_BACKUP_STORAGE_KEY, JSON.stringify(backups.slice(0, MAX_BOOKMARK_BACKUPS)));
            return true;
        } catch {
            return false;
        }
    };

    const backupCurrentBookmarks = (source = 'manual') => {
        const proxyBookmarks = getVueProxy()?.bookmarks;
        const storedBookmarks = parseJSON(localStorage.getItem('aamz_bookmarks'), []);
        return saveBookmarkBackup(isBackupableBookmarks(proxyBookmarks) ? proxyBookmarks : storedBookmarks, source);
    };

    const downloadJSON = (data, filename) => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = Object.assign(document.createElement('a'), { download: filename, href: url });
        anchor.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const exportLatestBookmarkBackup = () => {
        backupCurrentBookmarks('export');

        const latest = getBookmarkBackups()[0];
        if (!latest?.bookmarks?.length) {
            alert('내보낼 북마크 백업이 없습니다.');
            return;
        }

        const stamp = latest.savedAt.replace(/[:.]/g, '-');
        downloadJSON(latest.bookmarks, `AAMZViewerBookmarks.backup.${stamp}.json`);
    };

    const patchBookmarkStorageWrites = () => {
        const storagePrototype = Storage.prototype;
        if (storagePrototype.__bigDiegoBookmarkBackupPatched) return;

        const originalSetItem = storagePrototype.setItem;
        storagePrototype.setItem = function(key, value) {
            key === 'aamz_bookmarks' ? saveBookmarkBackup(parseJSON(value, []), 'localStorage-set') : null;
            return originalSetItem.apply(this, arguments);
        };

        Object.defineProperty(storagePrototype, '__bigDiegoBookmarkBackupPatched', { value: true });
    };

    const updateHeaderTranslationCheckbox = () => {
        const icon = document.querySelector(`${HEADER_SETTING_SELECTOR} .icon`);
        if (!icon) return;

        icon.className = headerTranslationEnabled ? 'icon checked' : 'icon';
        icon.replaceChildren(Object.assign(document.createElement('i'), {
            className: headerTranslationEnabled ? 'fas fa-check-square' : 'fas fa-square',
        }));
    };

    const applyHeaderTranslationState = (item, csvData) => {
        preserveOriginalName(item);
        item.dir = headerTranslationEnabled ? translateMappedDir(csvData, item.originalDir) : item.originalDir;
        item.filename = headerTranslationEnabled ? translateMappedName(csvData, item.originalFilename, true) : item.originalFilename;
    };

    const syncHeaderTranslationState = async () => {
        const proxy = getVueProxy();
        if (!proxy?.matomeData) return;

        const csvData = headerTranslationEnabled ? await fetchCSV() : null;
        Object.values(proxy.matomeData).forEach((item) => item ? applyHeaderTranslationState(item, csvData) : null);
        typeof proxy.$forceUpdate === 'function' ? proxy.$forceUpdate() : null;
    };

    const setHeaderTranslationEnabled = async (enabled) => {
        if (headerTranslationEnabled === enabled) return;

        headerTranslationEnabled = enabled;
        localStorage.setItem(HEADER_TRANSLATION_STORAGE_KEY, String(enabled));
        updateHeaderTranslationCheckbox();
        await syncHeaderTranslationState();
    };

    const scheduleVueRefresh = () => {
        if (viewRefreshQueued) return;

        viewRefreshQueued = true;
        queueMicrotask(() => {
            viewRefreshQueued = false;

            const proxy = getVueProxy();
            if (!proxy) return;

            proxy.matomeFileFilter?.text?.length ? proxy.setFilterFlags?.() : null;
            typeof proxy.$forceUpdate === 'function' ? proxy.$forceUpdate() : null;
        });
    };

    const syncReactiveTranslations = (path, csvData) => {
        if (path !== 'matome-zip/search/heading' && path !== 'matome-zip/comp/file/list') return;

        const proxy = getVueProxy();
        if (!proxy) return;

        const translateName = (key, isFile = true) => translateMappedName(csvData, key, isFile);
        const translateDir = (dir) => translateMappedDir(csvData, dir);

        processSearchResultList(
            path === 'matome-zip/search/heading' ? proxy.searchResults || [] : proxy.compFileList || [],
            translateName,
            translateDir
        );
    };

    const findSettingsModal = () => Array.from(document.querySelectorAll('h2'))
        .find((node) => SETTINGS_TITLES.has(textOf(node)))?.parentElement || null;

    const findSectionByTitle = (modal, titles) => Array.from(modal.querySelectorAll('section.section'))
        .find((section) => titles.has(textOf(section.querySelector('h3'))));

    const createTranslationSettingSection = () => {
        const section = document.createElement('section');
        section.className = 'section';
        section.dataset.bigdiegoTranslationSettings = 'true';
        section.innerHTML = [
            '<h3>스크립트 설정</h3>',
            `<span class="checkbox" ${HEADER_SETTING_SELECTOR.slice(1, -1)}>`,
            '<span class="icon"></span>',
            '<span class="label">파일 패스 및 이름 헤더 번역</span>',
            '</span>',
            '<p style="margin: 8px 0 0;">',
            `<button class="info" type="button" style="padding: 5px;" ${BOOKMARK_BACKUP_EXPORT_SELECTOR.slice(1, -1)}>북마크 백업 내보내기</button>`,
            '</p>',
        ].join('');
        section.querySelector(HEADER_SETTING_SELECTOR)?.addEventListener('click', (event) => {
            event.stopPropagation();
            setHeaderTranslationEnabled(!headerTranslationEnabled);
        });
        section.querySelector(BOOKMARK_BACKUP_EXPORT_SELECTOR)?.addEventListener('click', (event) => {
            event.stopPropagation();
            exportLatestBookmarkBackup();
        });
        return section;
    };

    const injectTranslationSetting = () => {
        const modal = findSettingsModal();
        if (!modal) return false;

        if (modal.querySelector(TRANSLATION_SETTING_SELECTOR)) {
            updateHeaderTranslationCheckbox();
            return true;
        }

        const actionSection = findSectionByTitle(modal, ACTION_SETTING_TITLES);
        const bookmarkSection = findSectionByTitle(modal, BOOKMARK_TITLES);
        if (!actionSection || !bookmarkSection) return false;

        modal.insertBefore(createTranslationSettingSection(), bookmarkSection);
        updateHeaderTranslationCheckbox();
        return true;
    };

    const filterFolders = (items, flags, searchText) => {
        let matched = false;

        for (const item of items) {
            if (item.isF) {
                flags[item.hash] = true;
                continue;
            }

            const childMatched = item.child ? filterFolders(item.child, flags, searchText) : false;
            const itemMatched = matchesName(item, searchText) || childMatched;
            matched = itemMatched ? true : matched;
            itemMatched ? null : flags[item.hash] = true;
        }

        return matched;
    };

    const filterFiles = (items, flags, searchText) => {
        let matched = false;

        for (const item of items) {
            const isFolder = !item.isF && item.child;
            const itemMatched = isFolder ? filterFiles(item.child, flags, searchText) : matchesName(item, searchText);
            matched = itemMatched ? true : matched;
            itemMatched ? null : flags[item.hash] = true;
        }

        return matched;
    };

    const patchVueAppMethods = () => {
        const proxy = getVueProxy();
        if (!proxy || proxy.__bigDiegoPatched) return !!proxy;

        proxy.setFilterFlags = function() {
            this.matomeFileFilter.flags = {};
            const { text, type, flags } = this.matomeFileFilter;
            text.length === 0 ? null : (type === 'folder' ? filterFolders : filterFiles)(this.matomeFileList, flags, text);
        };

        typeof proxy.$watch === 'function'
            ? proxy.$watch(() => proxy.matomeFileFilter?.text, () => proxy.setFilterFlags())
            : null;

        proxy.__bigDiegoPatched = true;

        backupCurrentBookmarks('vue-patch');
        typeof proxy.$watch === 'function'
            ? proxy.$watch(() => proxy.bookmarks, (bookmarks) => saveBookmarkBackup(bookmarks, 'vue-watch'), { deep: true })
            : null;

        return true;
    };

    const detectVueApp = () => {
        if (patchVueAppMethods()) return;

        const observer = new MutationObserver(() => patchVueAppMethods() ? observer.disconnect() : null);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    };

    const prepareFileList = (items) => items.forEach((item) => {
        item.child && Array.isArray(item.child) ? prepareFileList(item.child) : null;
        preserveOriginalName(item);
    });

    const processFileList = (items, translateName) => items.forEach((item) => {
        item.child && Array.isArray(item.child) ? processFileList(item.child, translateName) : null;
        item.filename = translateName(item.originalFilename, item.isF);
    });

    const prepareHeaderContents = (data) => preserveOriginalName(data);

    const processHeaderContents = (data, translateName, translateDir) => {
        headerTranslationEnabled
            ? (data.dir = translateDir(data.originalDir), data.filename = translateName(data.originalFilename, true))
            : (data.dir = data.originalDir, data.filename = data.originalFilename);
    };

    const prepareSearchResultList = (items) => items.forEach((item) => preserveOriginalName(item));

    const processSearchResultList = (items, translateName, translateDir) => items.forEach((item) => {
        preserveOriginalName(item);
        item.dir = translateDir(item.originalDir);
        item.filename = translateName(item.originalFilename, true);
    });

    const RESPONSE_HANDLERS = Object.freeze([
        ['matome-zip/file/list', prepareFileList, (data, translateName) => processFileList(data, translateName)],
        ['matome-zip/file/contents', prepareHeaderContents, processHeaderContents],
        ['matome-zip/search/heading', prepareSearchResultList, processSearchResultList],
        ['matome-zip/comp/file/list', prepareSearchResultList, processSearchResultList],
    ]);
    const BLOCKING_TRANSLATION_PATHS = new Set(['matome-zip/file/list', 'matome-zip/file/contents']);

    const addAxiosInterceptor = () => {
        const axios = window.axios;
        if (!axios || axios.__bigDiegoPatched) return;

        axios.interceptors.response.use(async (response) => {
            const url = response.config?.url || '';
            const handler = RESPONSE_HANDLERS.find(([path]) => url.includes(path));
            if (!handler) return response;

            const [path, prepare, translate] = handler;
            prepare(response.data);

            if (path === 'matome-zip/file/contents' && !headerTranslationEnabled) return response;

            if (BLOCKING_TRANSLATION_PATHS.has(path)) {
                const csvData = await fetchCSV();
                const translateName = (key, isFile = true) => translateMappedName(csvData, key, isFile);
                const translateDir = (dir) => translateMappedDir(csvData, dir);
                translate(response.data, translateName, translateDir);
                return response;
            }

            fetchCSV()
                .then((csvData) => {
                    const translateName = (key, isFile = true) => translateMappedName(csvData, key, isFile);
                    const translateDir = (dir) => translateMappedDir(csvData, dir);
                    translate(response.data, translateName, translateDir);
                    syncReactiveTranslations(path, csvData);
                    scheduleVueRefresh();
                })
                .catch(() => null);

            return response;
        }, (error) => Promise.reject(error));

        axios.__bigDiegoPatched = true;
    };

    const detectAxios = () => {
        if (window.axios) {
            addAxiosInterceptor();
            return;
        }

        let axiosValue;
        Object.defineProperty(window, 'axios', {
            configurable: true,
            enumerable: true,
            get: () => axiosValue,
            set: (value) => {
                axiosValue = value;
                value ? addAxiosInterceptor() : null;
            },
        });
    };

    const bindConfirmTranslation = () => {
        const originalConfirm = window.confirm;
        window.confirm = (message) => originalConfirm(translateText(message));
    };

    const bindScrollTopDebugCopy = () => document.addEventListener('click', (event) => {
        if (!event.ctrlKey || !event.altKey) return;

        const content = event.target.closest('.view-aa-row')?.querySelector('.view-aa-content[data-idx]');
        const dataIdx = Number.parseInt(content?.getAttribute('data-idx'), 10);
        if (!content || Number.isNaN(dataIdx)) return;

        const contents = Array.from(document.querySelectorAll('.view-aa-content[data-idx]'));
        const upperHeight = contents
            .slice(0, contents.indexOf(content))
            .reduce((sum, element) => sum + element.getBoundingClientRect().height, 0);
        const scrollTop = upperHeight + (dataIdx * 41) + 144;

        confirm(`현재 scrollTop은 ${scrollTop} 입니다. 복사할까요?`)
            ? navigator.clipboard.writeText(`"scrollTop": ${scrollTop},`).then(() => alert('성공!')).catch(() => alert('실패...'))
            : null;
    });

    const bindBookmarkBackupProtection = () => {
        patchBookmarkStorageWrites();
        backupCurrentBookmarks('boot');
        window.addEventListener('beforeunload', () => backupCurrentBookmarks('beforeunload'));
    };

    const bootUI = () => {
        translateUI(document.body);
        injectTranslationSetting();
        observeUI();
    };

    bindConfirmTranslation();
    bindScrollTopDebugCopy();
    bindBookmarkBackupProtection();
    detectAxios();
    detectVueApp();
    document.readyState === 'loading'
        ? window.addEventListener('load', bootUI, { once: true })
        : bootUI();
})();
