// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/Fisheye/",
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				secondary: resolve(__dirname, "src/pages/photographer.html"),
			},
		},
	},
});
