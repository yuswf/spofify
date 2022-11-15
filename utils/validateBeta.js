const codes = process.env.codes;

function check(code) {
    return codes.includes(code);
}

export default check;
