/*
* 
{
    tag: "",
    class: "",
    classes: [],
    id: "",
    attrs: {},
    data: {},
    children: []
}
*/

class DomBuilder {

    static build( domObject, mapped={} ){
       // console.log(domObject);
        const element = document.createElement( domObject.tag || 'div' );
        
        if( domObject.id ) element.id = domObject.id;
        
        if( domObject.class || domObject.classes ){
            element.className = domObject.class || domObject.classes.join(' ');
        }

        if( domObject.attrs ){
            for( let attr in domObject.attrs ){
                element.setAttribute( attr, domObject.attrs[attr] );
            }
        }

        if( domObject.html ){
            element.innerHTML = domObject.html;
        }

        if( domObject.text !== undefined ){
            element.innerText = domObject.text;
        }

        if( domObject.ref ){
            mapped[domObject.ref] = element;
        }

        if( domObject.children && domObject.children.length ){
            for( let i=0;i<domObject.children.length; i++ ){
                domObject.children[i].parent = element;
                DomBuilder.build( domObject.children[i], mapped );
            }
        }

        if( domObject.parent ){
            domObject.parent.appendChild( element );
        }

        return { element: element, refs: mapped };

    }

}

export default DomBuilder;