import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
    entries: [
        "./src/index",
        // mkdist builder transpiles file-to-file keeping original sources structure
        {
            builder: "mkdist",
            input: "./src/firestore",
            outDir: "./dist/firestore",
        },
    ],

    declaration: true,
})
