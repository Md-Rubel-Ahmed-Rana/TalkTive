import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");
  app.listen(port || 5000, () => {
    console.log(`Talktive server is running on port ${port || 5000}`);
  });
}
bootstrap();
