import path from "node:path";

// import { partytownVite } from '@builder.io/partytown/utils';
// import legacy from '@vitejs/plugin-legacy';
import glsl from "vite-plugin-glsl";

export default {
  server: {
    host: "localhost",
    port: 5173,
  },
  plugins: [
    // legacy(),
    glsl(),
    // partytownVite({
    //   dest: path.join(__dirname, 'dist', '~partytown')
    // })
  ],
};
