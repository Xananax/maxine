import has from './has';

export default function mixinToString(obj){
	if(!has(obj,'____meta',true)){throw new Error(`obj is not a mixin`);}
	let mixins = obj.____meta.mixins;
	let methods = obj.____meta.methods;
	let name = mixins[0];
	if(mixins.length>1){
		name+=' ('+mixins.slice(1).join(',')+')';
	}
	return name+': ['+methods.join(',')+']'
}