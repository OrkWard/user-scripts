// ==UserScript==
// @name         mark issues as read
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mark issues as read
// @author       OrkWard
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at document-idle
// ==/UserScript==

(() => {
  let oldPushState = history.pushState;
  history.pushState = function pushState() {
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };

  let oldReplaceState = history.replaceState;
  history.replaceState = function replaceState() {
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });
})();

(function() {
  'use strict';

  // clear & reset
  try {
    if (localStorage.visitedList === undefined || typeof JSON.parse(localStorage.visitedList) !== 'object') {
      localStorage.setItem('visitedList', JSON.stringify({}));
    }
    if (Object.keys(localStorage.visitedList).length > 50000) {
      localStorage.setItem('visitedList', JSON.stringify({}));
    }
  } catch(err) {
    localStorage.setItem('visitedList', JSON.stringify({}));
  }

  // issues content page
  function addItem () {
    if (document.location.pathname.match(/issues\/\d.*/)) {
      console.log('add item');
      const visitedList = JSON.parse(localStorage.visitedList);
      const path = document.location.pathname;
      const key = path.slice(0, path.indexOf('issues'));
      visitedList[key] = visitedList[key] ?? [];
      visitedList[key].push('issue_' + path.slice(path.indexOf('issues') + 7));
      localStorage.setItem('visitedList', JSON.stringify(visitedList));
    }

  }


  // turn the visited post to gray
  function weakenVisited() {
    console.log('weaken');
    const visitedList = JSON.parse(localStorage.visitedList);
    const path = document.location.pathname;
    const key = path.slice(0, path.indexOf('issues'));
    const thisRepoVisited = visitedList[key];
    if (thisRepoVisited) {
      thisRepoVisited.forEach((issues) => {
        console.log(`#${issues}`);
        $('#' + issues + ' a').attr('style', 'color: #CCCCCC !important');
      });
    }
  }

  addItem();
  weakenVisited();

  // github use client-side router
  addEventListener('storage', (event) => {
    weakenVisited();
  })
  addEventListener('locationchange', (event) => {
    setTimeout(() => {
      console.log('locationchange');
      weakenVisited();
      addItem();
    }, 500);
  });
})();
