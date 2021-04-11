import JuiceJS from './juice6.mjs';

const juice = new JuiceJS({
    paths: {
        views: {

        },
        modules: {
            lib: '/js/lib'
        }
    }
});

juice.on( 'ready', function( value ) {
    console.log( 'Juice Ready', value  );
});


juice.require('App/Router', 'Data/Cache', 'Data/Definable').then( console.log );

console.log(juice);