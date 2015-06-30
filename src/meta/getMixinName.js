import {has} from '../utils'

export default function getMixinName(obj){
	if(!has(obj,'____meta')){throw new Error(`${obj} is not a mixin`);}
	return obj.____meta.mixins[0];
}