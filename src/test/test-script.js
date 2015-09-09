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
        .withUuid('github.com/bbottema/js-epub-maker::example-using-idpf-wasteland')
        .withTemplate('idpf-wasteland')
        .withAuthor('T. Est')
        .withLanguage('en-GB')
        .withModificationDate(new Date(2015, 8, 7))
        .withRights({
        	description: 'This work is shared with the public using the Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) license.',
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/'
        })
        .withAttributionUrl('https://github.com/bbottema/js-epub-maker')
        .withCover()
        .withCoverRights({
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        	attributionUrl: 'http://en.wikipedia.org/wiki/Simon_Fieldhouse'
        })
        .withTitle('Example Using Wasteland Template')
        .withSection(new EpubMaker.Section('frontmatter', 'frontmatter', null, false, true)
            .withSubSection(new EpubMaker.Section('titlepage', 'manuscript-header', header, false, false))
        )
        .withSection(new EpubMaker.Section('bodymatter', 'bodymatter', null, false, true)
            .withSubSection(new EpubMaker.Section(null, 'preface', preface, false, true))
            .withSubSection(new EpubMaker.Section(null, 'part-1', null, false, true)
                .withSubSection(new EpubMaker.Section(null, 'chapter-1', ch1, false, true))
                .withSubSection(new EpubMaker.Section(null, 'chapter-2', ch2, true))
            )
            .withSubSection(new EpubMaker.Section('part-2', null, false, true)
                .withSubSection(new EpubMaker.Section(null, 'chapter-3', ch3, false, true))
                .withSubSection(new EpubMaker.Section(null, 'chapter-4', ch4, false, true))
            )
        )
        .withSection(new EpubMaker.Section('backmatter', 'backmatter', null, false, true)
            .withSubSection(new EpubMaker.Section(null, 'rear-notes', notes, true, false))
        )
        .downloadEpub();
}