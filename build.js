var extname = require('path').extname;
var sys = require('sys');
var exec = require('child_process').exec;

var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var metaobject = require('metalsmith-metaobject');

var settings = require('./settings_local.json');

var metalsmith_src = Metalsmith(__dirname)

metalsmith_src.use(metaobject(settings))

    .use(collections({
        works: {
            pattern: 'works/*.html',
            sortBy: 'date',
            reverse: true
        }
    }))

    .use(permalinks({
        pattern: ':collection/:title',
        relative: false
    }))

    .use(templates({
        engine: 'swig',
        directory: 'templates',
    }))

    .use(sass({
        outputStyle: 'nested',
        imagePath: '/'
    }))

    .build(function(err){
        if (err) throw err;

        // copy components for now TODO: rsync this
        exec("cp -R bower_components build/vendor", function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    });
