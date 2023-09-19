import { serialize } from 'cookie';
import express from 'express';
const router = express.Router();

// function logout(req, res) {
//   const { cookies } = req;
//   const token = cookies.token;
//   if (!token) {
//     return res.status(401).json({
//       status: 'error',
//       error: 'Unauthorized',
//     });
//   }

//   const serialized = serialize('token', null, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: strictTransportSecurity,
//     maxAge: -1,
//     path: '/',
//   });
//   res.setHeader('Set-Cookie', serialized);
//   res.status(200).json({
//     status: 'success',
//     message: 'Logged out',
//   });

// }

router.post('/', (req, res) => {
  const { cookies } = req;
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      error: 'Unauthorized',
    });
  }

  const serialized = serialize('token', null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
  res.status(200).json({
    status: 'success',
    message: 'Logged out',
  });
});

export default router;
