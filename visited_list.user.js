// ==UserScript==
// @name         绯月主题帖浏览记录
// @description  标记已经浏览过的主题帖，快速屏蔽
// @version      0.1.4
// @homepage     https://github.com/OrkWard/kf_read_list
// @author       OrkWard
// @match        https://*kforz.com/*
// @match        https://*kfmax.com/*
// @match        https://*9shenmi.com/*
// @match        http*://*kfgal.com/*
// @match        https://*kfmax.com/*
// @match        https://*.miaola.work/*
// @updateURL    https://github.com/OrkWard/kf_read_list/raw/main/visited_list.user.js
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
'use strict';

if (localStorage.visitedList === undefined || Array.isArray(JSON.parse(localStorage.visitedList)))
    localStorage.setItem('visitedList', JSON.stringify({}));
if (Object.keys(localStorage.visitedList).length > 50000)
    localStorage.setItem('visitedList', JSON.stringify({}));
const gray = '#CCCCCC';

// check title and reply number to update storage
if (location.pathname.includes('read')) {
    let postname = '《' + $('tr>td>span').first().text() + '》';
    let visitedList = JSON.parse(localStorage.visitedList);
    let reply = Number($('tr>td').eq(1).text().match(/回复数：[0-9]*/g)[0].substr(4));
    if (!visitedList[postname] || visitedList[postname] < reply)
        visitedList[postname] = reply;
    localStorage.setItem('visitedList', JSON.stringify(visitedList));
}

addEventListener('storage', (event) => {
    weakenVisited();
})

// turn the visited post to gray
function weakenVisited() {
    let postList = $('.dcol>.indexlbtc>a, .dcol>.rightboxa>a');
    postList.each((post) => {
        post = $(postList[post])
        let visitedList = JSON.parse(localStorage.visitedList);
        let postname = post.attr('title');
        if (visitedList[postname] !== undefined)
            post.css('color', gray);
    })
}

weakenVisited();
