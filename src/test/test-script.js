/* global EpubMaker */
'use strict';

window.runTest = function() {
    function f(title) {
        return function(value) { return { title: title, content: value }; }; 
    }
    $.when(
        $.get('src/test/content-for-epub/header.html', null, null, 'text').then(f()),
        $.get('src/test/content-for-epub/preface.html', null, null, 'text').then(f('Preface')),
        $.get('src/test/content-for-epub/chapter1.html', null, null, 'text').then(f('It came from the desert')),
        $.get('src/test/content-for-epub/chapter2.html', null, null, 'text').then(f('No, it came from the Blue Lagoon')),
        $.get('src/test/content-for-epub/chapter3.html', null, null, 'text').then(f('Actually, it came from above')),
        $.get('src/test/content-for-epub/chapter4.html', null, null, 'text').then(f('It went back')),
        $.get('src/test/content-for-epub/rearnote-1.html', null, null, 'text').then(f('Note 1')),
        $.get('src/test/content-for-epub/rearnote-2.html', null, null, 'text').then(f('Note 2'))
    ).then(createTestEpub);
};
    
function createTestEpub(header, preface, ch1, ch2, ch3, ch4, rn1, rn2) {
    new EpubMaker()
        .withUuid('github.com/bbottema/js-epub-maker::it-came-from::example-using-idpf-wasteland')
        .withTemplate('idpf-wasteland')
        .withAuthor('T. Est')
        .withLanguage('en-GB')
        .withModificationDate(new Date(2015, 8, 7))
        .withRights({
        	description: 'This work is shared with the public using the Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) license.',
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/'
        })
        .withAttributionUrl('https://github.com/bbottema/js-epub-maker')
        .withStylesheetUrl('src/test/content-for-epub/extra_styles.css')
        .withCover('src/test/content-for-epub/js-epub-maker-cover.jpg', {
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        	attributionUrl: 'http://www.webestools.com/web20-title-generator-logo-title-maker-online-web20-effect-reflect-free-photoshop.html'
        })
        .withTitle('It Came From... [Example Using Waste Land Template]')
        .withSection(new EpubMaker.Section('frontmatter', 'frontmatter', { title: 'Title page' }, false, true)
            .withSubSection(new EpubMaker.Section('titlepage', 'manuscript-header', header, false, false))
        )
        .withSection(new EpubMaker.Section('bodymatter', 'bodymatter', { title: 'Start of the story' }, false, true)
            .withSubSection(new EpubMaker.Section('preface', 'preface', preface, true, false))
            .withSubSection(new EpubMaker.Section('part', 'part-1', { title: 'Part 1' }, true, false)
                .withSubSection(new EpubMaker.Section('chapter', 'chapter-1', ch1, true, false))
                .withSubSection(new EpubMaker.Section('chapter', 'chapter-2', ch2, true, false))
            )
            .withSubSection(new EpubMaker.Section('part', 'part-2', { title: 'Part 2' }, true, false)
                .withSubSection(new EpubMaker.Section('chapter', 'chapter-3', ch3, true, false))
                .withSubSection(new EpubMaker.Section('chapter', 'chapter-4', ch4, true, false))
            )
        )
        .withSection(new EpubMaker.Section('backmatter', 'backmatter', { title: 'Notes and rest' }, false, true)
            .withSubSection(new EpubMaker.Section('rearnotes', 'rear-notes', { title: 'Notes on "It Came From"' }, true, false)
                .withSubSection(new EpubMaker.Section('rearnote', 'rearnote-1', rn1, false, false))
                .withSubSection(new EpubMaker.Section('rearnote', 'rearnote-2', rn2, false, false))
            )
        )
        .downloadEpub();
}
