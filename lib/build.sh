cd ../src
jison rule.jison
echo "module.exports = parser" >> rule.js
cd ../lib
browserify -t [babelify --blacklist useStrict] main.js -o main.build.js
node main.build.js
