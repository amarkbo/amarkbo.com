var sys = require('sys');
var exec = require('child_process').exec;
var chokidar = require('chokidar');

console.log('watching...');
var watcher = chokidar.watch(['templates/', 'src/'], {
    ignored: /[\/\\]\./,
    persistent: true
});

watcher.on('change', function(path) {
    console.log('File', path, 'has been changed');
    console.log('--- build: ' + new Date().toISOString());
    exec("node build.js", function(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log('------');
    });
});
