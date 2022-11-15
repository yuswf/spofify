async function check(token) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    /*
    .then(res => res.json())
    .then(res => {
        if (res.error) return result.push(res.error);

        result.push(res, true);
    });
    */

    return await response.json();
}

export default check;
