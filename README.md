[![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Code Climate][codeclimate-gpa-image]][codeclimate-url] [![Codacy Badge][codacy-shields-image]][codacy-url] [![Coverage Status][coveralls-image]][coveralls-url]

# js-epub-maker

`js-epub-maker` will allow you to create and download epubs. It offers an API through which you can set meta info, navigation and content.

This project is not a full blown epub configurator and publisher: to reduce the complexity and time needed to accomplish offering epubs to end-users, this project relies on sample templates which can be populated using `js-epub-maker`'s API.

The sample templates are (initially) taken from IDPF's own samples: http://idpf.github.io/epub3-samples/


Currently the only template supported is [idpf's wasteland epub sample](http://idpf.github.io/epub3-samples/samples.html#wasteland) ([source code](https://github.com/IDPF/epub3-samples/tree/master/30/wasteland)). This template is suitable for generating books in epub format with a single continuous content page. Includes navigation compatible with the older epub2 standard.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[travis-url]: http://travis-ci.org/bbottema/js-epub-maker
[travis-image]: https://img.shields.io/travis/bbottema/js-epub-maker.svg?style=flat

[coveralls-url]: https://coveralls.io/r/bbottema/js-epub-maker?branch=master
[coveralls-image]: https://coveralls.io/repos/bbottema/js-epub-maker/badge.svg?branch=master

[codeclimate-url]: https://codeclimate.com/github/bbottema/js-epub-maker
[codeclimate-gpa-image]: https://codeclimate.com/github/bbottema/js-epub-maker/badges/gpa.svg

[codacy-url]: https://www.codacy.com/app/b-bottema/console-logger/dashboard
[codacy-image]: https://www.codacy.com/project/badge/fc9f04daa6cd4005bbe02683c3d0b558
[codacy-shields-image]: https://img.shields.io/codacy/fc9f04daa6cd4005bbe02683c3d0b558.svg?style=flat
