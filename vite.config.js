import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/go-fix/", // Add this line - replace 'go-fix' with your repository name
  plugins: [react()],
  assetsInclude: ["**/*.lottie"],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
