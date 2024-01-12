import {resolve} from 'path'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  // ...
  resolve:{
	alias: {
		'@': fileURLToPath(new URL('./src', import.meta.url)),
	}
  },
  build:{
	lib:{
		entry: resolve(__dirname, 'src/main.ts'),
		name: 'fhir-tool',
		fileName: 'fhir-tool',
	}
  },
  plugins: [dts()]
})