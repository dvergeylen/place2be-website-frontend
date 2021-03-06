import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

// Plugins
import scss from 'rollup-plugin-scss';
import svelte from 'rollup-plugin-svelte';
import json from '@rollup/plugin-json';

// Pre-processes
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/javascripts/bundle.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js',
    },
    plugins: [
      scss({
        output: 'public/build/bundle.css',
        failOnError: true,
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload('public'),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/javascripts/apps/dashboard.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/dashboard.js',
    },
    plugins: [
      scss({
        output: 'public/build/dashboard.css',
        failOnError: true,
      }),

      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: (css) => {
          css.write('public/build/dashboard-components.css');
        },
        generate: 'dom',
        preprocess: sveltePreprocess(),
      }),

      // Import json files in javascripts/ and components/ files
      json(),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/javascripts/apps/static.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/static.js',
    },
    plugins: [
      scss({
        output: 'public/build/static.css',
        failOnError: true,
      }),

      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: (css) => {
          css.write('public/build/static-components.css');
        },
        generate: 'dom',
        preprocess: sveltePreprocess(),
      }),

      // Import json files in javascripts/ and components/ files
      json(),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/javascripts/apps/credentials.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/credentials.js',
    },
    plugins: [
      scss({
        output: 'public/build/credentials.css',
        failOnError: true,
      }),

      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: (css) => {
          css.write('public/build/credentials-components.css');
        },
        generate: 'dom',
        preprocess: sveltePreprocess(),
      }),

      // Import json files in javascripts/ and components/ files
      json(),

      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        // eslint-disable-next-line global-require
        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        });
      }
    },
  };
}
