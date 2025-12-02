import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { connectWithRetry } from "./lib/connectWithRetry";
import { databaseConnect } from "./lib/databaseConnect";
import * as cookieParser from "cookie-parser";
import { WsAdapter } from "./sockets/adapters/ws.adapter";
import { wsAuthMiddleware } from "./sockets/common/ws-auth.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  // enable cookie parser
  app.use(cookieParser());

  // config cors, prefix and others here if needed
  app.enableCors({
    credentials: true,
    origin: ["http://localhost:3000", "https://talktive.vercel.app"],
  });

  // add 'api/v1' prefix to all routes
  app.setGlobalPrefix("api/v1");

  await databaseConnect();
  await connectWithRetry();

  const wsAdapter = new WsAdapter(app);
  app.useWebSocketAdapter(wsAdapter);

  const io = wsAdapter.createIOServer(5001);
  io.use(wsAuthMiddleware);

  app.listen(port || 5000, () => {
    console.log(`Talktive server is running on port ${port || 5000}`);
  });
}
bootstrap();
