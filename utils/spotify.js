function spotify(router) {
    const scopes = [
        'streaming',
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'user-follow-read',
        'user-read-currently-playing',
        'user-library-read',
        // 'playlist-read-public',
        'user-top-read',
        'user-read-recently-played',
        'user-modify-playback-state'
    ];
    const url = process.env.authorizeUrl + '?' +
        'response_type=code' +
        `&client_id=${process.env.clientId}` +
        `&scope=${encodeURIComponent(scopes.join(' '))}` +
        `&redirect_uri=${encodeURIComponent(process.env.callbackUrl)}`;

    router.push(url);
}

export default spotify;
