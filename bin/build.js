#! /usr/bin/env node

'use strict';

var jison = require('jison');
var ebnfParser = require('ebnf-parser');
var path = require('path');
var fs = require('fs');

var browserify = require('browserify');
var babelify = require("babelify");

fs.readFile(path.resolve(__dirname, '../src/rule.jison'), 'UTF-8', function(err, data) {
    console.log('compiling...');
    if (err) {
        throw new Error('failed to read rule.json');
    }

    var grammer = ebnfParser.parse(data);

    var rule = new jison.Generator(grammer, {});
    var js = rule.generate({
        'moduleName' : 'rule.js',
        'module-type': 'js'
    });

    fs.writeFileSync(path.resolve(__dirname, '../src/rule.js'), js + ';module.exports = parser;');

    console.log('compile done');

    console.log('building...');

    browserify({ debug: true })
        .transform(babelify.configure({
            blacklist: ['useStrict']
        }))
        .require(path.resolve(__dirname, '../lib/jellymarker.js'), { entry: true })
        .bundle()
        .on('error', function (err) { console.log("Error: " + err.message); })
        .on('end', function() { console.log('build done');})
        .pipe(fs.createWriteStream(path.resolve(__dirname, '../dist/jellymarker.js')));

});
