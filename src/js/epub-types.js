/* global module */
(function() {
   'use strict';
   
   // source: http://www.idpf.org/epub/vocab/structure/epub-vocab-structure-20150826.html
   var epubtypes = [
      {
         'name':'abstract',
         'group': 'Front Matter',
         'description':'A short summary of the principle ideas, concepts and conclusions of the work, or of a section or except within it.'
      },
      {
         'name':'foreword',
         'group': 'Front Matter',
         'description':'An introductory section that precedes the work, typically not written by the work\'s author.'
      },
      {
         'name':'preface',
         'group': 'Front Matter',
         'description':'An introductory section that precedes the work, typically written by the work\'s author.'
      },
      {
         'name':'introduction',
         'group': 'Front Matter',
         'description':'A section in the beginning of the work, typically introducing the reader to the scope or nature of the work\'s content.'
      },
      {
         'name':'preamble',
         'group': 'Front Matter',
         'description':'A section in the beginning of the work, typically containing introductory and/or explanatory prose regarding the scope or nature of the work\'s content'
      },
      {
         'name':'epigraph',
         'group': 'Front Matter',
         'description':'A quotation that is pertinent but not integral to the text.'
      },
      {
         'name':'non-specific frontmatter',
         'group': 'Front Matter',
         'description': 'Content placed in the frontmatter section, but which has no specific semantic meaning.'
      },
      {
         'name':'part',
         'group': 'Body Matter',
         'description':'An introductory section that sets the background to a story, typically part of the narrative.'
      },
      {
         'name':'chapter',
         'group': 'Body Matter',
         'description':'An introductory section that sets the background to a story, typically part of the narrative.'
      },
      {
         'name':'prologue',
         'group': 'Body Matter',
         'description':'An introductory section that sets the background to a story, typically part of the narrative.'
      },
      {
         'name':'conclusion',
         'group': 'Body Matter',
         'description':'An ending section that typically wraps up the work.'
      },
      {
         'name':'epilogue',
         'group': 'Body Matter',
         'description':'A concluding section that is typically written from a later point in time than the main story, although still part of the narrative.'
      },
      {
         'name':'afterword',
         'group': 'Back Matter',
         'description':'A closing statement from the author or a person of importance to the story, typically providing insight into how the story came to be written, its significance or related events that have transpired since its timeline.'
      },
      {
         'name':'non-specific backmatter',
         'group': 'Back Matter',
         'description': 'Content placed in the backmatter section, but which has no specific semantic meaning.'
      },
      {
         'name':'rearnote',
         'group': 'Back Matter',
         'description':'A note appearing in the rear (backmatter) of the work, or at the end of a section.'
      }
   ];
   
   var groups = {};
   for (var i = 0; i < epubtypes.length; i++) {
       var group = epubtypes[i].group;
       (groups[group] || (groups[group] = [])).push(epubtypes[i]);
   }
   
   function getGroup(epubtype) {
      return {
         'abstract': 'frontmatter',
         'foreword': 'frontmatter',
         'preface': 'frontmatter',
         'introduction': 'frontmatter',
         'preamble': 'frontmatter',
         'epigraph': 'frontmatter',
         'non-specific frontmatter': 'frontmatter',
         'part': 'bodymatter',
         'chapter': 'bodymatter',
         'prologue': 'bodymatter',
         'conclusion': 'bodymatter',
         'epilogue': 'bodymatter',
         'afterword': 'backmatter',
         'non-specific backmatter': 'backmatter',
         'rearnote': 'backmatter'
      }[epubtype];
   }
   
   module.exports = { 
      types: epubtypes, 
      groups: groups,
      getGroup: getGroup
   };
})();