let toString = Object.prototype.toString;

export default function betterTypeOf(input) {
	if(typeof input === 'undefined'){return 'undefined';}
	return toString.call(input).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
}