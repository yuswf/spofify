async function getLikedTracks(token) {
    try {
        const items = [];

        for (let i = 0; i < 4; i++) {
            try {
                let offset = i * 50;

                const response = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const data = await response.json();

                items.push(...data.items);
            } catch (e) {
                return items;
            }
        }

        return items;
    } catch (e) {
        return false;
    }
}

export default getLikedTracks;
