import {has} from '../utils';

export default function addMixinName(obj,mixinName){
	if(!has(obj,'____meta')){throw new Error(`${obj} is not a mixin`);}
	obj.____meta.mixins.push(mixinName);
}
