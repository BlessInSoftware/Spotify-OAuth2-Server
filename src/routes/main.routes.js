import dotenv from 'dotenv';
dotenv.config();
import { Router } from 'express';
import crypto from 'crypto';
import spotifyApi from '../clients/spotifyApi.js';

const scopes = process.env.CLIENT_SCOPES.split(',');

export const router = Router();

router.get('/', (req, res) => {
    res.send('If you want to learn more about this app, please visit: https://github.com/ClunkyTeam/Spotify-OAuth2-Server');
});

router.get('/login', (req, res) => {
    let url = (spotifyApi.createAuthorizeURL(
        scopes,
        crypto.randomBytes(16).toString('hex'),
        true
    ));
    res.redirect(url);
});

router.get('/callback', async (req, res) => {
    let credentials = (await spotifyApi.authorizationCodeGrant(req.query.code))?.body;
    res.redirect(`${process.env.CLIENT_REDIRECT_URL}?access_token=${credentials.access_token}&refresh_token=${credentials.refresh_token}&expires_in=${credentials.expires_in}&scope=${credentials.scope}&token_type=${credentials.token_type}`);
});

router.post('/access_token', async (req, res) => {
    try {
        spotifyApi.setRefreshToken(req.body.refresh_token);
        let credentials = await spotifyApi.refreshAccessToken();
        spotifyApi.setRefreshToken(undefined);
        res.send(credentials);
    } catch (err) {
        res.statusStatus(err.code).send(err.code);
    }
});

router.get('*', (req, res) => {
    res.redirect('/');
});