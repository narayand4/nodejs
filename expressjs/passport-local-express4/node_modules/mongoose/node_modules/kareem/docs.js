var acquit = require('acquit');

var content = require('fs').readFileSync('./test/examples.test.js').toString();
var blocks = acquit.parse(content);

var mdOutput =
  '# kareem\n\n' +
  'Next-generation take on the [hooks](http://npmjs.org/package/hooks), ' +
  'meant to offer additional flexibility in allowing you to execute hooks ' +
  'whenever necessary, as opposed to simply wrapping a single function.\n\n' +
  'Named for the NBA\'s all-time leading scorer Kareem Abdul-Jabbar, known ' +
  'for his mastery of the [hook shot](http://en.wikipedia.org/wiki/Kareem_Abdul-Jabbar#Skyhook)\n\n' +
  '<img src="http://upload.wikimedia.org/wikipedia/commons/0/00/Kareem-Abdul-Jabbar_Lipofsky.jpg" width="220">\n\n'
  '# API\n\n';

for (var i = 0; i < blocks.length; ++i) {
  var describe = blocks[i];
  mdOutput += '## ' + describe.contents + '\n\n';
  mdOutput += describe.comments[0] ?
    trimEachLine(describe.comments[0]) + '\n\n' :
    '';

  for (var j = 0; j < describe.blocks.length; ++j) {
    var it = describe.blocks[j];
    mdOutput += '#### It ' + it.contents + '\n\n';
    mdOutput += it.comments[0] ? trimEachLine(it.comments[0]) + '\n\n' : '';
    mdOutput += '```javascript\n';
    mdOutput += '    ' + it.code + '\n';
    mdOutput += '```\n\n';
  }
}

require('fs').writeFileSync('README.md', mdOutput);