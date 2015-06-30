import {def,addUniques} from '../utils';
import {hasMethod,addMixinProp,getMixinName,addMixinName,getMixinMethods} from '../meta';
import mixInits from './init';
import method from '../method';

export default function mixinMixin(obj,mixinName,mixin){
	let m = mixin(mixinName);
	let methods = getMixinMethods(m);
	methods.forEach(function(n){
		let prop = m[n];
		if(hasMethod(obj,n) && n!=='init'){
			throw new Error(`method ${n} is already defined on this mixin`);
		}
		if(typeof prop === 'function'){			
			addMixinProp(obj,n);
			def(obj,n,prop);
		}else{
			addMixinProp(obj,n);
			obj[n] = JSON.parse(JSON.stringify(prop));
		}
	});
	addUniques(obj.____meta.mixins,m.____meta.mixins);
	mixInits(obj,m.____meta.inits);
}