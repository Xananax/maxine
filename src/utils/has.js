export default function has(obj,prop,broad){
	if(broad){return (typeof obj[prop] !== 'undefined');}
	return Object.prototype.hasOwnProperty.call(obj,prop);
}