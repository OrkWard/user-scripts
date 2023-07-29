// ==UserScript==
// @name         Mother Fucker Telegram Group Spammer
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  屏蔽 Telegram 群组成员，在下方 * 号处填入昵称然后保存即可。
// @author       OrkWard(forked from 莲华)
// @match        *://web.telegram.org/*
// @homepage        https://t.me/OrkWard
// @namespace        https://gist.github.com/isssuer
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*jshint esversion: 8 */

(function () {
  "use strict";
  //***********************************************************
  //**********Fill nick names in the brackets above***********
  //const SPAMMERS = ["Troll", "Phisher", "Bullshit", "Asshole "]

  const messageClass = "Message";
  const grouped = "im_grouped";
  const shortGrouped = "im_grouped_short";
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(Mute);
      }
    });
  });

  document.querySelectorAll('.Message').forEach(Mute);

  function Mute(node) {
    if (node.classList?.contains(messageClass)) {
      let name, isSpammer;
      try {
        name = node.querySelector(".Avatar img")?.alt || node.querySelector(".message-title-name").innerHTML;
      } catch (e) {
      console.log(e)
      }
      if (name && SPAMMERS.indexOf(name) > -1) {
        console.log("Caught a fool！");
        node.style.display = "none";
        let previousNode = node.previousSibling;
        while (
          previousNode &&
          previousNode.querySelector(".Avatar")
        ) {
          previousNode.style.display = "none";
          previousNode = previousNode.previousSibling;
        }
      }
    }
  }

  observer.observe(document.body, { childList: true, subtree: true });
})();
