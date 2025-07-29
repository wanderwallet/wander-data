#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Minifies JSON files and creates .min.json versions
 * Usage: node scripts/minify-json.js [file1.json] [file2.json] ...
 * If no files specified, processes all .json files in tokens/ directory
 */

function minifyJson(inputFile) {
  try {
    // Skip if already a minified file
    if (inputFile.endsWith(".min.json")) {
      console.log(`⏭️  Skipping already minified file: ${inputFile}`);
      return null;
    }

    // Read and parse JSON
    const jsonContent = fs.readFileSync(inputFile, "utf8");
    const parsedJson = JSON.parse(jsonContent);

    // Create minified version
    const minifiedJson = JSON.stringify(parsedJson, null, 0);

    // Determine output filename
    const dir = path.dirname(inputFile);
    const basename = path.basename(inputFile, ".json");
    const outputFile = path.join(dir, `${basename}.min.json`);

    // Write minified version
    fs.writeFileSync(outputFile, minifiedJson);

    console.log(`✅ Minified: ${inputFile} → ${outputFile}`);

    // Return the output file so lint-staged can stage it
    return outputFile;
  } catch (error) {
    console.error(`❌ Error minifying ${inputFile}:`, error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const generatedFiles = [];

  if (args.length === 0) {
    // No arguments provided, process all JSON files in tokens directory
    const tokensDir = path.join(__dirname, "..", "tokens");
    if (fs.existsSync(tokensDir)) {
      const jsonFiles = fs
        .readdirSync(tokensDir)
        .filter((file) => file.endsWith(".json") && !file.endsWith(".min.json"))
        .map((file) => path.join(tokensDir, file));

      console.log(`🔍 Found ${jsonFiles.length} JSON files to minify`);
      jsonFiles.forEach((file) => {
        const outputFile = minifyJson(file);
        if (outputFile) generatedFiles.push(outputFile);
      });
    }
  } else {
    // Process specified files (from lint-staged)
    const filesToProcess = args.filter(
      (file) =>
        file.includes("/tokens/") &&
        file.endsWith(".json") &&
        !file.endsWith(".min.json")
    );

    if (filesToProcess.length > 0) {
      console.log(
        `🔍 Processing ${filesToProcess.length} staged JSON files from tokens folder`
      );
      filesToProcess.forEach((file) => {
        const outputFile = minifyJson(file);
        if (outputFile) generatedFiles.push(outputFile);
      });
    } else {
      console.log("ℹ️  No relevant JSON files to process");
    }
  }

  // For lint-staged v16: output generated files so they can be staged
  if (args.length > 0 && generatedFiles.length > 0) {
    // When called by lint-staged, output each generated file on its own line
    generatedFiles.forEach((file) => console.log(file));
  } else if (generatedFiles.length > 0) {
    console.log("📝 Generated minified files:");
    generatedFiles.forEach((file) => console.log(file));
  }

  if (args.length === 0) {
    console.log("🎉 JSON minification complete!");
  }
}

if (require.main === module) {
  main();
}

module.exports = { minifyJson };
