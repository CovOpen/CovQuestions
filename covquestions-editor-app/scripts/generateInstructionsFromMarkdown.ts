import * as fs from "fs";
import * as path from "path";

const instructionsInputPath = path.join(__dirname, "../INSTRUCTIONS.md");
const instructionsOutputPath = path.join(__dirname, "../src/generatedInstructionsFromMarkdown.ts");

const instructionsContent = fs.readFileSync(instructionsInputPath);
const escapedInstructions = instructionsContent.toString().split("`").join("\\`");

fs.writeFileSync(
  instructionsOutputPath,
  "export const generatedInstructionsFromMarkdown = `" + escapedInstructions + "`"
);
