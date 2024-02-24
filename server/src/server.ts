import server from "./app";
import databaseConnection from "./config/database";
const port = process.env.PORT || 5050;

const bootStrap = () => {
  server.listen(port, async () => {
    console.log(`Talktive express server is running on port:${port}`);
    await databaseConnection();
  });
};

bootStrap();
