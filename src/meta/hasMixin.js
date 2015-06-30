import {has} from '../utils';

export default function hasMixin(obj,...mixinNames){
	if(!has(obj,'____meta')){throw new Error(`${obj} is not a mixin`);}
	let mixins = obj.____meta.mixins;
	let i = 0, l = mixinNames.length;
	while(i<l){
		let mixinName = mixinNames[i++];
		if(mixins.indexOf(mixinName)<0){return false;}
	}
	return true;
}