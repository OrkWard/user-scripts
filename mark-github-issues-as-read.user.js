// ==UserScript==
// @name         mark issues as read
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mark issues as read
// @author       OrkWard
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        https://github.com/*/*/issues*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';


  if (localStorage.visitedList === undefined || Array.isArray(JSON.parse(localStorage.visitedList))) {
    localStorage.setItem('visitedList', JSON.stringify({}));
  }
  if (Object.keys(localStorage.visitedList).length > 50000) {
    localStorage.setItem('visitedList', JSON.stringify({}));
  }

  // issues content page
  if (document.location.pathname.match(/issues\/\d.*/)) {
    const visitedList = JSON.parse(localStorage.visitedList);
    const path = document.location.pathname;
    const key = path.slice(0, path.indexOf('issues'));
    visitedList[key] = visitedList[key] ?? [];
    visitedList[key].push('issue_' + path.slice(path.indexOf('issues') + 7));
    localStorage.setItem('visitedList', JSON.stringify(visitedList));
  }

  addEventListener('storage', (event) => {
    weakenVisited();
  })

  // turn the visited post to gray
  function weakenVisited() {
    const visitedList = JSON.parse(localStorage.visitedList);
    const path = document.location.pathname;
    const key = path.slice(0, path.indexOf('issues'));
    const thisRepoVisited = visitedList[key];
    if (thisRepoVisited) {
      thisRepoVisited.forEach((issues) => {
        console.log('#' + issues + ' a');
        $('#' + issues + ' a').attr('style', 'color: #CCCCCC !important');
      });
    }
  }

  weakenVisited();
})();
