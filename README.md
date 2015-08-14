# Jellymarker.js

Jellymarker.js defines a set of simple rules for expressions (i.e, +, -, *, /, (), call).

Data and operations are all abstracted and you need to define your own.

A simple demo:

First you define variable A and B:

    var Jellymarker  = require('jellymarker');

    var jellymarker = Jellymarker.create();

    jellymarker.registerVariables('A', {v:'Hi'})

    jellymarker.registerVariables('B', {v:'Bob'})


Then you define operator + * - :

    jellymarker.registerOperators('+', function(v1, v2) {
        return {
            v: v1.v + ' ' + v2.v
        }
    })

Apply the rule with Jellymarker:

    C = A + B

    console.log(jellymarker.eval('C = A + B'))

Finally you get C:

    {
        v: 'Hi Bob'
    }

## Installation

    git clone https://github.com/w-y/jellymarker.git

    cd jellymarker

    npm install

    node ./bin/build.js  // ./dist/jellymarker.js


## Variables

Define a named data structure:

    jellymarker.registerVariables('EMPTY', {})

Then you can use it in the script as

    EMPTY


It could be a function:

    jellymarker.registerVariables('NOP', function() {})

And in the script:

    NOP()


Obviously, the operations between variables could be called meaningful only when the variables are in the same system.

It makes no sense:

    A + B

But in the system of css styles it could be meaningful:

    height(100) + width(100) + block

## Operators

Jellymarker now supports binary operators: +, -, * and /.

    jellymarker.registerOperators('+', function(v1, v2) {
        // your rule
    });

Then you can use operator '+' in the script.

and '*' and '/' 's priority is higher than '+' and '-'.

## APIs

Jellymarker's instance has compile and eval function to parse the script.

The difference between compile and eval is that compile doesn't have return values and eval return the value of the first expression (statement). Statements are sepreated by token '\n' or ';'.

    //using ';'
    'C = A + B; D = A - B';

    //using '\n'
    'C = A + B \n D = A - B'

### complie

You can get the runtime values of all variables through the build-in attribute variables after compile,

    var Jellymarker = require('jellymarker');

    var jellymarker = Jellymarker.create();

    jellymarker.registerVariables('A', {v:'Hi'})

    jellymarker.registerVariables('B', {v:'Bob'})

    jellymarker.registerOperators('+', function(v1, v2) {
        return {
            v: v1.v + ' ' + v2.v
        }
    });

    jellymarker.registerOperators('-', function(v1, v2) {
        return {
            v: v2.v + ' ' + v1.v
        }
    });

    jellymarker.compile('C = A + B; D = A - B;');

    console.log(jellymarker.variables);

The output:


    {
        A: { v: 'Hi' },
        B: { v: 'Bob' },
        C: { v: 'Hi Bob' },
        D: { v: 'Bob Hi' }
    }


### eval

Eval is the same with compile except that it return the value of first statement parsed.

    console.log(jellymarker.eval('C = A + B; D = A - B;'));

The output:

    { v: 'Hi Bob' }

After run eval, the runtime value of attribute instance.variables will be affected. 
