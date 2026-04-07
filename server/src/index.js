import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { buildApp } from "./app.js";

async function main() {
  await connectDb();
  const app = buildApp();
  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
