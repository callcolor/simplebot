import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { setupCache } from 'axios-cache-interceptor';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { HOURS, SECONDS } from './constants';

const axios = Axios.create({ timeout: 30 * SECONDS });

const jar = new CookieJar();
export const axiosCookies = wrapper(Axios.create({ jar }));

export const axiosRetryOnly = Axios.create({ timeout: 30 * SECONDS });
axiosRetry(axiosRetryOnly, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});

export const axiosCacheRetry = Axios.create();
setupCache(axiosCacheRetry, {
  ttl: 24 * HOURS,
});
axiosRetry(axiosCacheRetry, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});

export default axios;
