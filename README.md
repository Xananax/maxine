# MAXINE

Mix'n'match methods. Call them traits, mixins, whatever you want. Discuss inheritance vs composition vs prototypal vs your mom until the end of times, or don't. This system works for me, hope it works for you.

## Usage

```bash
npm install --save maxine
```

```js
    var mix = require('maxine')();
    mix('letters',
        {_letters:{a:'A',b:'B',c:'C',d:'D'}},
        function letter(obj,name){
            return obj.letters[name];
        }
    )
    function getA(obj){return obj.letter('a');}
    function getB(obj){return obj.letter('b');}
    function getC(obj){return obj.letter('c');}
    function getD(obj){return obj.letter('d');}

    mix('A','letters',getA);
    mix('ABD','letters',getA,getB,getD);
    mix('BC','letters',getB,getC);

    var BC_instance = mix('BC').Create();
    BC_instance.getB();
    mix.is(BC_instance,'BC');

```


You'll find a somewhat more thorough listing of what the library can do in the spec.md and examples.md files.

---

## Documentation

Not yet

---

## Working

clone the repo, then create a directory './lib' in the root of the repo.

- tests: `npm test` or `npm run testWatch` to run tests or run tests and watch for changes
- build: `npm run compile` to transpile the ES6 files in './src' to ES5 files in './lib'
- publish: `npm run dist` to test, build, and generate test specs files. This is run automatically before publishing to npm.

*Note to npm users: tests run on the ES6 version so they're not available when you install through npm*



---

## License

MIT