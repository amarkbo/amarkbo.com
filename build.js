var extname = require('path').extname;
var sys = require('sys');
var exec = require('child_process').exec;

var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var metaobject = require('metalsmith-metaobject');

var settings = require('./settings_local.json');

var metalsmith_src = Metalsmith(__dirname)

    .use(metaobject(settings))

    //.use(markdown())

    .use(templates({
        engine: 'swig',
        directory: 'templates',
    }))

    .use(sass({
        outputStyle: 'nested',
        imagePath: '/'
    }))

    .use(permalinks({
        pattern: ':title',
        relative: false
    }))

    .build(function(err){
        if (err) throw err;

        // copy components for now
        exec("cp -R bower_components build/vendor", function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    });

/**
 * Concat plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

/*
function concat(files, metalsmith, done){
  var css = '';

  for (var file in files) {
    if ('.css' != extname(file)) continue;
    css += files[file].contents.toString();
    delete files[file];
  }

  css = myth(css);

  files['index.css'] = {
    contents: new Buffer(css)
  };

  done();
}
*/
