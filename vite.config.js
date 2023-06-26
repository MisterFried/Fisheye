// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/Fisheye/", //Base path (ex: GitHub Pages)
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"), //Main page
				secondary: resolve(__dirname, "src/pages/photographer.html"), //Other pages
			},
		},
	},
});
