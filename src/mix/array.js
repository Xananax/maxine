import mixinProp from './prop';

export default function mixinArray(obj,arr,mixin){
	arr.forEach(function(item){
		mixinProp(obj,item,null,mixin);
	});
}