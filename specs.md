# TOC
   - [#mixin](#mixin)
     - [mixin("name",...functions)](#mixin-mixinnamefunctions)
     - [#Create("name",...{objects}](#mixin-createnameobjects)
     - [#Create("name",..."name")](#mixin-createnamename)
     - [#Create(...{objects})](#mixin-createobjects)
     - [Object instanciation](#mixin-object-instanciation)
     - [#is(object,string)](#mixin-isobjectstring)
     - [convenience methods added to mixins](#mixin-convenience-methods-added-to-mixins)
       - [mixin.setProperties({properties})](#mixin-convenience-methods-added-to-mixins-mixinsetpropertiesproperties)
       - [mixin.increase(propName[,number]),mixin.decrease(propName[,number])](#mixin-convenience-methods-added-to-mixins-mixinincreasepropnamenumbermixindecreasepropnamenumber)
       - [mixin.toString](#mixin-convenience-methods-added-to-mixins-mixintostring)
<a name=""></a>
 
<a name="mixin"></a>
# #mixin
<a name="mixin-mixinnamefunctions"></a>
## mixin("name",...functions)
should create an object with the corresponding function names.

```js
var mix = maxine();
function heartBeat(obj) {
	return 'dudum';
}
mix('animal', heartBeat);
var prototype = mix('animal');
expect(prototype).to.have.property('heartBeat');
var someAnimal = Object.create(mix('animal'));
expect(someAnimal).to.have.property('heartBeat');
var beat = someAnimal.heartBeat();
expect(beat).to.equal('dudum');
```

should add the mixin to the list of mixins.

```js
var mix = maxine();
function heartBeat(obj) {
	return 'dudum';
}
mix('animal', heartBeat);
expect(mix.mixins).to.have.property('animal');
```

<a name="mixin-createnameobjects"></a>
## #Create("name",...{objects}
should create getters and setters from properties.

```js
var mix = maxine();
function heartBeat(obj) {
	return 'dudum';
}
mix('animal', heartBeat, { legs: 4 });
var instance = mix('animal').Create();
mix('animal').bork = 'a';
expect(instance).to.have.property('legs');
expect(instance.legs).to.be.a['function'];
expect(instance.legs()).to.equal(4);
expect(instance.legs(2)).to.equal(instance);
expect(instance.legs()).to.equal(2);
```

<a name="mixin-createnamename"></a>
## #Create("name",..."name")
should lookup mixins automatically.

```js
var mix = maxine();
var animalProps = {
	legs: 4,
	energy: 10
};
var mammalProps = {
	fur: true,
	sex: 'male'
};
function heartBeat(obj) {
	return 'dudum';
}
function breastFeed(obj, mammal) {
	if (!mix.is(mammal, 'mammal')) {
		throw new Error('can\'t feed non-mammals');
	}
	if (obj.sex() !== 'female') {
		throw new Error('males can\'t breastfeed!');
	}
	mammal.drinkMilk();
	var curr = obj.energy();
	obj.decrease('energy');
}
function drinkMilk(obj) {
	obj.increase('energy');
	return obj;
}
function flap(obj) {
	obj.increase('elevation');
}
mix('animal', heartBeat, animalProps);
mix('mammal', mammalProps, breastFeed, drinkMilk, 'animal');
mix('bird', { elevation: 0 }, flap, 'animal');
var mama = mix('mammal').Create().setProperties({ sex: 'female' });
var papa = mix('mammal').Create();
var child = mix('mammal').Create();
var birdie = mix('bird').Create();
mama.breastFeed(child);
expect(child.energy()).to.equal(11);
expect(mama.energy()).to.equal(9);
function dadsCantProduceMilk() {
	papa.breastFeed(child);
}
expect(dadsCantProduceMilk).to['throw'](Error);
function momCantFeedABird() {
	mama.breastFeed(bird);
}
expect(momCantFeedABird).to['throw'](Error);
```

<a name="mixin-createobjects"></a>
## #Create(...{objects})
should create an anonymous mixin.

```js
var mix = maxine();
function heartBeat(obj) {
	return 'dudum';
}
var animal = mix(heartBeat, { legs: 4 });
var instance = animal.Create();
expect(instance).to.have.property('legs');
expect(instance.legs).to.be.a['function'];
expect(instance.legs()).to.equal(4);
expect(instance.legs(2)).to.equal(instance);
expect(instance.legs()).to.equal(2);
expect(mix.mixins).to.be.empty;
```

<a name="mixin-object-instanciation"></a>
## Object instanciation
should create instances through #Factory("name").

```js
var mix = maxine();
function heartBeat(obj) {
	return 'dudum';
}
mix('animal', heartBeat);
var instance = mix.factory('animal');
expect(instance).to.have.property('heartBeat');
```

should create instances through #Create.

```js
var mix = maxine();
function heartBeat(obj) {
	return 'dudum';
}
mix('animal', heartBeat);
var instance = mix('animal').Create();
expect(instance).to.have.property('heartBeat');
```

<a name="mixin-isobjectstring"></a>
## #is(object,string)
should return true if the object passed is used in the mixin.

```js
var mix = maxine();
			var animalProps = {
				legs: 4,
				energy: 10
			};
			var mammalProps = {
				fur: true,
				sex: 'male'
			};
			mix('animal', animalProps);
			mix('mammal', mammalProps, 'animal');
			var mama = mix('mammal').Create();
			expect(mix.is(mama, 'animal')).to.be['true'];
			expect(mix.is(mama, 'mammal')).to.be['true'];
			expect(mix.is(mama, 'woman')).to.be['false'];
```

<a name="mixin-convenience-methods-added-to-mixins"></a>
## convenience methods added to mixins
<a name="mixin-convenience-methods-added-to-mixins-mixinsetpropertiesproperties"></a>
### mixin.setProperties({properties})
should call methods with passed argument if they are defined in the model.

```js
var mix = maxine();
var _organs = ['heart'];
function heartBeat(obj) {
	return 'dudum';
}
function organs(obj, add) {
	if (add) {
		_organs = _organs.concat(add);
		return obj;
	}
	return _organs;
}
mix('animal', heartBeat, organs, { lifeSpan: 17, years: 3 });
var instance = mix.factory('animal');
instance.setProperties({ lifeSpan: 20, years: 2, organs: ['lungs', 'liver'] });
expect(instance.organs()).to.eql(['heart', 'lungs', 'liver']);
expect(instance.lifeSpan()).to.equal(20);
expect(instance.years()).to.equal(2);
```

<a name="mixin-convenience-methods-added-to-mixins-mixinincreasepropnamenumbermixindecreasepropnamenumber"></a>
### mixin.increase(propName[,number]),mixin.decrease(propName[,number])
should increase and decrease the property by the given number.

```js
var mix = maxine();
mix('geo', { x: 10, y: 10, width: 50, height: 50 });
var geo = mix('geo').Create();
geo.increase('x');
geo.increase('y', 3);
geo.decrease('width');
geo.decrease('height', 5);
expect(geo.x()).to.equal(11);
expect(geo.y()).to.equal(13);
expect(geo.width()).to.equal(49);
expect(geo.height()).to.equal(45);
```

<a name="mixin-convenience-methods-added-to-mixins-mixintostring"></a>
### mixin.toString
should give a string detailing methods and mixins used.

```js
var mix = maxine();
var animalProps = {
	legs: 4,
	energy: 10
};
var mammalProps = {
	fur: true,
	sex: 'male'
};
function heartBeat(obj) {
	return 'dudum';
}
mix('animal', heartBeat, animalProps);
mix('mammal', mammalProps, 'animal');
var mama = mix('mammal').Create();
expect(mama + '').to.equal('mammal (animal): [fur,sex,heartBeat,legs,energy]');
```

