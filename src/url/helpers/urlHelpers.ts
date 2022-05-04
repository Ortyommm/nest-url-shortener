function isUrl(testUrl: string) {
  return /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/.test(
    testUrl,
  );
}

function addHttp(testUrl: string) {
  if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://'))
    return 'http://' + testUrl;
  return testUrl;
}

export { isUrl, addHttp };
