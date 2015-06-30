import {has} from '../utils'

export default function addMixinProp(obj,propName){
	if(!has(obj,'____meta')){throw new Error(`${obj} is not a mixin`);}
	obj.____meta.methods.push(propName);
}