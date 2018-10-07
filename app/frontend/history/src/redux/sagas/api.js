import httpService from "services/HttpService";

class api {
  doSignIn = (email, password) => {
    return httpService.fetch({
      path: "auth/login/",
      method: "POST",
      body: {
        email,
        password
      },
      sendToken: false
    });
  };
}

export default new api();
