import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import axios from "axios";

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, "oauth2") {
  constructor(private config: ConfigService) {
    super({
      authorizationURL: config.get<string>("GOOGLE_AUTHORIZATION_URL"),
      tokenURL: config.get<string>("GOOGLE_TOKEN_URL"),
      clientID: config.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: config.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: config.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["profile", "email"],
    });
  }

  async validate(accessToken: string): Promise<any> {
    try {
      const { data } = await axios.get(this.config.get("GOOGLE_USERINFO_URL"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = {
        email: data.email,
        name: data.name,
        profilePicture: data.picture,
      };

      return user;
    } catch (error) {
      console.error(
        "Error fetching Google user info:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
