import deviceType from 'device-type';
import http from 'http';

http.createServer(req => {
  console.log('device type:', deviceType(req));
});
