//05 Context
DOT = function(obj,prop){
	if(obj.hasOwnPoperty(prop)){
		return obj[prop];
	}
	//otherwise keep walking up proto chain
	else if(obj.__proto__) {
		return DOT(obj.__proto__, prop);
	}
	else{
		return undefined;
	}
};
//05 Context 
DOTCALL = function(obj, prop, args){
	var fn = DOT(obj,prop);

	if(fn){
		return fn.apply(obj,args);
	}
};
//06 Prototypes
NEW = function(constructor, args){
	//create new object
	//set new object's __proto__
	//invoke our contructor with our new object as context
	//return new object
	var o = {};
	o.__proto__ = constructor.prototype;
	constructor.apply(o, args);
	return o;

};

INSTACEOF = function(obj,constructor){

	if(obj.__proto__ == constructor.prototype)
		return true;
	)
	else if (obj.__proto__){
		return INSTACEOF(obj.__proto__, constructor);
	}
	else{
		return false;
	}
};