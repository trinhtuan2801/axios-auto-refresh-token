import { Box, Button, Typography } from '@mui/material';
import { apiPrivate, apiPublic } from './api/axios';

export default function App() {
  const login = () => {
    apiPublic
      .post(
        '/auth/login',
        { username: 'test1', password: '123456' },
        { withCredentials: true },
      )
      .then((data: any) => {
        console.log(data.data.access_token);
        localStorage.setItem('access_token', data.data.access_token);
      });
  };

  const getUser = () => {
    apiPrivate.get('/auth/user').then((data) => {
      console.log(data);
    });
  };
  const renewToken = () => {
    apiPrivate.get('/auth/access-token').then((data) => {
      localStorage.setItem('access_token', data.data.access_token);
    });
  };

  return (
    <Box>
      <Button onClick={login}>Login</Button>
      <Button onClick={getUser}>Get user</Button>
      <Button onClick={renewToken}>Renew</Button>
    </Box>
  );
}
