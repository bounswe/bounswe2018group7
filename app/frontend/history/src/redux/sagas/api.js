import httpService from "services/HttpService";

class api {
  doSignIn = (identity, password) => {
    return httpService.fetch({
      path: "api/v1/signin/",
      method: "POST",
      body: {
        identity,
        password
      },
      sendToken: false
    });
  };
  doVerifyIn = token => {
    return httpService.fetch({
      path: "api/v1/email_confirmation/",
      method: "POST",
      body: {
        token
      },
      sendToken: false
    });
  };
  doSignUp = (username, email, password, password_confirmation, first_name, last_name) => {
    return httpService.fetch({
      path: "api/v1/signup/",
      method: "POST",
      body: {
        username,
        email,
        password,
        password_confirmation,
        first_name,
        last_name
      },
      sendToken: false
    });
  };
}

export default new api();
