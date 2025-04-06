import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import externals from 'rollup-plugin-node-externals';

const prod = process.env.NODE_ENV === 'production';

/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const config = [
  // e-fatura
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/index.cjs',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: './dist/index.mjs',
        format: 'esm',
        exports: 'named'
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
      externals({
        deps: true,
        devDeps: true,
        optDeps: true,
        peerDeps: true
      })
    ]
  },
  prod && {
    input: './src/index.ts',
    plugins: [dts()],
    output: {
      file: './dist/index.d.ts',
      format: 'es'
    }
  }
].filter(Boolean);

export default config;
