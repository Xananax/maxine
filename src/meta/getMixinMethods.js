import {has} from '../utils'
export default function getMixinMethods(obj){
	if(!has(obj,'____meta',true)){throw new Error(`${obj} is not a mixin`);}
	let methods = obj.____meta.methods;
	return methods;
}