
var doc = document.documentElement;
var body = document.body;
var removeFn = window.removeEventListener ? 'removeEventListener' : 'detachEvent';
var addFn = window.addEventListener ? 'addEventListener' : 'attachEvent';
var prefix = window.addEventListener ? "" : "on";

class DomEvent {

    normalize( event ){

		event.$ = {};
		event.target = (window.event) ? window.event.srcElement : event.target;
		
		if ( event.pageX == null && event.clientX != null ) {
			event.pageX = event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0 );
			event.pageY = event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0 );
        }
        
		const targetRect = event.target.getClientBoundingRect();
		event.targetX = event.pageX - targetRect.left;
		event.targetY = event.pageY - targetRect.top;
			
		return event;
		
	};

    cancel( e ){
		e.stopPropagation();
		e.preventDefault();
	}

    add( el, type, fn, capture ){
		el[addFn]( prefix + type, fn, capture || false );
		return fn;
    }

    remove( el, type, fn, capture ){
		el[removeFn]( prefix + type, fn, capture || false );
		return fn;
	}
    
}

class ElementEmitter extends DomElement {
	
}