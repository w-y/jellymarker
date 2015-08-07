#! /usr/bin/env node

'use strict';

var jison = require('jison');
var ebnfParser = require('ebnf-parser');
var path = require('path');
var fs = require('fs');

var browserify = require('browserify');
var babelify = require("babelify");

fs.readFile(path.resolve(__dirname, '../src/compiler/rule.jison'), 'UTF-8', function(err, data) {
    console.log('compiling...');
    if (err) {
        throw new Error('failed to read rule.json');
    }

    var grammer = ebnfParser.parse(data);

    var rule = new jison.Generator(grammer, {});
    var jsRule = rule.generate({
        'moduleName' : 'rule.js',
        'module-type': 'js'
    });
    var buffArr = jsRule.split('\n');

    jsRule = (buffArr.slice(0, buffArr.length - 16)).join('\n'); 

    fs.writeFileSync(path.resolve(__dirname, '../src/compiler/rule.js'), jsRule + ';module.exports = parser;');

    console.log('compile done');

    console.log('building...');

    var body = '';

    browserify({ debug: false })
        .transform(babelify.configure({
            blacklist: ['useStrict']
        }))
        .require(path.resolve(__dirname, '../src/jellymarker.js'), {entry: true})
        .bundle()
        .on('error', function (err) { console.log("Error: " + err.message); })
        .on('end', function() { 

            var moduleNo = body.substring(body.length - 16).match(/\d+/)[0];

            body = 'var jellymarker='+body+';jellymarker=jellymarker('+moduleNo+');if (typeof require !== \'undefined\' && typeof exports !== \'undefined\') {module.exports=jellymarker;}';
            fs.writeFileSync(path.resolve(__dirname, '../dist/jellymarker.js'), body);
            console.log('build done');
        })
        .on('data', function (chunk) {
            body += chunk;
        });
});
