cd ../src
jison rule.jison
echo "module.exports = parser" >> rule.js
cd ../lib
browserify -t [babelify --blacklist useStrict] stock.js -o stock.build.js
node stock.build.js
browserify -t [babelify --blacklist useStrict] style.js -o style.build.js
node style.build.js
