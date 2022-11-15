/** @type {{reactStrictMode: boolean, domains: string[], env: {codes: string[], authorizeUrl: string, clientId: string, apiUrl: string, clientSecret: string, callbackUrl: string}}} */
const nextConfig = {
    domains: ['sdk.scdn.co'],
    reactStrictMode: true,
    env: {
        codes: [
            'zvRA6OUNJ2',
            'XqKJu58j36',
            'fzMMt9wesz',
            'ckpxLbdKYE',
            'NmLN91iCbS',
            'bGWmjjgl3b',
            '6NLo2uSHPE',
            'bPwxPGSSka',
            'lxSEY9V6ws',
            'Kd1a14ybXM',
            'vJhNg0dwzI',
            'I4KLa1DfRK',
            'QAr1OmkxdO',
            'Wdu7zVrSSf',
            'g51DaTWejA'
        ],
        apiUrl: 'https://accounts.spotify.com/api/token',
        authorizeUrl: 'https://accounts.spotify.com/authorize',
        clientId: 'f319d999cc804ac196a985d24a621404',
        clientSecret: '9324168b688d4a96a7a00d706e6888dd',
        callbackUrl: 'http://localhost/api/callback'
    }
}

module.exports = nextConfig;
