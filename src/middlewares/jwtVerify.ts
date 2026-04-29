import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.body.token;

  if (!token) {
    return res.status(401).send({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.jwt = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }
}
