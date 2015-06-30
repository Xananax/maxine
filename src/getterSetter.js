import {has,def,func,type} from './utils';
import method from './method';

export default function getterSetter(obj,propName,propValue){
	let gs = func(propName
	,	'obj,val',
		`if(!Object.prototype.hasOwnProperty.call(obj,'_${propName}')){`+
			`Object.defineProperty(obj,'_${propName}',{`+
				`enumerable:true`+
				`,configurable:true`+
				`,writable:true`+
				`,value:_args[0]`+
			`})`+
		'}'+
		'if(!arguments.length || typeof val === \'undefined\'){'+
			`return obj._${propName};`+
		'};'+
		`obj._${propName}=val;`+
		'return obj;'
	,	propValue
	)
	method(obj,propName,gs,type(propValue));
}