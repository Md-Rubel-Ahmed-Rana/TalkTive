import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { connectWithRetry } from "./lib/connectWithRetry";
import { databaseConnect } from "./lib/databaseConnect";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  // config cors, prefix and others here if needed
  app.enableCors({
    credentials: true,
    origin: ["http://localhost:3000", "https://talktive.vercel.app"],
  });

  // add 'api/v1' prefix to all routes
  app.setGlobalPrefix("api/v1");

  await databaseConnect();
  await connectWithRetry();

  app.listen(port || 5000, () => {
    console.log(`Talktive server is running on port ${port || 5000}`);
  });
}
bootstrap();
