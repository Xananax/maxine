import {provide,def,has,mixinToString} from './utils'
import mixinArray from  './mix/array'
import {getMixinMethods,addMixinName,runInit} from './meta'
import hasMixin from './meta/hasMixin'

function init(name,obj,mixinSpace){
	let factory = mixinSpace.factory;
	def(obj,'____meta',{mixins:[],methods:[],inits:[]});
	if(name){obj.____meta.mixins.push(name);}
	def(obj,'toString',function toString(){
		return mixinToString(this);
	});
	def(obj,'Create',function Create(...args){
		return factory(obj,...args);
	});
	def(obj,'setProperties',function setProperties(props){
		for(let n in props){
			if(this[n] && typeof this[n] == 'function'){
				this[n](props[n]);
			}
		}
		return this;
	});
	def(obj,'increase',function increment(prop,n){
		if(!this[prop] || (typeof this[prop]!=='function')){throw new Error(`method ${prop} does not exist`);}
		n = n || 1;
		var curr = this[prop]();
		this[prop](curr+n);
	});
	def(obj,'decrease',function increment(prop,n){
		if(!this[prop] || (typeof this[prop]!=='function')){throw new Error(`method ${prop} does not exist`);}
		n = n || 1;
		var curr = this[prop]();
		this[prop](curr-n);
	});
	return obj;
}

export default function mixinContext(){

	let mixins = provide(null);

	function factory(name,...args){
		let m = (typeof name == 'string') ? mixin(name) : name;
		let methods = getMixinMethods(m);
		let i = 0, l = methods.length;
		let obj = init(null,provide(null),mixin);
		while(i<l){
			let propName = methods[i++];
			let prop = m[propName];
			if(typeof prop === 'function'){
				obj[propName] = prop;
				continue;
			}
			obj[propName] = JSON.parse(JSON.stringify(prop));
		}
		obj.____meta.mixins = obj.____meta.mixins.concat(m.____meta.mixins);
		obj.____meta.methods = m.____meta.methods.slice();
		obj.____meta.inits = m.____meta.inits.slice();
		if(args[0]!==false){
			if(!args.length){args[0] = provide(null);}
			runInit(obj,...args);
		}
		return obj;
	}

	function make(name,methods){
		let obj = init(name,provide(null),mixin);
		mixinArray(obj,methods,mixin);
		return obj;
	}

	function mixin(name,...methods){
		if(!methods || !methods.length){
			if(has(mixins,name)){return mixins[name];}
			throw new Error(`mixin ${name} was not found`);
		}
		if(typeof name !== 'string'){return make(null,[name].concat(methods));}
		
		if(has(mixins,name)){throw new Error(`mixin ${name} already exists`);}
		let obj = make(name,methods);

		mixins[name] = obj;
		return obj;
	}

	mixin.behavesAs = function(obj,otherObj){
		for(let propName in otherObj){
			if(!has(obj,propName)){return false;}
		}
		return true;
	}

	mixin.is = function(obj,...mixinNames){
		if(!obj.____meta){throw new Error('object is not a mixin');}
		let mixins = obj.____meta.mixins;
		let l = mixinNames.length;
		if(!l){
			return mixins.slice();
		}
		while(l--){
			let mixinName = mixinNames[l];
			if((mixins.indexOf(mixinName)<0)){return false;}
		}
		return true;
	};
	mixin.mixins = mixins;
	mixin.factory = factory;
	return mixin;
}