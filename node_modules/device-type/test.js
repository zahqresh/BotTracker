import {cb as test} from 'tapava';
import deviceType from './lib';
import shot from 'shot';
import assign from 'object-assign';

const testOnRequest = (onRequest, opts = {}) => {
  shot.inject(onRequest, assign({method: 'GET', url: '/'}, opts));
};

test('deviceType(), no UA', t => {
  const expected = {
    mobile: false,
    tablet: false,
    desktop: true
  };

  const onRequest = req => {
    const actual = deviceType(req);
    t.deepEqual(actual, expected);
    t.end();
  };
  testOnRequest(onRequest);
});

test('deviceType(), iPhone', t => {
  const expected = {
    mobile: true,
    tablet: false,
    desktop: false
  };

  const onRequest = req => {
    const actual = deviceType(req);
    t.deepEqual(actual, expected);
    t.end();
  };
  testOnRequest(onRequest, {
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    }
  });
});

test('deviceType(), iPad', t => {
  const expected = {
    mobile: true,
    tablet: true,
    desktop: false
  };

  const onRequest = req => {
    const actual = deviceType(req);
    t.deepEqual(actual, expected);
    t.end();
  };
  testOnRequest(onRequest, {
    headers: {
      'user-agent': 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    }
  });
});

test('deviceType(), CloudFront-Is-Mobile-Viewer = \'true\'', t => {
  const expected = {
    mobile: true,
    tablet: false,
    desktop: false
  };

  const onRequest = req => {
    const actual = deviceType(req);
    t.deepEqual(actual, expected);
    t.end();
  };
  testOnRequest(onRequest, {
    headers: {
      'CloudFront-Is-Mobile-Viewer': 'true'
    }
  });
});

test('deviceType(), CloudFront-Is-Tablet-Viewer = \'true\'', t => {
  const expected = {
    mobile: false,
    tablet: true,
    desktop: false
  };

  const onRequest = req => {
    const actual = deviceType(req);
    t.deepEqual(actual, expected);
    t.end();
  };
  testOnRequest(onRequest, {
    headers: {
      'CloudFront-Is-Tablet-Viewer': 'true'
    }
  });
});
