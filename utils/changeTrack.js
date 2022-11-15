function ChangeTrack(token, uri) {
    fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            'context_uri': uri,
            'position_ms': 0
        })
    });
}

export default ChangeTrack;
