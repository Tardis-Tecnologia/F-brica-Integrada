import { createApp } from "./http.js";

const port = Number(process.env.PORT ?? 8787);
const app = createApp();
app.listen(port, () => {
  console.log(`fabrica-integrada-core listening on :${port}`);
});
