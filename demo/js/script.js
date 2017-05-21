/* global EpubMaker */
'use strict';

function downloadTestEpub(event){
    event.preventDefault();
    var epubMaker = createTestEpub(
        { content: document.getElementById('header-template').innerHTML },
        { content: document.getElementById('preface-template').innerHTML, title: 'Preface' },
        { content: document.getElementById('chapter1-template').innerHTML, title: 'It came from the desert' },
        { content: document.getElementById('chapter2-template').innerHTML, title: 'No, it came from the Blue Lagoon' },
        { content: document.getElementById('chapter3-template').innerHTML, title: 'Actually, it came from above' },
        { content: document.getElementById('chapter4-template').innerHTML, title: 'It went back' },
        { content: document.getElementById('rearnotes1-template').innerHTML, title: 'Note 1' },
        { content: document.getElementById('rearnotes2-template').innerHTML, title: 'Note 2' }
    );
    epubMaker.downloadEpub(function(epubZipContent, filename){
        epubMakerBtn.href = URL.createObjectURL(epubZipContent);
        epubMakerBtn.download = filename;
        epubMakerBtn.removeEventListener('click', downloadTestEpub);
    });
}

function createTestEpub(header, preface, ch1, ch2, ch3, ch4, rn1, rn2) {
    return new EpubMaker()
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
        .withCover('https://rawgit.com/bbottema/js-epub-maker/master/src/test/content-for-epub/js-epub-maker-cover.jpg', {
        	license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        	attributionUrl: 'http://www.webestools.com/web20-title-generator-logo-title-maker-online-web20-effect-reflect-free-photoshop.html'
        })
        .withTitle('It Came From... [Example Using Waste Land Template]')
        .withSection(new EpubMaker.Section('frontmatter', 'frontmatter', { title: 'Title page' }, false, true)
            .withSubSection(new EpubMaker.Section('titlepage', 'manuscript-header', header, false, false))
        )
        .withSection(new EpubMaker.Section('bodymatter', 'bodymatter', { title: 'Start of the story' }, false, true)
            .withSubSection(new EpubMaker.Section(null, 'preface', preface, true, false))
            .withSubSection(new EpubMaker.Section(null, 'part-1', { title: 'Part 1' }, true, false)
                .withSubSection(new EpubMaker.Section(null, 'chapter-1', ch1, true, false))
                .withSubSection(new EpubMaker.Section(null, 'chapter-2', ch2, true, false))
            )
            .withSubSection(new EpubMaker.Section(null, 'part-2', { title: 'Part 2' }, true, false)
                .withSubSection(new EpubMaker.Section(null, 'chapter-3', ch3, true, false))
                .withSubSection(new EpubMaker.Section(null, 'chapter-4', ch4, true, false))
            )
        )
        .withSection(new EpubMaker.Section('backmatter', 'backmatter', { title: 'Notes and rest' }, false, true)
            .withSubSection(new EpubMaker.Section('rearnotes', 'rear-notes', { title: 'Notes on "It Came From"' }, true, false)
                .withSubSection(new EpubMaker.Section('rearnote', 'rearnote-1', rn1, false, false))
                .withSubSection(new EpubMaker.Section('rearnote', 'rearnote-2', rn2, false, false))
            )
        );
}

var epubMakerBtn = document.querySelector('#epubMakerBtn');
epubMakerBtn.addEventListener('click', downloadTestEpub);