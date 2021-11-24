// CSS Lyrics Text Portrait by Jed556
'use strict';

var apiUrl = 'https://api.lyrics.ovh';
// var apiUrl = 'http://localhost:8080';
var searchInput = $('#search-input');
var imageInput = $('#image-input');
var lyricsDiv = $('#lyrics');
var results = $('#results');
var timeoutSuggest;

lyricsDiv.hide();
results.hide();

// If there is input in "#search-input"
searchInput.on('input', function() {
    results.slideUp();
    if (timeoutSuggest) {
        clearTimeout(timeoutSuggest);
    }
    timeoutSuggest = setTimeout(suggestions, 300);
});

function removeResults() {
    $('.result').remove();
}

// Display suggestions
function suggestions() {
    var term = searchInput.val();
    if (!term) {
        removeResults();
        return;
    }
    console.log("Search suggestions for", term);
    $.getJSON(apiUrl + '/suggest/' + term, function(data) {
        removeResults();
        var finalResults = [];
        var seenResults = [];
        data.data.forEach(function(result) {
            if (seenResults.length >= 5) {
                return;
            }
            var t = result.title + ' - ' + result.artist.name;
            if (seenResults.indexOf(t) >= 0) {
                return;
            }
            seenResults.push(t);
            finalResults.push({
                display: t,
                artist: result.artist.name,
                title: result.title
            });
        });

        var l = finalResults.length;
        finalResults.forEach(function(result, i) {
            var c = 'result';
            if (i == l - 1) {
                c += ' result-last';
            }
            var e = $('<li class="' + c + '">' + result.display + '</li>');
            results.append(e);
            results.slideDown();

            // Display Lyrics on click
            e.click(function() {
                results.slideUp();
                songLyrics(result);
            });
        });
    });
}

// Display Lyrics
function songLyrics(song) {
    console.log("Search lyrics for", song);
    removeResults();
    lyricsDiv.slideUp();
    $.getJSON(apiUrl + '/v1/' + song.artist + '/' + song.title, function(data) {
        var html = '<h3 class="lyrics-title">' + song.display + '</h3>';
        html += '<div class="copy-lyrics" id="copy-lyrics" data-clipboard-target="#thelyrics">Copy lyrics <span id="copy-ok"></span></div>';
        html += '<div id="thelyrics" src="">' + data.lyrics.replace(/\n/g, ' ').repeat(100) + '</div>';
        lyricsDiv.html(html);
        setBG(imageInput.val()) // Change BG Image
        lyricsDiv.slideDown();
        var copyl = new Clipboard('#copy-lyrics');
        copyl.on('success', function(e) {
            e.clearSelection();
            $('#copy-ok').text(' : Done');
        });
    });
}

// Change BG Image if there is input
function setBG(image) {
    if (image) {
        document.getElementById("thelyrics").style.backgroundImage = ("url(" + image + ")")
    }
}