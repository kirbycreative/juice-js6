import global from "../Data/Global.mjs";
import Emitter from "../Event/Emitter.mjs";
import Assets from "./Assets.mjs";

export const name = 'app';

function test(){ return 'tested' }

const test2 = 10;

export { test, test2 };

class App extends Emitter {
    global = null;
    assets = null;
    constructor( options ){
        super();
        this.global = global;
        this.assets = new Assets();
    }


}

export default App;