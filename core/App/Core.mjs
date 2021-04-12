import Emitter from "../Event/Emitter.mjs";
import Assets from "./Assets.mjs";

class AppCore extends Emitter {

    constructor( options ){
        this.assets = new Assets();
    }


}

export default AppCore;