interface URLS {
    API: string;
}

const IDEMPRESA: number = 1;
const ENTORNO: string = 'DEV'; // 'DEV' or 'PROD'
const TOKEN : string = "2XJ34B48FM39ASF909SDGDSG";
const URLS: Record<string, URLS> = {
    DEV: {
        API: 'http://localhost:7001/api',
    }
}

export default {
    URL: URLS[ENTORNO].API,
    IDEMPRESA: IDEMPRESA,
    TOKEN: TOKEN,
}

