// ==UserScript==
// @name         极简划词搜索Mod
// @description  超小尺寸悬浮窗，支持划词搜索、复制、打开链接；预定义六组高亮样式（可自定义），动态添加关键词增量高亮，无闪烁；自动高亮默认关闭，加粗样式默认注释；工具栏默认手动隐藏；可配置显示的搜索引擎；可调整按钮顺序；可全局开启/关闭高亮功能；极致性能优化
// @icon         https://www.baidu.com/favicon.ico
// @namespace    com.github.skeaner
// @version      1.0.0
// @author       Skeaner
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://raw.githubusercontent.com/Skeaner/SimpleSearch/refs/heads/master/Simple.user.js
// @updateURL https://raw.githubusercontent.com/Skeaner/SimpleSearch/refs/heads/master/Simple.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 常量定义 ====================
    const CONFIG = {
        TOOLBAR_HIDE_MODE: 'manual',
        HIDE_DELAY: 1000,
        AUTO_HIGHLIGHT_ENABLED: false,
        OFFSET_LEFT_ICON_COUNT: 0,
        OFFSET_DOWN_ICON_COUNT: 0
    };

    const HIGHLIGHT_GROUPS = [
        { name: "红底白字", keywords: [], style: "background-color:#DE0422; color:#FFFFFF; /* font-weight:bold; */" },
        { name: "绿底白字", keywords: [], style: "background-color:#66CC00; color:#FFFFFF; /* font-weight:bold; */" },
        { name: "蓝底白字", keywords: [], style: "background-color:#32A7FF; color:#FFFFFF; /* font-weight:bold; */" },
        { name: "橙红底白字", keywords: [], style: "background-color:#FF9933; color:#FFFFFF; /* font-weight:bold; */" },
        { name: "紫底白字", keywords: [], style: "background-color:#6633FF; color:#FFFFFF; /* font-weight:bold; */" },
        { name: "深绿底白字", keywords: [], style: "background-color:#008373; color:#FFFFFF; /* font-weight:bold; */" }
    ];

    // ==================== 引擎图标配置（统一在此填入 Base64，留空则回退默认图标，可复用） ====================
    const ENGINE_ICONS = {
        google: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA5FBMVEVHcEz9SlD/TkL/RUH/RUD/RkP4gyr/SUX/Rj//SE3/Yjb/UDn/Szz9TFb/Yi7/WTT8TVn/cyf/Zi7/iRz/fSL/lRb/SEjeuwX/qQ7/nhP/tgv9TFX6yQj/wwn/zAffugr8zgb+zwnzzQb4ywkvhv82qo79zgQek+ApjurzzAPlywIvhv0qifjRyQEth/y5yAKnxwAoivaMxQUak94fj+hzxAtawxdawhgLpa4OncYVltc8wCobvFIMuWgHqp0KorWaxQEnvz4bvUwPumUNumQMumgIr4wIqaIRvFoNu2MKtnRJwh6BPIl6AAAATHRSTlMAWZDK7P8Orf//Gv///+b/5P7////4dor///8qmP/9K0j/tu7/DeYwRP//HWr/rv///v/b///+HMT///+XTvD/5f//yGzw///////mXfQ9oAAAAWBJREFUeAF0z1UCgCAQRdEZ7O7u/W9STPr93oMCcENi2Y5jWwRBM9fz7zl0QeCFcidRHLMeJAkRj6dZdom/0+Uu62FRlpcQQILsfFVfIrqE/wPWoWleEXstYutdgO9dP9wi++/VCt0dx0dwL5u4DvNyiaFywbB1WS6ymfp+rJSMM5g2H7fYjOCsi5wOIAiCKNhRnG1bazv/fG7erFW/VcNezFEsKWVVZk2bOVi0BVuawE9GbcGOJrxoD3DEZD5ZtAcLdsX9vvWSW/ZM5g+H7JnHhFMcsI+CPpwXVOGSBsT8+Xy9VX5qfQerC77yDP94rEvB8/VCscO4z1f49+db8D9BFJEQ6N64/0hyqhVV03hxIo7+eMNLhmnZimLLjut6msCKZ3qhR+wN0/f9IAjD0PV4kV3rW/QoXF5sC4+KcEAShMkWzBeQ+QaFLX5rKrOWzcQjsHbUgCJbThA4lmwXVv8BPaBVEHC66TMAAAAASUVORK5CYII=',      // 示例: 'data:image/png;base64,...'
        baidu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAb1BMVEX///+7vfNna+fHyPXW1/cAAN4fKeDx8vyQk+wcJ+ApMuEPHuAJGt/IyvX7/P6rrfDs7fwAE98/RuPe3/l/gurV1vdwdOh5femxs/Gcnu63uPJgZOZ0eOmLjuw3PuKFiOvv7/xXXOWvsfGmqPBZXuUVxkiOAAAA2ElEQVR4Ac2PxQHDMBAE17CGk0kUMIb6bzHwMhaQEWsEd/hjgjACojA4cjETpum3iw9klouKIiV5diyLsiwOZFXHDZWuKq3YxHW1kqagbeoG+HaWhVk6qyV3vwd+V1wu2i6k15KcgDN5Bk6JaI8FoniB0yLK4UIlWJJeWwTsjIgO0F5TbGhJZCoRtgdpsuurIexyNw5bNzBChSluiYEbe+OIO6vJX5gOOW8rWRaCnunk258sypVsqB6/x5+/LmeDFb3W4/0uNPfXqHtsqLvOPbx/uK6r8a98AHl4DLrdn11VAAAAAElFTkSuQmCC"',       // 百度（百科 / 翻译 / 百度地图留空时也会默认复用此图标）
        baike: '',       // 百度百科（留空则复用 baidu）
        wiki: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAnklEQVR4AeTNIQiDQABG4b+u17X1aF6PK3YEO9iMJqPVau82y4FgMezS0oVLhqsHtrcqeqzDXv3CEz/6L4yTtZM3dnHmPTtjzXZAXKYVo4agkU2GI2Lloc6JDez1+flswMu1EQZ3xlE7lK8eKDkjtwE+crBMV+wesKmCiisGGepZIfQJpMj9SNb2MYWrChjVkULuCyCfRvsdmBieyQQAsoDk/9ryhFMAAAAASUVORK5CYII=',        // 维基百科
        douban: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEUAdxEAdxEAdQEAcABMmFSmw6iSvpf///8qgS8AbgDA1cKt0LHv9/DY6tsAaACPxZfE2sZ9rYHE2MaFXlqtAAAAAXRSTlNbvF9QGgAAALBJREFUeAGE0QUCQEAURVE/zJsW+1+s0c3VjlZV9Npmj43I8hDPyFo/pDyhGDxk5B/JPsYzMj/SjOQ8Lnm3YwBi2opAOGPQrXBD43jJmTsKLckDZlnKd0zNVntCCTh1xs5HIPVtqU9A9J1sSJLHu/LUeMdcbENiBfz4zdh6QJlOaCOSjqgJ0R5Qcs7jA3e51I1PU5Yyo9R4qJZ/5K73t/pu/dnuId6fdhgWQEgSb3YAAIPcDyRUg4uBAAAAAElFTkSuQmCC',      // 豆瓣
        fanyi: '',       // 百度翻译（留空则复用 baidu）
        xiaohongshu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAh1BMVEX/JEL+JUT5JEP/AC3/Ejj/GTv/IkH/HT7/AC//ATL/CjT/3+L/l5//eIP/7vH/ZHX/b37/Q1j/U2f/0dX/wMb/aXn/TmH/////q7H/ACX/5+n/AAD/kJr/4ub/vMH/+fr//P3/o6r/W2v/sbb/ABv/mqH/M0z/s7n/PVL/pq3/fYr/ACD/y89pi0ncAAAA+UlEQVR4AbSNVWKFMBAAgU0ggtvi7nD/69VCvf18E8+saC/ouqH9wNB1dVHnT9TvX0rp//Lu3H+cSjX+dUo9DiAvGwXTotSyGKemZX44IW2iUcfVPN8PwihOrDS4LQWGGbC8iEsXsYoQUdaNUM5vadf3xYBtRtqRQB1XyIlKJBVOXT/jsuIG7b40bRFhdjcVO5Zdf2AetceLTFvsXBdXoeTqlt3u4RJJf2r7s5RxWdYxf5PWsFe459dwreGFRXMWV9q3Sr5Y1svFyld3Xou6iPJrJIVMLe2GwEt7AUIAANO4MAGs59EuxPFGNt5kgjeB4Uua+BM13uwAAEymEb6jFNmeAAAAAElFTkSuQmCC', // 小红书
        douyin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAABaklEQVR4Ae2TM2BdARSGT23btrvUtpa6XeommbLE2bLEyRrbtm3btm2fnOf3Yvu71n/0X1hiVslOgsQIxv7EYZgqNmAHInbTJqO+B6aItdiKLHKKRKZclMiyd516USKitBgU5ODF46kUZfXXwz/wD6yYCtHMfJ6wf6QpnIGxQnX5ukJlPmmdgfUCord+2nwXIjmsa0T3oDGLGmoBdqtjVx0yufpdQPSdKADsAVCDXWEbb8rtvgCjQ+3H7uy+HiSGEd0zgd4F93YiQdUp65LVJytKab7ubuYmSNVdZ1Y6OVF7C2PsQiI8oRLuAYvJi7Jrj0uzhKPAZesW/umPU1RG3I1MzSTw2Xf+YLy2bHsF40W2pQ45fDbSY5ghMYLSZPmBjMlry7iS7UYe0YiUO/sO+eHEB4YxJ8A3KQkcRF9VLcsPMGE+HzjdZOHE+M1zimhoZFhqpduB2zB5JGCDK1ykVXPN+etrt8JssUQ/ojyGpDQgIdwAAAAASUVORK5CYII=',      // 抖音
        jd: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAgVBMVEVHcEz/CAD/BAD/BAD/BAD/BAD/AAD/Dgv5OTf/UlH/Liz9v77+4OD/dHT8rq7////6+Pj+0tH/hoX/mZjz8fH9/Pxvb2/IyMi3t7eXl5cAAABPT09+fn7Nzc2goKCqqqrb29vp6OhiYmIHBweJiYn7ZWM+Pj71AAD5o6L6kI/tDQLbTYDHAAAABnRSTlMABI3i/yZvWrP2AAABY0lEQVR4AX2TBZaDQBBEG+t4anD3+P0PuJNG3mTt4/CBkWoismzH/RXHtkjjuf/gEVnuv1hk/y/YZP6fhc92kNydH262u912lhaReH84nph5dz5iQvmB8SnaQxOeIqwgBsKz3sSgI35HAae3QYCK/zBi5regIgUhSbGSpYhj+QmpaP59XpRYKQsFBTAbQlJU0NRN273tev4ERb2CUA+xvDqOxQVx2c+t0EIMg6YoijFdOxKYQgeh72WvRFBvAbNfwKCIRMCVVH/ERDtgJa8wCSHF2xAzl1u0nmEWdrS5b7GQjkNb11lVNNBo+3hlYvfuY6VrqipPIcjEu+S6vMVvHNiVydIbB/iJWvIgUQt/PpfXRRDjGuMDf40mLXF9GIo6yXNDkMw+n4/H+fx4Pp9mstfY6/Bet6/7/b49hWzG3p6fnz56aBSONbcSJo/VsKbiZY6B2Mj9htfilfKXHyhDCHkp/y9f+jDZxYTJwAAAAABJRU5ErkJggg==',          // 京东（京东码 / 京东搜复用）
        amap: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAwFBMVEVHcEzP5tSw6YW45oH/0Gip6oKv6IHC7Z/////y8ezz7+jy8eyz6Ie95H3/zWGu6X7z8Ovy8Ov18u399uzh4d7p7e7y8OvC2fRmpOEAhe9CofZvt+/C75QlmPkAjf4AguUAkf62z+sAk/4Alf8Ae9udyP8Abcf/1F7x8vKQvvH27NrSx4sAYLi/uI2jyf/c2dLpvFr65pbl2I6OkI//6ZL/3kGonoUAUKwAQ5tncnj744f7zGXCqnVWcpvn0HSmy//bkwjQAAAAQHRSTlMAIaXt///////34JyX/////3//////jP////////////////////////v///////////////////////////+T80zBKgAAAWFJREFUeAFt0oWWgzAQQNHUvc3iGlKk7u79/7/amUFWH849OAwqlStVqFbHGs1mq9Vqd0qM6tbrvX6OA0BOfWRWIFQgaqle//dIqMTK9X+OVFRN59xglX+OVE3LVjlvs/rfI03Htl3AFhtgKdKqZ/oisOVQQWxQiLTihiKKg0joiqK0WBNTEWGZCBlGoyCSfhP7wvHEFSIMQ7BQTFPk2Kw/nltwVBiJBVhIl+QtQmW2dIDAbLJQ6JwQbeUjgQVokK/mqNBRaHFmclogn01DiTZaxGShMJUCFW1tyUgWRpcknEB8vVn6i8Kko06wFttiu81mXxhc8rCl2JHabE6Lsy1TFPNjWoZVwMt1KYnFMccb1b8/zs/X64WvSTq7LNaeQLN+dfPU1tDQF9JdJdSUdTgEeL/rGvFUTFdpb1bKsFqdwIrCeVNPMiwxZnxH4GazOJCB/otkUKnTRmxRHP4HpBLAJ7EvSb1z5OdPAAAAAElFTkSuQmCC',        // 高德地图
        baiduMap: ''     // 百度地图（留空则复用 baidu）
    };

    // ==================== 内置搜索引擎列表 ====================
    const ALL_SEARCH_ENGINES = [
        { name: 'G', icon: ENGINE_ICONS.google, url: 'https://www.google.com/search?q=%s' },
        { name: '百度', icon: ENGINE_ICONS.baidu, url: 'https://www.baidu.com/s?wd=%s&ie=utf-8' },
        { name: '百科', icon: ENGINE_ICONS.baike || ENGINE_ICONS.baidu, url: 'https://baike.baidu.com/item/%s' },
        { name: '维基', icon: ENGINE_ICONS.wiki, url: 'https://zh.wikipedia.org/w/index.php?search=%s' },
        { name: '豆瓣', icon: ENGINE_ICONS.douban, url: 'https://www.douban.com/search?q=%s' },
        { name: '翻译', icon: ENGINE_ICONS.fanyi || ENGINE_ICONS.baidu, url: 'https://fanyi.baidu.com/#auto/auto/%s' },
        { name: '小红书', icon: ENGINE_ICONS.xiaohongshu, url: 'https://www.xiaohongshu.com/search_result?keyword=%s' },
        { name: '抖音', icon: ENGINE_ICONS.douyin, url: 'https://www.douyin.com/search/%s' },
        { name: '京东码', icon: ENGINE_ICONS.jd, url: 'https://item.jd.com/%s.html' },
        { name: '京东搜', icon: ENGINE_ICONS.jd, url: 'https://search.jd.com/Search?keyword=%s' },
        { name: '高德地图', icon: ENGINE_ICONS.amap, url: 'https://www.amap.com/search?query=%s' },
        { name: '百度地图', icon: ENGINE_ICONS.baiduMap || ENGINE_ICONS.baidu, url: 'https://map.baidu.com/search/?querytype=s&wd=%s' }
    ];

    // 从全局存储加载配置
    let enabledEngineNames = (() => {
        const saved = GM_getValue('search_engines_config', null);
        return saved && Array.isArray(saved) ? saved : ALL_SEARCH_ENGINES.map(e => e.name);
    })();

    let buttonOrder = GM_getValue('button_order_config', 'copy-first');
    let highlightEnabled = GM_getValue('highlight_enabled', true);

    // V2.5.0 新增：图标显示开关（默认显示），设置齿轮图标不受影响
    let showEngineIcons = GM_getValue('show_engine_icons', true);
    // V2.5.0 新增：自定义搜索引擎列表 [{ name, url, icon }]
    let customEngines = GM_getValue('custom_engines', []);

    const saveSearchEngineConfig = (v) => GM_setValue('search_engines_config', v);
    const saveButtonOrderConfig = (v) => GM_setValue('button_order_config', v);
    const saveHighlightEnabled = (v) => GM_setValue('highlight_enabled', v);
    const saveShowEngineIcons = (v) => GM_setValue('show_engine_icons', v);
    const saveCustomEngines = (v) => GM_setValue('custom_engines', v);

    // 获取所有引擎（内置 + 自定义），供工具栏渲染
    const getAllEngines = () => [...ALL_SEARCH_ENGINES, ...customEngines];

    // 获取已启用的引擎（内置 + 自定义）
    const getEnabledEngines = () => getAllEngines().filter(e => enabledEngineNames.includes(e.name));

    // ==================== 高亮管理 ====================
    let highlights = [], nextStyleIndex = 0, highlightTimer, highlightDebounceTimer;
    let observer, observerDebounceTimer;

    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const isNodeHighlighted = node => node.parentElement?.closest('.search-highlight') !== null;

    function applyHighlightsAsync() {
        if (highlightTimer) clearTimeout(highlightTimer);
        if (!highlights.length) return;

        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: node => {
                if (node.parentElement && ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.parentElement.tagName))
                    return NodeFilter.FILTER_REJECT;
                return isNodeHighlighted(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
        });
        while (walker.nextNode()) textNodes.push(walker.currentNode);

        const regex = new RegExp(`(${highlights.map(h => escapeRegExp(h.keyword)).join('|')})`, 'gi');
        let idx = 0;
        const BATCH_SIZE = 50;

        const process = () => {
            const end = Math.min(idx + BATCH_SIZE, textNodes.length);
            for (let i = idx; i < end; i++) {
                const node = textNodes[i], text = node.textContent;
                const matches = [];
                let match;
                while ((match = regex.exec(text))) matches.push({ index: match.index, keyword: match[0], length: match[0].length });
                if (!matches.length) continue;

                const frag = document.createDocumentFragment();
                let lastPos = 0;
                for (const m of matches) {
                    const h = highlights.find(h => h.keyword.toLowerCase() === m.keyword.toLowerCase());
                    if (!h) continue;
                    const style = HIGHLIGHT_GROUPS[h.styleIndex % HIGHLIGHT_GROUPS.length]?.style || HIGHLIGHT_GROUPS[0].style;
                    if (m.index > lastPos) frag.appendChild(document.createTextNode(text.substring(lastPos, m.index)));
                    const span = document.createElement('span');
                    span.className = 'search-highlight';
                    span.style.cssText = style;
                    span.textContent = m.keyword;
                    frag.appendChild(span);
                    lastPos = m.index + m.length;
                }
                if (lastPos < text.length) frag.appendChild(document.createTextNode(text.substring(lastPos)));
                node.parentNode.replaceChild(frag, node);
            }
            idx = end;
            if (idx < textNodes.length) highlightTimer = setTimeout(process, 0);
            else highlightTimer = null;
        };
        highlightTimer = setTimeout(process, 0);
    }

    const addDynamicHighlight = keyword => {
        if (!keyword) return;
        const idx = highlights.findIndex(h => h.keyword === keyword);
        if (idx !== -1) {
            const savedStyle = highlights[idx].styleIndex;
            highlights.splice(idx, 1);
            highlights.push({ keyword, styleIndex: savedStyle });
        } else {
            highlights.push({ keyword, styleIndex: nextStyleIndex++ % HIGHLIGHT_GROUPS.length });
        }
        if (highlightDebounceTimer) clearTimeout(highlightDebounceTimer);
        highlightDebounceTimer = setTimeout(() => { applyHighlightsAsync(); highlightDebounceTimer = null; }, 50);
    };

    if (CONFIG.AUTO_HIGHLIGHT_ENABLED) {
        HIGHLIGHT_GROUPS.forEach((g, i) => g.keywords.forEach(k => highlights.push({ keyword: k, styleIndex: i })));
        applyHighlightsAsync();
    }

    // MutationObserver
    (() => {
        observer = new MutationObserver(() => {
            if (observerDebounceTimer) clearTimeout(observerDebounceTimer);
            observerDebounceTimer = setTimeout(() => { applyHighlightsAsync(); observerDebounceTimer = null; }, 200);
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    })();

    // ==================== 图标 ====================
    const ICONS = {
        copy: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjU1Nzc5ODc4NDY4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MTciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGZlZWRiYWNrLWljb25mb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUud29mZjI/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmMiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmY/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUudHRmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQ0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTM3NyA0MzJoMzQ5YTggOCAwIDAgMSA4IDh2NDhhOCA4IDAgMCAxLTggOEgzNzdhOCA4IDAgMCAxLTgtOHYtNDhhOCA4IDAgMCAxIDgtOHogbTAgMTYwaDI1OGE4IDggMCAwIDEgOCA4djQ4YTggOCAwIDAgMS04IDhIMzc3YTggOCAwIDAgMS04LTh2LTQ4YTggOCAwIDAgMSA4LTh6IG0tNjUtMjgwdjU3Nmg0ODBWMzEySDMxMnogbS00MC03Mmg1NjBjMTcuNjczIDAgMzIgMTQuMzI3IDMyIDMydjY1NmMwIDE3LjY3My0xNC4zMjcgMzItMzIgMzJIMjcyYy0xNy42NzMgMC0zMi0xNC4zMjctMzItMzJWMjcyYzAtMTcuNjczIDE0LjMyNy0zMiAzMi0zMnogbS04OC01NnY2NjRhOCA4IDAgMCAxLTggOGgtNTZhOCA4IDAgMCAxLTgtOFYxNDRjMC0xNy42NzMgMTQuMzI3LTMyIDMyLTMyaDYzMmE4IDggMCAwIDEgOCA4djU2YTggOCAwIDAgMS04IDhIMTg0eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMTQxOCI+PC9wYXRoPjwvc3ZnPg==',
        search: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUxNTY3NDk1OTczIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwNzciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNDQ2LjExMjMyMyAxNzcuNTQ1MDUxYzEzNy41Njc2NzcgMC4yMTk3OTggMjUyLjYxMjUyNSAxMDQuNTk3OTggMjY2LjE2MjQyNCAyNDEuNDkzMzMzIDEzLjU2MjgyOCAxMzYuODk1MzU0LTc4Ljc3ODE4MiAyNjEuODE4MTgyLTIxMy42MTc3NzcgMjg5LjAwODQ4NS0xMzQuODUyNTI1IDI3LjIwMzIzMi0yNjguMzg2MjYzLTUyLjE1Njc2OC0zMDguOTQ1NDU1LTE4My42MDg4ODlzMjUuMDE4MTgyLTI3Mi4yNTIxMjEgMTUxLjczODE4Mi0zMjUuNzc5Mzk0QTI2Ny4yMzU1NTYgMjY3LjIzNTU1NiAwIDAgMSA0NDYuMTEyMzIzIDE3Ny41NDUwNTFtMC02Mi4wNjA2MDdjLTE4Mi43OTQzNDMgMC0zMzAuOTg5ODk5IDE0OC4xOTU1NTYtMzMwLjk4OTg5OSAzMzAuOTg5ODk5czE0OC4xOTU1NTYgMzMwLjk4OTg5OSAzMzAuOTg5ODk5IDMzMC45ODk4OTkgMzMwLjk4OTg5OS0xNDguMTk1NTU2IDMzMC45ODk4OTktMzMwLjk4OTg5OS0xNDguMTk1NTU2LTMzMC45ODk4OTktMzMwLjk4OTg5OS0zMzAuOTg5ODk5eiBtNDMxLjMyMTIxMiA3OTMuMzQxNDE1YTMwLjg0OTI5MyAzMC44NDkyOTMgMCAwIDEtMjEuOTQxMDEtOS4xMDIyMjNsLTE1Ny4yMjAyMDItMTU3LjIyMDIwMmMtMTEuNzUyNzI3LTEyLjE3OTM5NC0xMS41ODQ2NDYtMzEuNTM0NTQ1IDAuMzc0OTUtNDMuNTA3MDcgMTEuOTcyNTI1LTExLjk3MjUyNSAzMS4zMjc2NzctMTIuMTQwNjA2IDQzLjQ5NDE0MS0wLjM3NDk1bDE1Ny4yMjAyMDIgMTU3LjIyMDIwMmEzMS4wMzY3NjggMzEuMDM2NzY4IDAgMCAxIDYuNzIzMjMyIDMzLjgxMDEwMSAzMS4wMDQ0NDQgMzEuMDA0NDQ0IDAgMCAxLTI4LjY1MTMxMyAxOS4xNzQxNDJ6IG0wIDAiIHAtaWQ9IjIwNzgiIGZpbGw9IiMzMzMzMzMiPjwvcGF0aD48L3N2Zz4=',
        openLink: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUxNTgwNDU1NTcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijk0MiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODMyIDEyOEg2NDB2NjRoMTQ2Ljc1Mkw1MjEuMzc2IDQ1Ny4zNzZsNDUuMjQ4IDQ1LjI0OEw4MzIgMjM3LjI0OFYzODRoNjRWMTI4eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iOTQzIj48L3BhdGg+PHBhdGggZD0iTTc2OCA4MzJIMTkyVjI1NmgzNTJ2LTY0SDE2MGEzMiAzMiAwIDAgMC0zMiAzMnY2NDBhMzIgMzIgMCAwIDAgMzIgMzJoNjQwYTMyIDMyIDAgMCAwIDMyLTMzVjQ4MGgtNjR2MzUyeiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iOTQ0Ij48L3BhdGg+PC9zdmc+',
        highlight: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTIgMjEuMzVsLTEuNDUtMS4zMkM1LjQgMTUuMzYgMiAxMi4yOCAyIDguNSAyIDUuNDIgNC40MiAzIDcuNSAzYzEuNzQgMCAzLjQxLjgxIDQuNSAyLjA5QzEzLjA5IDMuODEgMTQuNzYgMyAxNi41IDMgMTkuNTggMyAyMiA1LjQyIDIyIDguNWMwIDMuNzgtMy40IDYuODYtOC41NSAxMS41NEwxMiAyMS4zNXoiIGZpbGw9IiNlNzRjM2MiLz48L3N2Zz4=',
        settings: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTkuMTQgMTIuOTRjLjA0LS4zLjA2LS42MS4wNi0uOTQgMC0uMzItLjAyLS42NC0uMDctLjk0bDIuMDMtMS41OGMuMTgtLjE0LjIzLS40MS4xMi0uNjFsLTEuOTItMy4zMmMtLjEyLS4yMi0uMzctLjI5LS41OS0uMjJsLTIuMzkuOTZjLS41LS4zOC0xLjAzLS43LTEuNjItLjk0bC0uMzgtMi41NGMtLjAzLS4yNC0uMjQtLjQyLS40OC0uNDJoLTMuODRjLS4yNCAwLS40NS4xOC0uNDguNDJsLS4zOCAyLjU0Yy0uNTkuMjQtMS4xMy41Ny0xLjYyLjk0bC0yLjM5LS45NmMtLjIyLS4wOC0uNDcgMC0uNTkuMjJMMi43NCA4Ljg3Yy0uMTIuMjEtLjA4LjQ3LjEyLjYxbDIuMDMgMS41OGMtLjA1LjMtLjA5LjYzLS4wOS45NHMwLjAyLjY0LjA3Ljk0bC0yLjAzIDEuNThjLS4xOC4xNC0uMjMuNDEtLjEyLjYxbDEuOTIgMy4zMmMuMTIuMjIuMzcuMjkuNTkuMjJsMi4zOS0uOTZjLjUuMzggMS4wMy43IDEuNjIuOTRsLjM4IDIuNTRjLjAzLjI0LjI0LjQyLjQ4LjQyaDMuODRjLjI0IDAgLjQ1LS4xOC40OC0uNDJsLjM4LTIuNTRjLjU5LS4yNCAxLjEzLS41NiAxLjYyLS45NGwyLjM5Ljk2Yy4yMi4wOC40NyAwIC41OS0uMjJsMS45Mi0zLjMyYy4xMi0uMjIuMDctLjQ3LS4xMi0uNjFsLTIuMDEtMS41OE0xMiAxNS42Yy0xLjk4IDAtMy42LTEuNjItMy42LTMuNnMxLjYyLTMuNiAzLjYtMy42IDMuNiAxLjYyIDMuNiAzLjYtMS42MiAzLjYtMy42IDMuNnoiIGZpbGw9IiMzMzMiLz48L3N2Zz4='
    };

    // ==================== 设置面板（Shadow DOM）====================
    let settingsPanelHost, settingsPanelRoot;
    const createSettingsPanel = () => {
        if (settingsPanelHost) return;
        settingsPanelHost = document.createElement('div');
        settingsPanelHost.id = 'custom-search-settings-host';
        settingsPanelHost.style.cssText = 'all:initial;position:fixed;z-index:1000000;left:0;top:0;width:0;height:0;';
        settingsPanelRoot = settingsPanelHost.attachShadow({ mode: 'open' });

        const panelDiv = document.createElement('div');
        panelDiv.style.cssText = `
            position:fixed; background:#fff; border-radius:8px; padding:16px;
            box-shadow:0 4px 12px rgba(0,0,0,0.15); border:1px solid #e0e0e0;
            font-size:14px; color:#333; display:none; min-width:260px;
            font-family:system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        `;

        const title = document.createElement('div');
        title.style.cssText = 'font-weight:bold; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:4px;';
        title.textContent = '搜索引擎设置';
        panelDiv.appendChild(title);

        const listDiv = document.createElement('div');
        listDiv.style.cssText = 'margin-bottom:12px; display:grid; grid-template-columns:repeat(2,1fr); gap:6px 12px;';
        // 渲染引擎复选框列表（仅内置引擎，自定义引擎在下方的管理区）
        const renderEngineCheckboxes = () => {
            listDiv.innerHTML = '';
            ALL_SEARCH_ENGINES.forEach(engine => {
                const label = document.createElement('label');
                label.style.cssText = 'display:flex; align-items:center; cursor:pointer; white-space:nowrap;';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'engine-cb';
                cb.value = engine.name;
                cb.checked = enabledEngineNames.includes(engine.name);
                cb.style.cssText = 'margin-right:4px; vertical-align:middle;';
                label.append(cb, document.createTextNode(engine.name));
                listDiv.appendChild(label);
            });
        };
        renderEngineCheckboxes();
        panelDiv.appendChild(listDiv);

        const addCheckboxDiv = (text, checked) => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; align-items:center; cursor:pointer; margin-bottom:4px;';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = checked;
            cb.style.cssText = 'margin-right:4px; vertical-align:middle;';
            div.append(cb, document.createTextNode(text));
            return { div, cb };
        };

        // ---- 附加选项 ----
        const extraDiv = document.createElement('div');
        extraDiv.style.cssText = 'margin-bottom:8px; border-top:1px solid #eee; padding-top:8px;';

        const iconDiv = document.createElement('label');
        iconDiv.style.cssText = 'display:flex; align-items:center; cursor:pointer; margin-bottom:6px;';
        const iconCb = document.createElement('input');
        iconCb.type = 'checkbox';
        iconCb.checked = showEngineIcons;
        iconCb.style.cssText = 'margin-right:6px; vertical-align:middle;';
        iconDiv.append(iconCb, document.createTextNode('显示引擎图标（关闭后工具栏更短）'));

        const highlightDiv = document.createElement('label');
        highlightDiv.style.cssText = 'display:flex; align-items:center; cursor:pointer; margin-bottom:6px;';
        const hlCb = document.createElement('input');
        hlCb.type = 'checkbox';
        hlCb.checked = highlightEnabled;
        hlCb.style.cssText = 'margin-right:6px; vertical-align:middle;';
        highlightDiv.append(hlCb, document.createTextNode('启用高亮功能'));

        const orderDiv = document.createElement('label');
        orderDiv.style.cssText = 'display:flex; align-items:center; cursor:pointer; margin-bottom:6px;';
        const ordCb = document.createElement('input');
        ordCb.type = 'checkbox';
        ordCb.checked = buttonOrder === 'highlight-first';
        ordCb.style.cssText = 'margin-right:6px; vertical-align:middle;';
        orderDiv.append(ordCb, document.createTextNode('高亮按钮在前（默认复制在前）'));

        extraDiv.append(iconDiv, highlightDiv, orderDiv);
        panelDiv.appendChild(extraDiv);

        // ---- 自定义搜索引擎（带复选框 + 删除）----
        const customDiv = document.createElement('div');
        customDiv.style.cssText = 'border-top:1px solid #eee; padding-top:8px; margin-bottom:8px;';
        const customTitle = document.createElement('div');
        customTitle.style.cssText = 'font-weight:bold; margin-bottom:6px; font-size:13px;';
        customTitle.textContent = '自定义引擎';
        customDiv.appendChild(customTitle);

        const customListDiv = document.createElement('div');
        customListDiv.style.cssText = 'margin-bottom:6px; max-height:150px; overflow-y:auto;';
        const renderCustomList = () => {
            customListDiv.innerHTML = '';
            const engines = GM_getValue('custom_engines', []);
            if (!engines.length) {
                customListDiv.textContent = '(暂无自定义引擎)';
                Object.assign(customListDiv.style, { color:'#999', fontSize:'12px', marginBottom:'6px', maxHeight:'150px', overflowY:'auto' });
                return;
            }
            engines.forEach((e, i) => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex; align-items:center; margin-bottom:3px; font-size:12px;';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'engine-cb';
                cb.value = e.name;
                cb.checked = enabledEngineNames.includes(e.name);
                cb.style.cssText = 'margin-right:4px; vertical-align:middle;';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = `${e.icon || '🔍'} ${e.name}`;
                nameSpan.style.cssText = 'flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
                const delBtn = document.createElement('button');
                delBtn.textContent = '✕';
                delBtn.title = '删除此引擎';
                delBtn.style.cssText = 'background:none; border:none; cursor:pointer; color:#c00; font-size:13px; padding:0 4px; margin-left:auto;';
                delBtn.addEventListener('click', () => {
                    const list = GM_getValue('custom_engines', []);
                    list.splice(i, 1);
                    GM_setValue('custom_engines', list);
                    customEngines = list;
                    // 同时从已启用列表中移除
                    const idx = enabledEngineNames.indexOf(e.name);
                    if (idx >= 0) { enabledEngineNames.splice(idx, 1); saveSearchEngineConfig(enabledEngineNames); }
                    renderCustomList();
                });
                row.append(cb, nameSpan, delBtn);
                customListDiv.appendChild(row);
            });
        };
        renderCustomList();
        customDiv.appendChild(customListDiv);

        // 添加自定义引擎表单
        const addFormDiv = document.createElement('div');
        addFormDiv.style.cssText = 'display:flex; flex-direction:column; gap:4px; font-size:12px;';

        const nameInput = document.createElement('input');
        nameInput.placeholder = '引擎名称（如：Google）';
        nameInput.style.cssText = 'padding:4px 6px; border:1px solid #ccc; border-radius:3px; font-size:12px;';

        const urlInput = document.createElement('input');
        urlInput.placeholder = '搜索URL（用 %s 代替关键词，例如：https://www.google.com/search?q=%s）';
        urlInput.style.cssText = 'padding:4px 6px; border:1px solid #ccc; border-radius:3px; font-size:12px;';

        const iconInput = document.createElement('input');
        iconInput.placeholder = '图标URL（可选，默认 🔍）';
        iconInput.style.cssText = 'padding:4px 6px; border:1px solid #ccc; border-radius:3px; font-size:12px;';

        const addBtn = document.createElement('button');
        addBtn.textContent = '添加引擎';
        addBtn.style.cssText = 'background:#008373; color:#fff; border:none; border-radius:3px; padding:4px 8px; cursor:pointer; font-size:12px; align-self:flex-end;';
        addBtn.addEventListener('click', () => {
            const n = nameInput.value.trim();
            const u = urlInput.value.trim();
            if (!n || !u) return;
            const list = GM_getValue('custom_engines', []);
            list.push({ name: n, url: u, icon: iconInput.value.trim() || '🔍' });
            GM_setValue('custom_engines', list);
            customEngines = list;
            nameInput.value = ''; urlInput.value = ''; iconInput.value = '';
            renderCustomList();
            // V2.5.2: 移除 renderEngineCheckboxes() 调用，避免重置内置引擎复选框状态
            // 默认勾选新引擎
            if (!enabledEngineNames.includes(n)) {
                enabledEngineNames.push(n);
                saveSearchEngineConfig(enabledEngineNames);
            }
        });

        addFormDiv.append(nameInput, urlInput, iconInput, addBtn);
        customDiv.appendChild(addFormDiv);
        panelDiv.appendChild(customDiv);

        // ---- 保存/取消按钮 ----
        const btnDiv = document.createElement('div');
        btnDiv.style.cssText = 'display:flex; justify-content:flex-end; gap:8px;';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = 'background:#008373; color:#fff; border:none; border-radius:4px; padding:6px 12px; cursor:pointer; font-size:13px;';
        saveBtn.addEventListener('click', () => {
            const checkboxes = panelDiv.querySelectorAll('.engine-cb');
            enabledEngineNames = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);
            saveSearchEngineConfig(enabledEngineNames);
            showEngineIcons = iconCb.checked;
            saveShowEngineIcons(showEngineIcons);
            highlightEnabled = hlCb.checked;
            saveHighlightEnabled(highlightEnabled);
            buttonOrder = ordCb.checked ? 'highlight-first' : 'copy-first';
            saveButtonOrderConfig(buttonOrder);
            panelDiv.style.display = 'none';
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'background:#f0f0f0; color:#333; border:1px solid #ccc; border-radius:4px; padding:6px 12px; cursor:pointer; font-size:13px;';
        cancelBtn.addEventListener('click', () => panelDiv.style.display = 'none');

        btnDiv.append(saveBtn, cancelBtn);
        panelDiv.appendChild(btnDiv);
        settingsPanelRoot.appendChild(panelDiv);
        document.body.appendChild(settingsPanelHost);
    };

    const showSettingsPanel = () => {
        createSettingsPanel();
        if (!toolbar) return;
        const panelDiv = settingsPanelRoot.querySelector('div');
        if (!panelDiv) return;

        panelDiv.querySelectorAll('input.engine-cb').forEach(cb => {
            cb.checked = enabledEngineNames.includes(cb.value);
        });

        const rect = toolbar.getBoundingClientRect();
        let left = rect.left, top = rect.bottom + 5;
        const panelWidth = 280;
        if (left + panelWidth > innerWidth) left = innerWidth - panelWidth - 5;
        if (top + 200 > innerHeight) top = rect.top - 205;
        left = Math.max(5, left);
        top = Math.max(5, top);
        panelDiv.style.cssText += `;left:${left}px;top:${top}px;display:block;`;
    };

    // ==================== 工具栏样式与变量 ====================
    const TOOLBAR_STYLE = `position:fixed; z-index:999999; background:#fff; border-radius:8px; padding:2px 4px; box-shadow:0 2px 6px rgba(0,0,0,0.1); display:flex; gap:2px; font-size:12px; color:#333; pointer-events:auto; border:1px solid #e0e0e0; align-items:center; line-height:1.2; flex-wrap:nowrap; white-space:nowrap;`;
    const BUTTON_STYLE = `background:transparent; border:none; color:#333; cursor:pointer; padding:4px 4px; border-radius:6px; font-size:12px; display:flex; align-items:center; gap:3px; transition:background 0.1s, color 0.1s; white-space:nowrap;`;
    const ICON_STYLE = `width:13px; height:13px; display:inline-block; vertical-align:middle; transition:filter 0.1s;`;
    const SEPARATOR_STYLE = `width:1px; height:18px; background:#ddd; margin:0 2px;`;
    const GREEN_FILTER = 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)';

    let toolbar, hideTimeout;

    const initToolbar = () => {
        toolbar = document.createElement('div');
        toolbar.id = 'custom-search-toolbar';
        toolbar.style.cssText = TOOLBAR_STYLE;
        toolbar.addEventListener('mousedown', e => e.preventDefault());
        toolbar.addEventListener('mouseup', e => e.stopPropagation());
        toolbar.addEventListener('click', e => e.target.closest('button')?._handler?.());
        toolbar.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        toolbar.addEventListener('mouseleave', () => CONFIG.TOOLBAR_HIDE_MODE === 'auto' && scheduleHide());
        document.body.appendChild(toolbar);
    };

    const buildToolbar = text => {
        if (!toolbar) initToolbar();
        toolbar.innerHTML = '';
        const frag = document.createDocumentFragment();
        const btns = [];

        const isDomain = UrlUtils.isDomain(text);
        if (isDomain) btns.push({ icon: ICONS.openLink, text: '打开', handler: () => { open(UrlUtils.makeUrl(text)); getSelection().empty(); hideToolbar(); } });

        const copyBtn = { icon: ICONS.copy, text: '复制', handler: () => { copyText(text); getSelection().empty(); hideToolbar(); } };
        if (highlightEnabled) {
            const highlightBtn = { icon: ICONS.highlight, text: '高亮', handler: () => { const kw = getSelection().toString().trim(); if (kw) addDynamicHighlight(kw); hideToolbar(); } };
            buttonOrder === 'highlight-first' ? btns.push(highlightBtn, copyBtn) : btns.push(copyBtn, highlightBtn);
        } else {
            btns.push(copyBtn);
        }

        getEnabledEngines().forEach(e => {
            const icon = (!e.icon || e.icon === '🔍') ? ICONS.search : e.icon;
            btns.push({
                icon,
                text: e.name,
                keepIconColor: icon !== ICONS.search,
                handler: () => { open(e.url.replace(/%s|\{keyword\}|\{searchTerms\}|\$\{searchTerms\}|\{query\}|%KEYWORD%/i, encodeURIComponent(text))); getSelection().empty(); hideToolbar(); }
            });
        });
        btns.push({ icon: ICONS.settings, text: '', title: '设置', alwaysShowIcon: true, handler: showSettingsPanel });

        btns.forEach((btn, i) => {
            if (i > 0) {
                const sep = document.createElement('span');
                sep.style.cssText = SEPARATOR_STYLE;
                frag.appendChild(sep);
            }
            const el = document.createElement('button');
            el.style.cssText = BUTTON_STYLE;
            if (btn.title) el.title = btn.title;
            // V2.5.0: 图标显示开关——设置齿轮始终显示图标，其他按钮按 showEngineIcons 控制
            if (btn.alwaysShowIcon || showEngineIcons) {
                el.innerHTML = `<img src="${btn.icon}" style="${ICON_STYLE}" alt=""><span>${btn.text}</span>`;
            } else {
                el.innerHTML = `<span>${btn.text}</span>`;
            }
            el._handler = btn.handler;
            el.addEventListener('mouseenter', e => {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.color = '#5FE382';
                const img = e.currentTarget.querySelector('img');
                if (img && !btn.keepIconColor) img.style.filter = GREEN_FILTER;
            });
            el.addEventListener('mouseleave', e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; const img = e.currentTarget.querySelector('img'); if (img) img.style.filter = 'none'; });
            frag.appendChild(el);
        });
        toolbar.appendChild(frag);
    };

    // ==================== 复制 ====================
    const copyText = text => {
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
        else fallbackCopy(text);
    };
    const fallbackCopy = text => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    };

    // ==================== 显示/隐藏工具栏 ====================
    const showToolbar = (x, y, text) => {
        if (hideTimeout) clearTimeout(hideTimeout);
        requestAnimationFrame(() => {
            buildToolbar(text);
            toolbar.style.display = 'flex';
            toolbar.offsetHeight;
            const toolW = toolbar.offsetWidth, toolH = toolbar.offsetHeight;
            let left = x + 6, top = y + 10;
            const firstBtn = toolbar.querySelector('button');
            if (firstBtn) {
                left += firstBtn.offsetWidth * -CONFIG.OFFSET_LEFT_ICON_COUNT;
                top += firstBtn.offsetHeight * CONFIG.OFFSET_DOWN_ICON_COUNT;
            }
            if (left + toolW > innerWidth) left = innerWidth - toolW - 6;
            if (top + toolH > innerHeight) top = y - toolH - 6;
            left = Math.max(2, left);
            top = Math.max(2, top);
            toolbar.style.left = left + 'px';
            toolbar.style.top = top + 'px';
        });
    };
    const hideToolbar = () => { if (toolbar) toolbar.style.display = 'none'; };
    const scheduleHide = () => {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(hideToolbar, CONFIG.HIDE_DELAY);
    };

    // ==================== URL工具 ====================
    const UrlUtils = {
        isDomain: t => t && !t.includes(' ') && (/^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(t) || (/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(t) && t.includes('.') && t.split('.').pop().length >= 2)),
        makeUrl: d => d.startsWith('http') ? d : 'https://' + d,
        isInsideEditable: el => el?.closest('input, textarea, [contenteditable="true"], [contenteditable=""]') !== null
    };

    // ==================== 事件监听 ====================
    const initEventListeners = () => {
        addEventListener('mouseup', onMouseUp);
        addEventListener('mousedown', onDocumentMouseDown, { passive: true });
        addEventListener('scroll', hideToolbar, { passive: true });
        addEventListener('selectionchange', onSelectionChange);
    };

    const onMouseUp = e => {
        const text = getSelection().toString().trim();
        if (!text) { hideToolbar(); return; }
        if (toolbar?.contains(e.target) || UrlUtils.isInsideEditable(e.target)) { hideToolbar(); return; }
        showToolbar(e.clientX, e.clientY, text);
    };
    const onDocumentMouseDown = e => { if (toolbar && !toolbar.contains(e.target)) hideToolbar(); };
    const onSelectionChange = () => {
        if (!getSelection().toString().trim()) setTimeout(() => { if (!getSelection().toString().trim()) hideToolbar(); }, 100);
    };

    // ==================== 启动 ====================
    initEventListeners();
})();
