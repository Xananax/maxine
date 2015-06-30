import method from '../method';
import {addMixinProp} from '../meta';
import addUniques from '../utils/addUniques';

export default function mixInits(obj,otherInits){
	let inits = obj.____meta.inits;
	addUniques(inits,otherInits);
}