import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  let token = req.header('x-auth-token');

  if (!token) {
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.HT_jwtPrivateKey);
    // putting the decoded JWT details in the req
    // so endpoints can access it without querying User collection
    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
}
