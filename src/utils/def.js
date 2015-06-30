export default function def(obj,propName,val,visible){
	Object.defineProperty(obj,propName,{
		enumerable:!!visible
	,	configurable:true
	,	value:val
	});
}