import { randomInt } from 'crypto';

const urlFriendlySymbols =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export default async function createShortCode(
  checkFn: (code: string) => Promise<boolean>,
) {
  const size = randomInt(
    +process.env.MIN_URL_SIZE,
    +process.env.MAX_URL_SIZE + 1,
  );
  let code = '';
  for (let i = 0; i < size; i++) {
    code += urlFriendlySymbols[randomInt(0, urlFriendlySymbols.length)];
  }
  if (await checkFn(code)) {
    return code;
  }
  return createShortCode(checkFn);
}
