// @ts-check
import WebSocket, { WebSocketServer } from "ws";
import chokidar from "chokidar";
import { execSync } from "child_process";
import esbuild from "esbuild";
import alias from 'esbuild-plugin-alias';

const date = new Date().toString();
const isProd = process.env.NODE_ENV === "production";

const synchPublic = async () => {
  execSync("cp public/* dist/");
};
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);

const watchOptn = {
  // awaitWriteFinish: {stabilityThreshold:100, pollInterval:50},
  ignoreInitial: true,
};
async function build() {
  execSync("rm -rf dist/");
  execSync("mkdir dist");
  await synchPublic();
  console.time("build");
  const result = await esbuild.build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    inject: ["src/preact-shim.js"],
    minify: isProd,
    metafile: true,
    sourcemap: isProd ? false : "inline",
    outfile: "dist/bundle.js",
    incremental: !isProd,
    loader: {
      '.ttf':"file",
    },
    define: {
      "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
      "process.env.REACT_APP_BUILD_TIME": `"${date}"`,
    },
    plugins: [
      alias({
        "react": _require.resolve("preact/compat"),
        "react-dom/test-utils": _require.resolve("preact/test-utils"),
        "react-dom": _require.resolve("preact/compat"),
        "react/jsx-runtime": _require.resolve("preact/jsx-runtime"),
      }),
    ],
  });
  console.timeEnd("build");

  let text =
    result.metafile && (await esbuild.analyzeMetafile(result.metafile));
  console.log(text);

  if (!isProd) {
    const wss = new WebSocketServer({ port: 8081 });
    wss.on("connection", () => console.log(wss.clients.size));
    wss.on("close", () => console.log(wss.clients.size));
    const sendToClients = (
      /** @type {{ action: string; payload?: any }} */ message
    ) => {
      wss.clients.forEach(function each(
        /** @type {{ readyState: number; send: (arg0: string) => void; }} */ client
      ) {
        if (client.readyState === WebSocket.OPEN) {
          console.log("sending");
          client.send(JSON.stringify(message));
        }
      });
    };
    chokidar.watch("public", watchOptn).on("all", async (...args) => {
      console.log(args);
      await synchPublic();
      sendToClients({ action: "update-app" });
    });
    chokidar.watch("src", watchOptn).on("all", async (...args) => {
      console.log(args);
      try {
        await result.rebuild?.();
        sendToClients({ action: "update-app" });
      } catch (e) {
        console.error(e);
        sendToClients({ action: "error", payload: e.message });
      }
    });
  }
}

build();
