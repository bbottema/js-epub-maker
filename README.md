[![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Code Climate][codeclimate-gpa-image]][codeclimate-url] [![Codacy Badge][codacy-shields-image]][codacy-url]

# js-epub-maker

`js-epub-maker` will allow you to create and download epubs. It offers an API through which you can set meta info, navigation and content. `js-epub-maker` works by gutting [IDPF's sample epub](http://idpf.github.io/epub3-samples/) and refitting it with your content. The source epub this project is working with is [The Waste Land](http://idpf.github.io/epub3-samples/samples.html#wasteland) ([source code](https://github.com/IDPF/epub3-samples/tree/master/30/wasteland)).

## API example

Taken from the included [test page](https://github.com/bbottema/js-epub-maker/blob/master/src/test/test-script.js).

```javascript
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
    .withCover('src/test/content-for-epub/js-epub-maker-cover.jpg', {
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
    )
    .downloadEpub();
```

## Sections

There is some API to set all the meta-data, but the magic in the way you can add *sections*. With sections you can add either all content with just one section, or finetune all the content so that it snugly fits the epub spec (with the various epub types described in the spec) and more importantly allows you to indicate exactly what should be included in the TOC and Landmarks section of the epub. You don't need to take care of all that, `js-epub-maker` will do that for you.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[travis-url]: http://travis-ci.org/bbottema/js-epub-maker
[travis-image]: https://img.shields.io/travis/bbottema/js-epub-maker.svg?style=flat

[coveralls-url]: https://coveralls.io/r/bbottema/js-epub-maker?branch=master
[coveralls-image]: https://coveralls.io/repos/bbottema/js-epub-maker/badge.svg?branch=master

[codeclimate-url]: https://codeclimate.com/github/bbottema/js-epub-maker
[codeclimate-gpa-image]: https://codeclimate.com/github/bbottema/js-epub-maker/badges/gpa.svg

[codacy-url]: https://www.codacy.com/app/b-bottema/js-epub-maker/dashboard
[codacy-image]: https://www.codacy.com/project/badge/41d637e3c7ae405a942800cae60ee73f
[codacy-shields-image]: https://img.shields.io/codacy/41d637e3c7ae405a942800cae60ee73f.svg?style=flat
