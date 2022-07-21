import path from 'path';

const langCache: { [key: string]: any } = {};

export async function mapStatusLang(
  langCode: string,
  messageType: string,
  messageCode: string
) {
  const basePath = path.resolve(__dirname, '../../../', 'locales', 'i18n'),
    defaultLangCode = 'en',
    url = path.resolve(`${basePath}/${langCode}.json`);
  if (langCache[langCode]) {
    if (langCache[langCode][messageType][messageCode])
      return langCache[langCode][messageType][messageCode];
    else return langCache[defaultLangCode][messageType][messageCode];
  } else {
    const data = await import(`${url}`);
    langCache[langCode] = data.default;
    if (data.default[messageType][messageCode])
      return data.default[messageType][messageCode];
    else return langCache[defaultLangCode][messageType][messageCode];
  }
}

// load initial en file
mapStatusLang('en', 'success', 'CMN-001');
