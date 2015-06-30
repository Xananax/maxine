export default function addUniques(arr,otherArr){
	otherArr.forEach(function(item){
		if(arr.indexOf(item)<0){arr.push(item);}
	});
}