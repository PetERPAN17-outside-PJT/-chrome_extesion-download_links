// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

var checkAndChangeFilename = function (filename) {
    var pattern = /[\{\}\/?,;:|*~`!^\+<>@\#$%&\\\=\'\"]/gi;
    console.log(pattern.test(filename));
    if (pattern.test(filename)) {
        // '-', '_', '(', ')', '[', ']', '.'
        filename = filename.replace(/[`~!@#$%^&*|\\\'\";:\/?]/gi, "-");
    }
    return filename;
}

var datalist = [].slice.apply(document.getElementsByTagName('a'));
datalist = datalist.map(function (element) {
    // console.log(element);
    // Return an anchor's href attribute, stripping any URL fragment (hash '#').
    // If the html specifies a relative path, chrome converts it to an absolute
    // URL.
    var href = element.href;
    var filename = element.dataset.filename;
    var datalist = null;
    var hashIndex = href.indexOf('#');
    if (hashIndex >= 0) {
        href = href.substr(0, hashIndex);
        filename = filename.substr(0, hashIndex);
    }
    datalist = {
        href: href,
        filename: checkAndChangeFilename(filename)
    };
    console.log(datalist);
    return datalist;
});

// datalist.sort();

// // Remove duplicates and invalid URLs.
// var kBadPrefix = 'javascript';
// for (var i = 0; i < datalist.length;) {
//     if (((i > 0) && (datalist[i]['href'] == datalist[i - 1]['href'])) ||
//         (datalist[i]['href'] == '') ||
//         (kBadPrefix == datalist[i]['href'].toLowerCase().substr(0, kBadPrefix.length))) {
//             datalist.splice(i, 1);
//     } else {
//         ++i;
//     }
// }

chrome.extension.sendRequest(datalist);
