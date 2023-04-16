import * as dotenv from 'dotenv';

export default function () {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '../../.env.development' });
  } else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '../../.env.test' });
  } else if (process.env.NODE_ENV !== 'production') {
    // in real production, we will use actual env variables, not .env
    dotenv.config();
  }
  // TODO: only run program if 2 env variables are there
  //   HT_jwtPrivateKey;
  //   HT_mongoURI;
}
