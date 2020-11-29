import User from '../models/user';
import { BadRequestError } from '../utils/errors';

const auth = (req, res, next) => {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) {
            throw new BadRequestError(error);
        }
        if (!user) {
            return res.json({
                error: true
            });
        }

        req.token = token;
        req.user = user;
        next();
    })
}

export { auth };