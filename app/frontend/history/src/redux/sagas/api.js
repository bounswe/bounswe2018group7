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
  doSignUp = (username, email, password, password_confirmation, full_name) => {
    return httpService.fetch({
      path: "api/v1/signup/",
      method: "POST",
      body: {
        username,
        email,
        password,
        password_confirmation,
        full_name
      },
      sendToken: false
    });
  };
}

export default new api();
