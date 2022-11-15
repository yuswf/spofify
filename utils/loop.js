async function loop(state, token) {
    fetch('https://api.spotify.com/v1/me/player/repeat?state=' + state, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    });
}

export default loop;
