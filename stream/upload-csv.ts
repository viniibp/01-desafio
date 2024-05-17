import { parse } from "csv-parse";
import fs from "node:fs";

const csvPath = new URL("./tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ",",
  skip_empty_lines: true,
  fromLine: 2,
});

async function readCSV() {
  const parsedRows = stream.pipe(csvParse);

  for await (const row of parsedRows) {
    const [title, description] = row;

    const json = JSON.stringify({
      title,
      description,
    });

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });

    console.log(json);
  }
}

readCSV();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
