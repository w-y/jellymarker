# Jellymarker.js
---

Jellymarker.js defines a set of simple rules for expressions (i.e, +, -, *, /, (), call).

Data and operations are all abstracted and you need to define your own.

A simple demo:

First you defined variable A and B:
    
    var jellymarker = Jellymarker.create();
    
    jellymarker.registerVariables('A', {v:'Hi'})
    
    jellymarker.registerVariables('B', {v:'Bob'})
    

Then you defined operator + * - :

    jellymarker.registerOperators('+', function(v1, v2) {
        return {
            v: v1.v + ' ' + v2.v;
        }
    })

Apply the rule with Jellymarker:

    C = A + B

Finally you get C:
    
    {
        v: 'Hi Bob'
    }

## Installation

    git clone https://github.com/w-y/jellymarker.git
    
    cd jellymarker
    
    npm install
    
    node ./bin/build.js  // ./dist/jellymarker.js


## variables

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

But in the system of css styles it could be meaningfule:
    
    height(100) + width(100) + block

## operators

Jellymarker now supports binary operators: +, -, * and /.

    jellymarker.registerOperators('+', function(v1, v2) {
        // your rule
    });

Then you can use operator '+' in the script.

and *,/ 's priority is higher than +,-.
