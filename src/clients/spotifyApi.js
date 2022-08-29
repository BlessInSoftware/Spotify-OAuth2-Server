import dotenv from 'dotenv';
dotenv.config();
import SpotifyWebApi from 'spotify-web-api-node';


export default new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.CLLIENT_REDIRECT_URI
});