import mixinProp from './prop';

export default function mixinObject(obj,props,mixin){
	for(let n in props){
		mixinProp(obj,props[n],n,mixin);
	}
}