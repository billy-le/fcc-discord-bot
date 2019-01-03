export const userInfoDocument = (user: any) => {
    if (user && user.displayName) {
        return (`
        <html>
        <head>
            <title>User Info</title>
        </head>
        <body>
            <h2>Hi, ${user.displayName}, you are logged in.</h2>
            <button onclick="location.href='/api/logout'">Logout</button>
        </body>
        </html>
    `);
    }
    return (`
        <html>
        <head>
            <title>User Info</title>
        </head>
        <body>
            <h2>No user is logged in.</h2>
            <button onclick="location.href='/'">Go Home</button>
        </body>
        </html>
    `);
};