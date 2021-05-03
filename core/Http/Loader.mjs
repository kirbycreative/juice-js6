import Path from '../Util/Path.mjs';

const ASSET_TYPES = {
    'script': ['js', 'mjs'],
    'stylesheet': ['css'],
    'image': ['jpg', 'png', 'gif', 'bmp'],
    'font': ['ttf', 'woff'],
    'document': ['html', 'txt']
}

class Loader {

    

    static async loadAll( ...urls ){
        return Promise.all( urls.map( url => Loader.load( url ) ) );
    }

    static load( url ){
        
        const ext = Path.ext( url );
        let loadType = 'document';

        for( let type in ASSET_TYPES ){
            if ( ASSET_TYPES[type].indexOf(ext) !== -1 ){
                loadType = type;
                break;
            }
        }
        return this[loadType]( url );

    }

    static image( url ){

        const img = new Image();

        return new Promise( (resolve, reject) => {
            img.onload = function(){
                resolve( img );
            };
            img.onerror = reject;
            img.src = url;
        });

    }

    static script( url ){

        const ext = Path.ext( url );

        const script = document.createElement('script');
        script.type = ext == 'js' ? 'text/javascript' : 'module';

        return new Promise( (resolve, reject) => {

            if (script.readyState) {//IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            } else {//Others
                script.onerror = reject;
                script.onload = resolve;
            }

            script.src = url;
        });
    }

    static stylesheet( url ){

        const link = document.createElement('link');
        link.type = 'text/css';

        return new Promise( (resolve, reject) => {

            if (link.readyState) {//IE
                link.onreadystatechange = function () {
                    if (link.readyState === "loaded" || link.readyState === "complete") {
                        link.onreadystatechange = null;
                        resolve();
                    }
                };
            } else {//Others
                link.onerror = reject;
                link.onload = resolve;
            }

            link.href = url;
        });

    }

    static document( url ){

        return new Promise( (resolve, reject) => {

        });

    }

}

export default Loader;