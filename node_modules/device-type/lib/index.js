import MobileDetect from 'mobile-detect';

module.exports = ({headers}) => {
  const {
    'user-agent': userAgent,
    'cloudfront-is-mobile-viewer': isMobileViewer,
    'cloudfront-is-tablet-viewer': isTabletViewer
  } = headers;
  const md = new MobileDetect(userAgent);

  const tablet = isTabletViewer === 'true' || !!md.tablet();
  const mobile = isMobileViewer === 'true' || !!md.mobile();
  const desktop = !mobile && !tablet;

  return {
    desktop, mobile, tablet
  };
};
