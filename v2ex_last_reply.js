// ==UserScript==
// @name         v2ex last reply
// @namespace    http://random.com
// @version      0.1
// @description  read from last access reply, no scroll anymore!
// @author       xiandao7997
// @include        http*://v2ex.com/t/*
// @require      http://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        GM_getValue
// ==/UserScript==
/* jshint -W097 */

$(function() {

    var URL = window.location.href;
    var REPLY_TOTAL_PREFIX = 'V2EX_totalcount_';
    var LAST_REPLY_ID = 'V2EX_lastreplyid_';

    function getPostId() {
        var flag = '/t/';
        var startIndex = URL.indexOf(flag) + flag.length;
        var endIndex = URL.indexOf('#') >= 0 ? URL.indexOf('#') : URL.length;
        var postId = URL.substring(startIndex, endIndex);
        
        return postId;
    }

    function getReplyTotalFromLS(postId) {
        return localStorage[REPLY_TOTAL_PREFIX + postId];
    }
    function setReplyTotalToLS(postId, count) {
        localStorage.setItem(REPLY_TOTAL_PREFIX + postId, count);
    }

    function setLastReplyIdToLS(postId, value) {
        
        localStorage.setItem(LAST_REPLY_ID + postId, value);
    }

    function getLastReplyIdFromLS(postId) {
        console.log('last reply id: ' + localStorage[LAST_REPLY_ID + postId]);
        return localStorage[LAST_REPLY_ID + postId];
    }

    function jumpToNextPage(iLastTimeTotal, currentReplyCount, pureUrl, postId) {
        if (iLastTimeTotal === currentReplyCount) {
            // no new reply added
            window.location.href = pureUrl + '#' + getLastReplyIdFromLS(postId);
        } else {
            var newPageNo = iLastTimeTotal/100 + 1;
            var newUrl = pureUrl + '?p=' + newPageNo;
            window.location.href = newUrl;
        }
    }

    var postId = getPostId();
    var lastTimeTotalCount = getReplyTotalFromLS(postId);
    var strCurrentReplyCount = $('div.cell > span.gray').html();
    
    var currentReplyCount = 0;
    if (strCurrentReplyCount !== undefined) {
        currentReplyCount = parseInt(strCurrentReplyCount.substring(0, strCurrentReplyCount.indexOf(' ')), 10);
    }
    
    var iLastTimeTotal = parseInt(lastTimeTotalCount, 10);
    
    if (iLastTimeTotal === undefined || iLastTimeTotal === null || isNaN(iLastTimeTotal)) {
        
    } else {
        var pureUrl = URL;
        var anchorIndex = URL.indexOf('#');
        if (anchorIndex !== -1 ) {
            pureUrl = URL.substring(0, anchorIndex);
        }

        if (iLastTimeTotal === 0) {
            
        } else if (iLastTimeTotal % 100 === 0) {
            jumpToNextPage(iLastTimeTotal, currentReplyCount, pureUrl, postId);
        } else {
            window.location.href = pureUrl + '#' + getLastReplyIdFromLS(postId);
        }
    }

    setReplyTotalToLS(postId, currentReplyCount);
        
    var lastestReplyId = $('div#Main > div.box > div[id]:last').attr('id');
    setLastReplyIdToLS(postId, lastestReplyId); 
});