import { defineBuildConfig, MkdistBuildEntry } from "unbuild"

let src: MkdistBuildEntry = { builder: "mkdist", input: "./src", outDir: "./dist" }
let firestore: MkdistBuildEntry = {
    builder: "mkdist",
    input: "./src/firestore",
    outDir: "./dist/firestore",
}

let esm: MkdistBuildEntry[] = [src, firestore].map(entry => ({
    ...entry,
    format: "esm",
}))

let cjs: MkdistBuildEntry[] = [src, firestore].map(entry => ({
    ...entry,
    format: "cjs",
    ext: "cjs",
}))

export default defineBuildConfig({
    entries: [...cjs, ...esm],
    declaration: true,
})
