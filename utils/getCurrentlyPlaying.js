async function getCurrentlyPlaying(token) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });

        return await response.json();
    } catch (e) {
        return false;
    }
}

export default getCurrentlyPlaying;
