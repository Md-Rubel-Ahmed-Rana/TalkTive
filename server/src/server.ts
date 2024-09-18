import server from "./app";
import databaseConnection from "./config/database";
const port = process.env.PORT || 5051;

const bootStrap = () => {
  server.listen(port, async () => {
    console.log(`Talktive server is running on port:${port}`);
    await databaseConnection();
  });
};

bootStrap();
