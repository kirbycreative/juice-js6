import EventEmitter from '../Event/Emitter.mjs'; 
import Cookies from './Cookies.mjs'; 
//window.screen.availWidth
//window.screen.availHeight

class ClientWindow extends EventEmitter{

    constructor(){
        this.cookies = Cookies;
        this.initialize();
    }

    get width(){
        return window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    }

    set width( width ){
        window.resizeTo( width, this.height );
    }

    get height(){
        return window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    }

    set height( height ){
        window.resizeTo( this.width, height );
    }

    initialize(){

        window.addEventListener("resize", () => {
            this.emit("resize", this.width, this.heihgt );
        });

        window.addEventListener( "orientationchange", () => {
            var orientation = window.orientation;
            this.emit( "orientationchange", window.orientation );
        });

        return false;
    }

}


export default new ClientWindow();