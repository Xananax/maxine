export default function provide(proto){
	proto = proto || null;
	return Object.create(proto);
}