export default function func(propName,argsStr,fnStr,...args){
	return new Function('_args',`return function ${propName}(${argsStr}){${fnStr}}`)(args)
}