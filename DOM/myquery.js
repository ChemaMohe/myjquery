(function(){
	$ = function(selector){
		//get elements from the page using d.qsa
		//go trougth then and copy to this
		//also set a length of properties
		if( !(this instanceof $)){
			return new $(selector);
		}
		var els;
		//If selector is a string
		if(typeof selector === "string")
		{
			els = document.querySelectorAll(selector);
		}
		else{// Assume array
			els = selector
		}
		this.length = els.length
		for(var i = 0; i< els.length;i++){
			this[i] = els[i];		
		}
		//Array.prototype.push.apply(this,elements);
	};
	$.extend = function(target,object){
		for(var prop in object){
			if(object.hasOwnProperty(prop)){
				target[prop] = object[prop];
			}
		}
		return target;
	};

	//Static methosds 
	var isArrayLike = function(obj) {
		if(typeof obj.length === "number"){
			if(obj.length === 0)
			{
				return true;
			}
			else if(obj.length > 0){
				return (obj.length - 1) in obj;
			}
		}
		else{
			return false;
		}

	};


	$.extend($,{
		isArray: function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		each: function(collection, cb) {
			if(isArrayLike(collection)){
				for(var i = 0; i < collection.length; i++){
					var value = collection[i];
					cb.call(value,i, value);
				}
			}
			else{
				for(var prop in collection){
					if(collection.hasOwnProperty(prop)){
						var value = collection[prop];
						cb.call(value, prop, value)
					}
				}
				
			}
			return collection;
		},
		makeArray:function(arr) {
			var array = [];
			$each(arr, function(i,value)
			{
				array.push(value);
			})
			return array;
		},
		proxy: function(fn,context) {
			return function(){           
				return fn.apply(context,arguments);
			};
		}
	});
	var getText = function(el){
		var txt = "";
		$.each(el.childNodes, function(i,childNode){
			if(childNode.nodeType === Node.TEXT_NODE){
				txt += childNode.nodeValue;
			}
			else if(childNode.nodeType === Node.ELEMENT_NODE) {
				txt += getText(childNode);
			}
		});
		return txt;
	};
	var makeTraverser = function(cb){
		return function(){
			var elements = [], args = arguments;
			$.each(this, function(i,el)
			{
				var ret = cb.apply(el,arguments);
				if(ret && isArrayLike(ret)){
					[].push.apply(elements, ret);
				}else{
					elements.push(ret);
				}
			});
			return $(elements);
		}
	};
	$.extend($.prototype,{
		text: function(newText){
			if(arguments.length){
				this.html("");
				return $.each(this, function(i,el){
					var text = document.createTextNode(newText);
					el.appendChild(text);
				})
			}else{
				return this[0] && getText(this[0]);
			}
		},
		html: function(newHtml){
			if(arguments.length){
				$.each(this,function(i,el){
					el.innnerHTML = newHtml;
				});	
				return this;
			}
			else{
				return this[0] && this[0].innnerHTML;
			}
		},
		val: function(text){
			if(arguments.length){
				$.each(this,function(i,el){
					el.value = newHtml;
				});	
				return this;
			}
			else{
				return this[0] &&  this[0].value;
			}
		},
		find: function(selector){
			//create array of all itmems 

			var elements = [];

			// get elements that are within element than matches
			$.each(this, function(i,el){
				var els = el.querySelectorAll(selector);
				[].push.apply(elements,els);
			});
			return	$(elements);
		},
		next: makeTraverser(function(){
			var current = this.nextSibling;

			while(current && current.nodeType !== 1)
			{
				current = current.nextSibling;
			}  
			if(current){
				return current;
			}
		}),
		prev:  makeTraverser(function(){

			var current = this.previousSibling;

			while(current && current.nodeType !== 1)
			{
				current = current.previousSibling;
			}  
			if(current){
				return current;
			}
		}),
		/*parent: function(){
			var elements = [];
			$.each(this, function(i,el)
			{
				elements.push(el.parentNode);
			});
			return $(elements);
		},*/
		parent: makeTraverser(function(){
			return this.parentNode;
		}),
		children: makeTraverser(function(){
			return this.children;
		}),
		attr:  function(attr,val){
			if(arguments.length>1){
				return $.each(this,function(i,el){
					el.setAttribute(attr,val);
				});	
			}
			else{
				return this[0] && this[0].getAttribute(attr);
			}
		},
		css: function(cssProp,val){
			if(arguments.length>1){
				return $.each(this,function(i,el){
					el.style[cssProp] = val;
				});	
			}
			else{
				return this[0] && document.defaultView.getComputedStyled(this[0]).getPropertyValue(cssProp);
			}
		},
		width: function(){
			var clientWidth = this[0].clientWidth;
			var leftPadding = this.css('padding-left'),
				rightPadding = this.css('padding-right');

			return clientWidth - parseInt(leftPadding) - parseInt(rightPadding);
		},
		offset: function(){
			var offset = this[0].getBoundingClientRect();
			return{
				top: offset.top + window.pageYOffset,
				left: offset.left + window.pageXOffset
			}; 
		},
		hide: function(){
			return this.css("display","none");
		},
		show: function(){
			return this.css("display","");
		},
		//Events
		bind: function(eventName, handler){
			return $.each(this, function(i,el){
				el.addEventListener(eventName,handler,false);
			})
		},
		unbind: function(eventName, handler){
			return $.each(this, function(i,el){
				el.removeEventListener(eventName,handler,false);
			})
		},
		on: function(eventType, selector, handler){
			return this.bind(eventType, function(ev){
				var cur = ev.target;
				do {
					if($([cur]).has(selector).length){
						handler.call(cur,ev);
					}
					cur=cur.parentNode;
				} while (curr && curr!== ev.currentTarget);
			});
		},
		off: function(eventType,selector,handler) {},
		data: function(propName, data) {},

		//Extra
		addClass: function(className){},
		removeClass: function(className) {},
		append: function(element) {},
	
	});
	$.fn = $.prototype;
})();