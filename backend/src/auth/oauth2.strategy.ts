import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import axios from "axios";

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, "oauth2") {
  constructor(private readonly config: ConfigService) {
    const authorizationURL = config.get<string>("GOOGLE_AUTHORIZATION_URL");
    const tokenURL = config.get<string>("GOOGLE_TOKEN_URL");
    const clientID = config.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = config.get<string>("GOOGLE_CLIENT_SECRET");
    const callbackURL = config.get<string>("GOOGLE_CALLBACK_URL");

    super({
      authorizationURL,
      tokenURL,
      clientID,
      clientSecret,
      callbackURL,
      scope: ["profile", "email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    params: any
  ): Promise<any> {
    console.log("🔵 [OAuth2Strategy] validate() called");
    console.log("🟢 accessToken:", accessToken);
    console.log("🟡 refreshToken:", refreshToken);
    console.log("🟣 params returned from Google:", params);
    try {
      console.log(
        "🌐 Fetching Google User Info from:",
        this.config.get("GOOGLE_USERINFO_URL")
      );

      const { data } = await axios.get(this.config.get("GOOGLE_USERINFO_URL"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          grant_type: "authorization_code",
          access_type: "offline",
          prompt: "consent",
        },
      });
      console.log("🟩 Google User Info Received:", data);

      const user = {
        email: data.email,
        name: data.name,
        profilePicture: data.picture,
      };

      console.log("✅ Final User Object:", user);

      return user;
    } catch (error) {
      console.error("❌ [OAuth2Strategy] Error fetching Google user info:");

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else {
        console.error("Message:", error.message);
      }

      throw new HttpException(
        error?.message || "Failed to login with Google",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
