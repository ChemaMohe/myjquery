Animal = function(name) {
	this.name = name;
}
Animal.prototype.eats = function ()
{
	return this.name + "is eating";
}
Chordate = function(name) {
	Animal.call(this,name);
}


var Dog = function(){}; 
var pup = new Dog();

Animal = {
	init: function(name){
		this.name = name;
	},

	eats: function(){
		return this.name + "is eating.";
	}
}
Chordate = Object.create(Animal,{
	hasSpine: {value: true}
});