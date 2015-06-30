import getMixinMethods from './getMixinMethods'

export default function hasMethod(obj,methodName){
	let methods = getMixinMethods(obj);
	return (methods.indexOf(methodName)>=0)
}