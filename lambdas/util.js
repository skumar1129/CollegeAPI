const getUserName = (headers) => {
    return headers.app_user_name;
}

const getLocation = (headers) => {
    return headers.location;
}

const getResponseHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*'
    }
}

module.exports = {
    getUserName,
    getResponseHeaders,
    getLocation
}