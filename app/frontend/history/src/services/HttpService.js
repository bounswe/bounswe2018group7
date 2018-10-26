import { getCookie, TOKEN_COOKIE } from "utils/cookies.js";

const Configuration = {
  API_URL: "https://history-backend.herokuapp.com/",
  STATIC_HOST: "https://history-backend.herokuapp.com/",
  HTTP_TIMEOUT_MS: 40000 /* 40 sec */
};

class HttpService {
  fetch(requestOptions) {
    return new Promise((resolve, reject) => {
      const url = this._createUrl(requestOptions);
      const overriddenHeaders = requestOptions.headers || {};
      const sendToken = requestOptions.sendToken || false;
      const processedRequestOptions = {
        ...requestOptions,
        body: JSON.stringify(requestOptions.body),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            typeof sendToken === "undefined"
              ? "JWT " + getCookie(TOKEN_COOKIE)
              : sendToken === false
                ? null
                : "JWT " + getCookie(TOKEN_COOKIE),
          ...overriddenHeaders
        },
        timeout: Configuration.HTTP_TIMEOUT_MS
      };

      let fetchStatus = null;

      fetch(url, processedRequestOptions)
        .then(fetchRes => {
          fetchStatus = fetchRes.status;
          return fetchRes.json();
        })
        .then(res => {
          const response = {
            status: fetchStatus,
            responseBody: res
          };
          resolve(response);
        })
        .catch(err => {
          console.log("HttpService.js de hata:", err);
          reject({
            detail: "Something wrong happened when try to fetch data. Code-API"
          });
        });
    });
  }

  _createUrl(requestOptions) {
    let url = requestOptions.apiPath || Configuration.API_URL;
    url = requestOptions.path ? url + requestOptions.path : url;
    return url;
  }
}

export default new HttpService();