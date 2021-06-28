import qs from 'querystring';
import axi from 'axios';
import oauth from 'oauth';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

class OAuth {

  static v2 = {
    Google: {
      async getProfile(accessToken) {
        const [
          { data: userInfo },
          { data: userProfile },
        ] = await Promise.all([
          axi.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`),
          axi.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`),
        ]);

        return {
          ...userInfo,
          ...userProfile,
        };
      },
    },
  };
}

export default OAuth;
