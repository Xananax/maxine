import {has,def,func} from './utils';

export default function method(obj,propName,fn,type){
	if(!fn){fn = propName;propName = fn.name;}
	if(!propName){throw new Error(`you must provide a property name of a named function`)}
	if(has(obj,propName)){throw new Error(`${obj} already has method ${propName}`)}
	let wrapper = func(propName
	,	''
	,	`var fn=_args[0],i=0,l=arguments.length,ar=Array(l);`+
		`while(i<l){ar[i]=arguments[i++];}`+
		`return fn.apply(this, [this].concat(ar));`
	,	fn
	)
	wrapper.fn = fn;
	if(type){wrapper.type = type;}
	else if(fn.type){wrapper.type = fn.type;}
	def(obj,propName,wrapper);
	return obj;
}