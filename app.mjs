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

const Router = await juice.module('App/Router');

console.log(juice);