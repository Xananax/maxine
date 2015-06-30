var maxine = require('../src/mixin');
var expect = require('chai').expect;

describe('Readme simple example',function(){
it('should do stuff',function(){
	var mix = maxine();
	var Rabbit = mix(
		{earSize:'50cm',color:'black'}
	,	function jump(){return 'hop';}
	);
	var whiteRabbit = Rabbit.Create().setProperties({color:'white'});
	expect(mix.behavesAs(whiteRabbit,Rabbit)).to.be.true;
	expect(whiteRabbit.color()).to.equal('white');
	// Let's make it terser;
	mix('RabbitMix'
	,	{earSize:'50cm',color:'black'}
	,	function init(obj,props){
			if(props.color){obj.color(props.color);}
		}
	,	function jump(){return 'hop';}
	);
	mix('CockyMix'
	,	function show(obj){
			if(mix.is(obj,'RabbitMix')){
				return 'Look at my beautiful '+obj.color()+' color!';
			}
			return 'I am not so cool';
		}
	);
	mix('CockyRabbit','RabbitMix','CockyMix')
	// create an instance:
	var redRabbit = mix('CockyRabbit').Create({color:'red'});
	// tests:
	expect(mix.is(redRabbit,'RabbitMix')).to.be.true;
	expect(mix.is(redRabbit,'CockyMix')).to.be.true;
	expect(mix.is(redRabbit,'CockyRabbit')).to.be.true;
	expect(redRabbit.color()).to.equal('red');
	expect(mix.behavesAs(redRabbit,Rabbit)).to.be.true;
	expect(redRabbit.show()).to.equal('Look at my beautiful red color!');
});
});
describe('Readme complex example',function(){
it('should do everything the readme say it does',function(done){
	// creating a mixin namespace;
	var mix = maxine();
	// You can separate namespaces by invoking maxine()
	// multiple times
	// For example, later, you could do mix2 = maxine();
	// mixins created with `mix` would not interfere with
	// mixins created with `mix2`
	//
	//-------------------------------------------------
	//
	// let's create a mixin called 'gendered'
	mix('gendered'
	,	{sex:'female'}
		// 'init' is a special method that is called
		// on creation. If another mixin implements
		// 'init', all the inits will be called in order
		// Since you do not know which properties will be
		// passed and in which order, it is good practice
		// to use an options object
	,	function init(obj,options){
			var gender = options && options.gender;
			obj.sex(gender||'female');
		}
	,	function hasIntercourseWith(obj,other,childProps){
			if(!mix.is(obj,'gendered') || !mix.is(other,'gendered')){
				throw new Error('Sadly, one of these two doesn\'t have genitals');
			}
			if(obj.sex()==other.sex()){
				return 'that was very satisfying';
			}
			var mixinName = mix.is(obj)[0];
			var child = mix(mixinName).Create().setProperties(childProps);
			return child;
		}
	)
	// some behavioral test
	var genderedInstance = mix('gendered').Create();
	// test if genderedInstance is a 'gendered' mixin
	expect(mix.is(genderedInstance,'gendered')).to.be.true;
	// test that genderedInstance has a 'sex' property
	expect(genderedInstance).to.have.property('sex');
	// 'sex' is a function
	expect(genderedInstance.sex).to.be.a.function;
	// 'sex' returns the passed value
	expect(genderedInstance.sex()).to.equal('female');
	// 'sex' is a getter/setter
	// and is chainable:
	expect(genderedInstance.sex('depends').sex()).to.equal('depends');
	// using 'init':
	var anotherGenderedInstance = mix('gendered').Create({gender:'male'})
	expect(anotherGenderedInstance.sex()).to.equal('male');
	//
	//-------------------------------------------------
	///
	// let's try an eventEmitter mixin
	// We're creating an object just so we can reference it
	// in tests later, but we could've written just as well:
	// {_event:{}}
	var eventsObj = {}
	mix('eventEmitter'
	,	{
			// since _events begins with '_', no automatic
			// getters/setter method will be created. Rather,
			// each instance of 'eventEmitter' will have it's
			// own 'events' property
			_events:eventsObj
		}
	,	function addEventListener(obj,event,fn){
			var events = obj.events;
			events[event] = events[event] || [];
			events[event].push(fn);
		}
	,	function emit(obj,event){
			var events = obj.events;
			var fns = events[event];
			if(fns){
				fns.forEach(function(fn){fn();});
			}
		}
	);
	// some tests
	var eventEmitterInstance = mix('eventEmitter').Create();
	var secondEventEmitterInstance = mix('eventEmitter').Create();
	expect(eventEmitterInstance).to.have.property('events');
	// since the property 'events' begins with '_', it's not going to be
	// a function
	expect(eventEmitterInstance.events).to.not.be.a.function;
	// also, the property is properly cloned and not instancied
	expect(eventEmitterInstance.events).to.not.equal(eventsObj);
	expect(secondEventEmitterInstance.events).to.not.equal(eventEmitterInstance.events);
	// let's test the actual methods:
	var hasEmitted = false;
	eventEmitterInstance.addEventListener('someEvent',function(){hasEmitted = true;})
	expect(eventEmitterInstance.events).to.have.property('someEvent');
	eventEmitterInstance.emit('someEvent');
	expect(hasEmitted).to.be.true;
	//
	//-------------------------------------------------
	//
	// Let's do something more complex:
	// We're going to create some mixins first
	//
	//-------------------------------------------------
	//
	mix('animal'
		// uses the 'gendered' mixin defined earlier
	,	'gendered'
		// also uses the 'eventEmitter' mixin
	,	'eventEmitter'
	,   {
			legs:4
		,   energy:10
		}
	,	function init(obj,props){
			var legs = (props && props.legs) || 4;
			obj.legs(legs);
		}
	,	function die(obj){
			obj.energy(0);
			return obj;
		}
	,	function isDead(obj){
			return (obj.energy()<=0);
		}
	,	function heartBeat(obj){
			if(!obj.isDead()){
				return 'dudum';
			}
			return '...';
		}
	);
	// Some tests:
	let animalInstance = mix('animal').Create();
	expect(animalInstance).to.have.property('emit'); // from eventEmitter
	expect(animalInstance).to.have.property('sex'); // from gendered
	expect(animalInstance).to.have.property('heartBeat');
	// but we can also use 'is':
	expect(mix.is(animalInstance,'animal')).to.be.true;
	expect(mix.is(animalInstance,'eventEmitter')).to.be.true;
	expect(mix.is(animalInstance,'gendered')).to.be.true;
	// or, terser:
	expect(mix.is(animalInstance,'animal','eventEmitter','gendered')).to.be.true;
	// or maybe we don't know what to expect:
	expect(mix.is(animalInstance)).to.eql(['animal','gendered','eventEmitter']);
	// let's make sure the methods work as expected:
	expect(animalInstance.energy(0).isDead()).to.be.true;
	expect(animalInstance.heartBeat()).to.equal('...');
	expect(animalInstance.energy(10).isDead()).to.be.false;
	expect(animalInstance.die().isDead()).to.be.true;
	//
	//-------------------------------------------------
	//
	mix('electricity socket'
	,	'gendered' //uses the 'gendered' mixin defined earlier
	,	{
			volts:200
		,	plugged:false
		}
	,	function init(obj,props){
			var volts = props.volts || 200;
			obj.volts(volts);
		}
	,	function isDangerous(obj){
			var volts = this.volts();
			if(volts>40){return true;}
			else{return false;}
		}
	,	function plug(obj,otherObj){
			if(mix.is(otherObj,'mammal')){
				otherObj.furStatus('spiky');
			}
			if(mix.is(otherObj,'animal')){
				if(obj.isDangerous()){
					otherObj.die();
				}
				otherObj.decrease('energy',obj.volts());
				return obj;
			}
			if(!mix.is(otherObj,'electricity socket')){
				throw new Error('plugging non-socket stuff in sockets is ill advised');
			}
			var thisGender = obj.sex();
			var otherGender = otherObj.sex();
			if(thisGender == otherGender){
				throw new Error('same gender sockets marriage is still illegal')
			}
			return obj;
		}
	);
	//
	// Some tests:
	// let's test multiple inits:
	let socketInstance = mix('electricity socket').Create({gender:'male',volts:50});
	let otherSocketInstance = mix('electricity socket').Create({gender:'female',volts:50});
	let thirdSocketInstance = mix('electricity socket').Create({gender:'male',volts:50});
	expect(socketInstance.sex()).to.equal('male');
	expect(socketInstance.volts()).to.equal(50);
	expect(socketInstance.isDangerous()).to.be.true;
	function femaleToMalePlug(){
		otherSocketInstance.plug(socketInstance);
	}
	function maleToMalePlug(){
		thirdSocketInstance.plug(socketInstance);
	}
	expect(femaleToMalePlug).to.not.throw(Error);
	expect(maleToMalePlug).to.throw(Error);
	//
	//-------------------------------------------------
	//
	mix('mammal'
	,	'animal'
	,	{
			fur:true
		,	furStatus:'smooth'
		}
	,	function callOut(obj){
			if(mix.is(obj,'eventEmitter')){
				obj.emit('cry');
			}else{
				throw new Error('non eventEmitter objects can\'t call out')
			}
			return obj;
		}
	,	function listenTo(obj,otherObj){
			if(mix.is(otherObj,'eventEmitter')){
				otherObj.addEventListener('cry',function(){
					if(!obj.isDead()){
						obj.furStatus('bristly');
					}
				});
			}else{
				throw new Error('cannot listen to a non eventEmitter');
			}
			return obj;
		}
	,	function breastFeed(obj,mammal){
			if(!mix.is(mammal,'mammal')){throw new Error(`can't feed non-mammals`);}
			if(obj.sex()!=='female'){throw new Error(`males can't breastfeed!`);}
			mammal.drinkMilk();
			let curr = obj.energy();
			obj.decrease('energy');
		}
	,	function drinkMilk(obj){
			obj.increase('energy');
			return obj;
		}
	);
	// some tests:
	let mammalInstance = mix('mammal').Create();
	// of course, a mammal is an animal
	expect(mix.is(mammalInstance,'mammal','animal')).to.be.true
	// but a mammal is also gendered, though we didn't explicitely specify it:
	expect(mix.is(mammalInstance,'mammal','animal','gendered')).to.be.true
	// and also an eventEmitter:
	expect(mix.is(mammalInstance,'eventEmitter')).to.be.true
	// let's test the eventEmitter stuff:
	let anotherMammalInstance = mix('mammal').Create();
	anotherMammalInstance.listenTo(mammalInstance);
	mammalInstance.callOut();
	expect(anotherMammalInstance.furStatus()).to.equal('bristly');
	//
	//-------------------------------------------------
	//
	mix('hasWings'
	,	{
			elevation:0
		,	isFlapping:false
		,	_flapCadence:500
		}
		// note that to set properties, maybe the convenience
		// method 'setProperties' is better; 'init' allows
		// for more flexibility, which is not needed in this example,
		// but might come in handy
	,	function init(obj,props){
			var elevation = props.elevation || 0; 
			obj.elevation(elevation||0);
			obj.flapCadence = props.flapCadence || 500;
		}
	,	function flap(obj){
			obj.isFlapping(true);
			obj.fly();
		}
	,	function stopFlapping(obj){
			obj.isFlapping(false);
			obj.fly();
		}
	,	function fly(obj){
			setTimeout(function(){
				if(!obj.isFlapping() && obj.elevation()>0){
					obj.decrease('elevation'); //'increase' is a convenience method
					obj.fly();
				}else if(obj.isFlapping()){
					obj.increase('elevation'); //'decrease' is also a convenience method
					obj.fly();
				}
			},this.flapCadence);
		}
	)
	// some tests:
	// using 'factory' instead of 'Create', they are equivalent:
	var hasWingsInstance = mix.factory('hasWings',{elevation:10,flapCadence:50});
	expect(hasWingsInstance.elevation()).to.equal(10);
	// we'll test the flapping later below
	//
	//-------------------------------------------------
	//
	mix('bird'
	,	'hasWings'
	,	'animal'
	,	function init(obj,props){
			// instead of setting legs here, we can let
			// the init function of animal take care of it;
			// however, this works only because animal comes
			// before this function in the flow;
			// if 'animal' was after 'init' in this
			// mixin declaration, the following would
			// not work
			props.legs = 2;
		}
	,	function listenTo(obj,otherObj){
			if(mix.is(otherObj,'eventEmitter')){
				otherObj.addEventListener('cry',function(){
					obj.flap();
				});
			}else{
				throw new Error('cannot listen to a non eventEmitter');
			}
			return obj;
		}
	,	{
			feathers:true
		}
	);
	// some tests:
	var birdInstance = mix('bird').Create();
	expect(mix.is(birdInstance,'bird','hasWings','animal','gendered')).to.be.true;
	expect(birdInstance.legs()).to.equal(2);
	//
	//-------------------------------------------------
	//
	//Let's end with a very simple mixin:
	var bearBluePrint = mix('bear','mammal',function roar(){return 'ROARRRR';});
	//-------------------------------------------------
	//
	// We created all our blueprints, now let's make them
	// interact
	// 
	//-------------------------------------------------
	//
	// Here are a few actors:
	// 
	var mom = bearBluePrint.Create({gender:'female'});
	var dad = bearBluePrint.Create({gender:'male'});
	var companion = mix('bird').Create({flapCadence:50});
	var socket = mix('electricity socket').Create({volts:200});
	// notice that as we pass an object of properties, we use the properties names, and
	// not the arbitrary keys we expect in the init() we created;
	// thus, though 'init' uses 'gender' to determine sex, here we have to use
	// the actual property names, since this doesn't use 'init', and so we use 'sex' instead
	// of 'gender'
	var child = mom.hasIntercourseWith(dad,{energy:5,furStatus:'superSmooth',sex:'pan'})
	//
	// Let's make sure it all works as intended:
	// 
	expect(companion.flapCadence).to.be.equal(50);
	expect(dad.sex()).to.equal('male');
	expect(mom.sex()).to.equal('female');
	expect(mix.is(child,'bear')).to.be.true;
	expect(child.sex()).to.equal('pan');
	expect(child.energy()).to.equal(5);
	expect(child.furStatus()).to.equal('superSmooth');
	// 
	// now for some fun:
	// 
	child.listenTo(mom);
	dad.listenTo(mom);
	companion.listenTo(mom);
	//
	mom.breastFeed(child);
	expect(mom.energy()).to.equal(9)
	expect(child.energy()).to.equal(6);
	socket.plug(child);
	//
	expect(child.isDead()).to.be.true;
	//
	mom.callOut();
	expect(dad.furStatus()).to.equal('bristly');
	expect(child.furStatus()).to.equal('spiky');
	expect(companion.isFlapping()).to.equal.true;
	// let the bird fly for a little while
	setTimeout(function(){
		companion.stopFlapping();
		expect(companion.elevation()).to.be.greaterThan(0);
		// and let it go back down
		setTimeout(function(){
			expect(companion.elevation()).to.be.equal(0);
			done();
		},300);
	},200)
});
});