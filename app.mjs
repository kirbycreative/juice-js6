import JuiceJS from './juice6.mjs';

const juice = new JuiceJS();

juice.on( 'ready', function( value ) {
    console.log( 'Juice Ready', value, this  );
});

console.log(juice);