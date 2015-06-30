var maxine = require('../src/mixin');
var expect = require('chai').expect;

describe('#mixin',function(){
	describe('mixin("name",...functions)',function(){
		it('should create an object with the corresponding function names',function(){
			var mix = maxine();

			function heartBeat(obj){return 'dudum';}

			mix('animal',heartBeat);

			var prototype = mix('animal');
			expect(prototype).to.have.property('heartBeat');

			var someAnimal = Object.create(mix('animal'));
			expect(someAnimal).to.have.property('heartBeat');
			
			var beat = someAnimal.heartBeat()
			expect(beat).to.equal('dudum');
		});
		it('should add the mixin to the list of mixins',function(){
			var mix = maxine();

			function heartBeat(obj){return 'dudum';}

			mix('animal',heartBeat);

			expect(mix.mixins).to.have.property('animal');
		});
	})
	describe('#Create("name",...{objects}',function(){
		it('should create getters and setters from properties',function(){
			var mix = maxine();

			function heartBeat(obj){return 'dudum';}

			mix('animal',heartBeat,{legs:4});

			var instance = mix('animal').Create();
			mix('animal').bork = 'a';
			expect(instance).to.have.property('legs');
			expect(instance.legs).to.be.a.function;
			expect(instance.legs()).to.equal(4);
			expect(instance.legs(2)).to.equal(instance);
			expect(instance.legs()).to.equal(2);
		});
	});
	describe('#Create("name",..."name")',function(){
		it('should lookup mixins automatically',function(){
			var mix = maxine();
			var animalProps = {
				legs:4
			,	energy:10
			}
			var mammalProps = {
				fur:true
			,	sex:'male'
			}
			function heartBeat(obj){return 'dudum';}

			function breastFeed(obj,mammal){
				if(!mix.is(mammal,'mammal')){throw new Error(`can't feed non-mammals`);}
				if(obj.sex()!=='female'){throw new Error(`males can't breastfeed!`);}
				mammal.drinkMilk();
				let curr = obj.energy();
				obj.decrease('energy');
			}

			function drinkMilk(obj){
				obj.increase('energy');
				return obj;
			}

			function flap(obj){
				obj.increase('elevation');
			}

			mix('animal',heartBeat,animalProps);
			mix('mammal',mammalProps,breastFeed,drinkMilk,'animal');
			mix('bird',{elevation:0},flap,'animal');

			let mama = mix('mammal').Create().setProperties({sex:'female'});
			let papa = mix('mammal').Create();
			let child = mix('mammal').Create();
			let birdie = mix('bird').Create();

			mama.breastFeed(child);
			expect(child.energy()).to.equal(11);
			expect(mama.energy()).to.equal(9);

			function dadsCantProduceMilk(){
				papa.breastFeed(child);
			}
			expect(dadsCantProduceMilk).to.throw(Error);

			function momCantFeedABird(){
				mama.breastFeed(bird)
			}
			expect(momCantFeedABird).to.throw(Error);
		});
	});
	describe('#Create(...{objects})',function(){
		it('should create an anonymous mixin',function(){
			var mix = maxine();

			function heartBeat(obj){return 'dudum';}

			let animal = mix(heartBeat,{legs:4});

			var instance = animal.Create();
			
			expect(instance).to.have.property('legs');
			expect(instance.legs).to.be.a.function;
			expect(instance.legs()).to.equal(4);
			expect(instance.legs(2)).to.equal(instance);
			expect(instance.legs()).to.equal(2);
			expect(mix.mixins).to.be.empty;
		});
	});
	describe('Object instanciation',function(){
		it('should create instances through #Factory("name")',function(){
			var mix = maxine();

			function heartBeat(obj){return 'dudum';}

			mix('animal',heartBeat);

			var instance = mix.factory('animal');
			expect(instance).to.have.property('heartBeat')			
			
		});
		it('should create instances through #Create',function(){
			var mix = maxine();

			function heartBeat(obj){return 'dudum';}

			mix('animal',heartBeat);

			var instance = mix('animal').Create();
			expect(instance).to.have.property('heartBeat')
			
		});
	});
	describe('#is(object,string)',function(){
		it('should return true if the object passed is used in the mixin',function(){

			var mix = maxine();
			var animalProps = {
				legs:4
			,	energy:10
			}
			var mammalProps = {
				fur:true
			,	sex:'male'
			}
			
			mix('animal',animalProps);
			mix('mammal',mammalProps,'animal');

			let mama = mix('mammal').Create();

			expect(mix.is(mama,'animal')).to.be.true;
			expect(mix.is(mama,'mammal')).to.be.true;
			expect(mix.is(mama,'woman')).to.be.false;
		});
	});
	describe('convenience methods added to mixins',function(){
		describe('mixin.setProperties({properties})',function(){
			it('should call methods with passed argument if they are defined in the model',function(){
				var mix = maxine();
				let _organs = ['heart'];

				function heartBeat(obj){return 'dudum';}

				function organs(obj,add){
					if(add){
						_organs = _organs.concat(add);
						return obj;
					}
					return _organs;
				}

				mix('animal',heartBeat,organs,{lifeSpan:17,years:3});
				var instance = mix.factory('animal');

				instance.setProperties({lifeSpan:20,years:2,organs:['lungs','liver']});

				expect(instance.organs()).to.eql(['heart','lungs','liver']);
				expect(instance.lifeSpan()).to.equal(20);
				expect(instance.years()).to.equal(2)
			});
		});
		describe('mixin.increase(propName[,number]),mixin.decrease(propName[,number])',function(){
			it('should increase and decrease the property by the given number',function(){
				let mix = maxine();
				mix('geo',{x:10,y:10,width:50,height:50});
				let geo = mix('geo').Create();
				geo.increase('x');
				geo.increase('y',3);
				geo.decrease('width');
				geo.decrease('height',5);

				expect(geo.x()).to.equal(11);
				expect(geo.y()).to.equal(13);
				expect(geo.width()).to.equal(49);
				expect(geo.height()).to.equal(45);
			});
		});
		describe('mixin.toString',function(){
			it('should give a string detailing methods and mixins used',function(){
				var mix = maxine();
				var animalProps = {
					legs:4
				,	energy:10
				}
				var mammalProps = {
					fur:true
				,	sex:'male'
				}
				function heartBeat(obj){return 'dudum';}

				
				mix('animal',heartBeat,animalProps);
				mix('mammal',mammalProps,'animal');

				let mama = mix('mammal').Create();

				expect(mama+'').to.equal('mammal (animal): [fur,sex,heartBeat,legs,energy]')
			});
		});
	});
});