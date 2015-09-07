/* global EpubMaker */
'use strict';

window.runTest = function() {
    var f = function(value) { return value; };
    $.when(
        $.get('src/test/content-for-epub/header.html', null, null, 'text').then(f),
        $.get('src/test/content-for-epub/preface.html', null, null, 'text').then(f),
        $.get('src/test/content-for-epub/chapter1.html', null, null, 'text').then(f),
        $.get('src/test/content-for-epub/chapter1.html', null, null, 'text').then(f),
        $.get('src/test/content-for-epub/chapter1.html', null, null, 'text').then(f),
        $.get('src/test/content-for-epub/chapter1.html', null, null, 'text').then(f),
        $.get('src/test/content-for-epub/rear-notes.html', null, null, 'text').then(f)
    ).then(createTestEpub);
};
    
function createTestEpub(header, preface, ch1, ch2, ch3, ch4, notes) {
    // FIXME add way to include custom jpg for cover
    new EpubMaker()
        .withTemplate('idpf-wasteland')
        .withAuthor('T. Est')
        .withLanguage('en-GB')
        .withModificationDate(new Date(2015, 8, 7))
        .withRights({
        	description: 'This work is shared with the public using the Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) license.',
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/'
        })
        .withCoverRights({
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        	attributionUrl: 'http://en.wikipedia.org/wiki/Simon_Fieldhouse'
        })
        .withAttributionUrl('https://github.com/bbottema/js-epub-maker')
        .withCover()
        .withTitle('Example Using Wasteland Template')
        .withFrontmatter(new EpubMaker.Matter()
            .withSection(new EpubMaker.Section('manuscript-header', header, false))
        )
        .withBodymatter(new EpubMaker.Matter()
            .withSection(new EpubMaker.Section('preface', preface, true))
            .withSection(new EpubMaker.Section('part-1', null, true)
                .withSubSection(new EpubMaker.Section('chapter-1', ch1, true))
                .withSubSection(new EpubMaker.Section('chapter-2', ch2, true))
            )
            .withSection(new EpubMaker.Section('part-2', null, true)
                .withSubSection(new EpubMaker.Section('chapter-3', ch3, true))
                .withSubSection(new EpubMaker.Section('chapter-4', ch4, true))
            )
        )
        .withBackmatter(new EpubMaker.Matter()
            .withSection(new EpubMaker.Section('rear-notes', notes, true))
        )
        .downloadEpub();
}