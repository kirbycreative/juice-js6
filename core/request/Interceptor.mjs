import EventEmitter from '../Event/Emitter.mjs';

function findLink( el ){
    if ( el.tagName == 'A' && el.href ) {
        return el.href;
    } else if ( el.parentElement ) {
        return findLink( el.parentElement );
    } else {
        return null;
    }
}


class RequestInterceptor extends EventEmitter {

    defaults = {
        xhrOpen: window.XMLHttpRequest.prototype.open
    };

    constructor(){

        super();

        const self = this;

        function clickListener( e ){
            const link = findLink( e.target );
            if( link ){
                self.linkClicked( e.target, link, e );
            }
            return false;
        }

        //document.addEventListener('click', clickListener, false);

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
              });
            });
          }

        window.addEventListener("beforeunload", function(event) {
            console.log( document.activeElement.href );
            window.location = "/";
            event.returnValue = null;
            event.preventDefault();
            
            return false;
        });

        window.addEventListener('fetch', function(event) {
            console.log( 'Fetch Request URL', event.request.url );
        });

        window.addEventListener('install', function(event) {
            event.waitUntil(self.skipWaiting());
        });

    }

    linkClicked( element, link, event ){
        console.log( link, element );
        event.preventDefault();
    }

    XHR(){

        const self = this;
        
        window.XMLHttpRequest.prototype.open = function( method, url, async, user, password ) {
            console.log( 'XHR Intercepted', method, url, async, user, password );
            
            // do something with the method, url and etc.
            this.addEventListener('load', function() {
            // do something with the response text
            console.log('load: ' + this.responseText);
            });
                        
            return self.defaults.xhrOpen.apply( this, [ method, url, async, user, password ] );
        }

    }
}


export default RequestInterceptor;