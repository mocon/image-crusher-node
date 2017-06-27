import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'index.js',
    format: 'iife',
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**'
        })
    ],
    dest: 'dist/index.js'
};
