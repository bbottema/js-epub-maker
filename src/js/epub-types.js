(function() {
   // source: http://www.idpf.org/epub/vocab/structure/epub-vocab-structure-20150826.html
   var epubtypes = [
      {
         "name":"abstract",
         "type":"ABSTRACT",
         "group": "Front Matter",
         "description":"A short summary of the principle ideas, concepts and conclusions of the work, or of a section or except within it."
      },
      {
         "name":"foreword",
         "type":"FOREWORD",
         "group": "Front Matter",
         "description":"An introductory section that precedes the work, typically not written by the work's author."
      },
      {
         "name":"preface",
         "type":"PREFACE",
         "group": "Front Matter",
         "description":"An introductory section that precedes the work, typically written by the work's author."
      },
      {
         "name":"introduction",
         "type":"INTRODUCTION",
         "group": "Front Matter",
         "description":"A section in the beginning of the work, typically introducing the reader to the scope or nature of the work's content."
      },
      {
         "name":"preamble",
         "type":"PREAMBLE",
         "group": "Front Matter",
         "description":"A section in the beginning of the work, typically containing introductory and/or explanatory prose regarding the scope or nature of the work's content"
      },
      {
         "name":"epigraph",
         "type":"EPIGRAPH",
         "group": "Front Matter",
         "description":"A quotation that is pertinent but not integral to the text."
      },
      {
         "name":"non-specific frontmatter",
         "type":"FRONTMATTER-GENERIC",
         "group": "Front Matter",
         "description": "Content placed in the frontmatter section, but which has no specific semantic meaning."
      },
      {
         "name":"part",
         "type":"PART",
         "group": "Body Matter",
         "description":"An introductory section that sets the background to a story, typically part of the narrative."
      },
      {
         "name":"chapter",
         "type":"CHAPTER",
         "group": "Body Matter",
         "description":"An introductory section that sets the background to a story, typically part of the narrative."
      },
      {
         "name":"prologue",
         "type":"PROLOGUE",
         "group": "Body Matter",
         "description":"An introductory section that sets the background to a story, typically part of the narrative."
      },
      {
         "name":"conclusion",
         "type":"CONCLUSION",
         "group": "Body Matter",
         "description":"An ending section that typically wraps up the work."
      },
      {
         "name":"epilogue",
         "type":"EPILOGUE",
         "group": "Body Matter",
         "description":"A concluding section that is typically written from a later point in time than the main story, although still part of the narrative."
      },
      {
         "name":"afterword",
         "type":"AFTERWORD",
         "group": "Back Matter",
         "description":"A closing statement from the author or a person of importance to the story, typically providing insight into how the story came to be written, its significance or related events that have transpired since its timeline."
      },
      {
         "name":"non-specific backmatter",
         "type":"BACKMATTER-GENERIC",
         "group": "Back Matter",
         "description": "Content placed in the backmatter section, but which has no specific semantic meaning."
      },
      {
         "name":"rearnote",
         "type":"REARNOTE",
         "group": "Back Matter",
         "description":"A note appearing in the rear (backmatter) of the work, or at the end of a section."
      }
   ];
   
   var groups = {};
   for (var i in epubtypes) {
       var group = epubtypes[i].group;
       (groups[group] || (groups[group] = [])).push(epubtypes[i]);
   }
   
   function getGroup(epubtype) {
      return {
         "ABSTRACT": "FRONTMATTER",
         "FOREWORD": "FRONTMATTER",
         "PREFACE": "FRONTMATTER",
         "INTRODUCTION": "FRONTMATTER",
         "PREAMBLE": "FRONTMATTER",
         "EPIGRAPH": "FRONTMATTER",
         "FRONTMATTER-GENERIC": "FRONTMATTER",
         "PART": "BODYMATTER",
         "CHAPTER": "BODYMATTER",
         "PROLOGUE": "BODYMATTER",
         "CONCLUSION": "BODYMATTER",
         "EPILOGUE": "BODYMATTER",
         "AFTERWORD": "BACKMATTER",
         "BACKMATTER-GENERIC": "BACKMATTER",
         "REARNOTE": "BACKMATTER"
      }[epubtype];
   }
   
   function getActualType(type) {
      if (!type) {
         return null;
      }
      for (var i = 0; i < epubtypes.length; i++) {
         if (epubtypes[i].type === type) {
            return epubtypes[i].name;
         }
      }
      throw new Error('unknown epub type identifier: ' + type);
   }
   
   module.exports = { 
      types: epubtypes, 
      groups: groups,
      getGroup: getGroup,
      getActualType: getActualType
   };
})();