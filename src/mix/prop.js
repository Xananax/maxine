import mixinMixin from './mixin'
import {addMixinProp} from '../meta'
import getterSetter from '../getterSetter'
import method from '../method'
import mixinObject from './object'
import mixinArray from './array'
import mixInits from './init'

export default function mixinProp(obj,prop,propName,mixin){
	let t = typeof prop;
	if(t === 'string' && !propName){
		return mixinMixin(obj,prop,mixin);
	}
	if(t === 'function'){
		if(!propName){propName = prop.name;}
		if(propName==='init'){
			return mixInits(obj,[prop]);
		}
		addMixinProp(obj,propName);
		return method(obj,propName,prop);
	}
	if(Array.isArray(prop)){
		return mixinArray(obj,prop,mixin);
	}
	if(!propName && (!prop.constructor || prop.constructor === Object)){
		return mixinObject(obj,prop,mixin);
	}
	if(propName){
		/**/
		if(propName[0]==='_'){
			propName = propName.slice(1);
			addMixinProp(obj,propName);
			obj[propName] = JSON.parse(JSON.stringify(prop));
			return;
		}
		/**/
		addMixinProp(obj,propName);
		return getterSetter(obj,propName,prop);
	}
	throw new Error(`dunnow what to do with ${prop}`)
}