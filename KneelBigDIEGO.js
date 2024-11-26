// ==UserScript==
// @name         KneelBigDIEGO
// @namespace    https://github.com/Da1eth
// @version      0.1.5
// @description  maybe good script with AAMZ
// @author       Daleth
// @match        https://aa.yaruyomi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaruyomi.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const bigDIEGO = {
        "まとめZIP ": "마토메 ZIP ",
        "検索": "검색",
        "見出し検索": "소제목 검색",
        "フィルター": "파일 이름 검색",
        "検索文字列": "검색할 내용을 입력",
        "前バージョンとの比較": "신규 작성/수정된 파일",
        "ブックマーク": "북마크",
        "お知らせ": "공지사항",
        "設定": "설정",
        "画面表示（ドラッグで表示位置の並び替えが可能）": "화면 표시 설정 (마우스 드래그로 순서 변경 가능)",
        "まとめZIPリスト": "마토메 ZIP 리스트",
        "前バージョンとの比較リスト": "이전 버전과의 차이점 리스트",
        "メインビュー": "메인 뷰",
        "サムネイルビュー": "섬네일 뷰",
        "動作設定": "일반 동작 설정",
        "終了時のタブを保存し、次回復元する": "종료 시 열려있던 탭 기록을 보존",
        "AAコピー時、対象AA全体をコピーする": "복사 시 언제나 AA 전체를 복사",
        "AAの画像保存時、背景色を白にする": "AA를 이미지로 저장할 때 배경을 흰색으로 저장",
        "サムネイルを濃くする": "섬네일 이미지를 진하게 하기",
        "タブの閉じるボタンを左側にする": "탭 닫기 버튼을 탭의 왼쪽에 두기",
        "まとめZIPリストのひらがな・カタカナを区別せず並び替える": "리스트를 정렬할 때 히라가나/가타가나를 구분하지 않기",
        "まとめZIPリストのアルファベットの大文字・小文字を区別せず並び替える": "리스트를 정렬할 때 알파벳 대문자/소문자를 구분하지 않기",
        "エクスポート": "내보내기",
        "インポート": "가져오기",
        "更新情報": "파일 갱신 기록",
        "個別ページを開く": "새 창에서 열기",
        "個別ページ表示": "새 창에서 열기",
        "　個別ページ表示": "　새 창에서 열기",
        "名前を変更": "이름 바꾸기",
        "　ブックマークへ追加": "　북마크에 추가",
        "フォルダをブックマークに追加": "폴더를 북마크에 추가",
        "フォルダをダウンロード": "폴더를 다운로드",
        "ファイルをブックマークに追加": "파일을 북마크에 추가",
        "ファイルをダウンロード": "파일을 다운로드",
        "フォルダ追加": "폴더 만들기",
        "全て削除": "전부 삭제",
        "ブックマークから削除": "북마크에서 삭제",
        "　ブックマークから削除": "　북마크에서 삭제",
        "このAAをコピー": "AA를 복사",
        "サムネイル": "섬네일",
        "サムネイル画像.zip": "AA섬네일.zip",
        "画像を保存": "섬네일 이미지를 저장",
        "画像化して保存": "이미지로 저장",
        "ダウンロード": "다운로드",
        "　ダウンロード": "　다운로드",
        "ダウンロード履歴をクリアしてもよろしいですか？": "다운로드 기록을 전부 삭제해도 괜찮을까요?",
        "まとめZIPファイルをミラーからダウンロード": "마토메 ZIP 파일 전체를 다운로드",
        "ダウンロード履歴（最大 30 件） ※個別ページのダウンロードは対象外です": "파일 다운로드 기록 (최대 30개) ※새 창에서 열기로 다운로드한 내역은 기록되지 않습니다.",
        "ダウンロード履歴をクリア": "다운로드 기록 삭제",
        "画像一括ダウンロード": "섬네일 이미지 일괄 다운로드",
        "パス": "파일 패스(위치)",
        "ファイル名": "파일 이름",
        "ファイルサイズ": "파일 크기",
        "アクション": "액션",
        "コピー": "복사",
        "ソース表示": "소스 보기",
        "全てのタブを閉じる": "모든 탭 닫기",
        "全てのタブを閉じてもよろしいですか？": "탭을 전부 닫아도 괜찮을까요?",
        "ブックマークを全て削除してもよろしいですか？": "북마크를 전부 삭제해도 괜찮을까요?",
        "ブックマークは全て置き換えられますが、よろしいですか？": "북마크를 전부 덮어쓰기해도 괜찮을까요?",
    };

    const translateText = text => {
        return text.replace(/(\d+)\s?文字/, "$1 자")
            .replace(/.*/, match => bigDIEGO[match] || match);
    };

    const translateUI = node => {
        node.nodeType === Node.ELEMENT_NODE && (
            node.tagName === 'INPUT' && node.placeholder
            ? node.placeholder = translateText(node.placeholder)
            : node.childNodes.forEach(translateUI)
        );

        node.nodeType === Node.TEXT_NODE && (
            node.textContent = translateText(node.textContent)
        );
    };

    const observe = () => {
        new MutationObserver(mutations => {
            mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
                translateUI(node);
                node.nodeType === Node.ELEMENT_NODE && node.querySelectorAll('*').forEach(translateUI);
            }));
        }).observe(document.body, { childList: true, subtree: true });
    };

    const originalConfirm = window.confirm;
    window.confirm = (message) => {
        return originalConfirm(translateText(message));
    };

    window.addEventListener('load', () => {
        document.body.querySelectorAll('*').forEach(translateUI);
        observe();
    });

    document.addEventListener('click', (event) => {
        if (event.ctrlKey && event.altKey) {
            const content = event.target.closest('.view-aa-row')?.querySelector('.view-aa-content[data-idx]');
            if (content) {
                const dataIdx = parseInt(content.getAttribute('data-idx'), 10);
                if (!isNaN(dataIdx)) {
                    const allContents = Array.from(document.querySelectorAll('.view-aa-content[data-idx]'));
                    const upperHeight = allContents
                    .slice(0, allContents.findIndex((el) => el === content))
                    .reduce((sum, el) => sum + el.getBoundingClientRect().height, 0);
                    const result = upperHeight + (dataIdx * 41) + 144;

                    confirm(`현재 scrollTop은 ${result} 입니다. 복사할까요?`) &&
                        navigator.clipboard.writeText(`"scrollTop": ${result},`).then(() => {
                        alert('성공!');
                    }).catch(err => {
                        alert('실패...');
                    });
                }
            }
        }
    });

})();