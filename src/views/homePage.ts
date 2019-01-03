export const homeDocument = () => (`
    <html>
    <head>
        <title>Home</title>
    </head>
    <body>
        <h2>Please login.</h2>
        <button onclick="location.href='/auth/github'">Signin with Github</button>
    </body>
    </html>    
`);