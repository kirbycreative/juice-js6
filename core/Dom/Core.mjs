import Builder from './Builder.mjs';


class DomCore {

    static build( domObject ){
        return Builder.build( domObject );
    }

    static dl( terms ){
        const dl = {
            tag: 'dl'
        };
        const children = [];
        for( let term in terms ){
            const rchildren = [];
            
            rchildren.push({
                tag: 'dt',
                text: term
            });
            rchildren.push({
                tag: 'dd',
                text: terms[term],
                ref: term
            });
            const row = {
                children: rchildren
            };
            children.push( row );
        }

        dl.children = children;

        return dl;
    }

    static table( columns, data ){
        const table = {
            tag: 'table'
        };
        const children = [];
        for( let rowIdx of data ){
            const row = data[rowIdx];
            const rowChildren = [];
            for( let col in row ){
                rowChildren.push({
                    tag: 'td',
                    text: row[col]
                });
            }
            children.push({
                tag: 'tr',
                children: rowChildren
            });
        }

        table.children = children;

        return DomCore.build(table);
    }

}

export default DomCore;