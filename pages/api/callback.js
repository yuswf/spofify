export default async function handler(req, res) {
    const response = await fetch(process.env.apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.clientId + ':' + process.env.clientSecret).toString('base64'),
        },
        body: new URLSearchParams({
            'code': req.query.code,
            'grant_type': 'authorization_code',
            'redirect_uri': process.env.callbackUrl
        })
    });
    const data = await response.json();

    if (data.error) {
        res.redirect('/?error=' + data.error_description);
    } else {
        res.redirect('/?token=' + data.access_token);
    }
}