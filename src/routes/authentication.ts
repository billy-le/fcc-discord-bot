import { Application, Request, Response } from 'express';
import passport from 'passport';
import { userInfoDocument } from '../views/userInfo';

module.exports = (app: Application) => {
    app.get('/auth/github',
        passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/error' }),
        (req: Request, res: Response) => {
            // Successful authentication
            res.redirect('/api/current_user');
        });

    app.get('/api/logout', (req: Request, res: Response) => {
        // This method is attached by Express
        req.logout();
        res.redirect('/api/current_user');
    });

    app.get('/api/current_user', (req: Request, res: Response) => {
        res.status(200).send(userInfoDocument(req.user));
    });
};