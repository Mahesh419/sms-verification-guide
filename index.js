const app = require("./app");
const mongoose = require("./config/mongoose");

const PORT = process.env.PORT || 5000;

async function StartServer() {
  try {
    await mongoose();
    server = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Fail to start server: ${error}`);
    process.exit(-1);
  }
}

StartServer();
