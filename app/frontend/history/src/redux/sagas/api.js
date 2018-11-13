import httpService from "services/HttpService";
import { getCookie, TOKEN_COOKIE } from "utils/cookies.js";

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

  createPost = (title, time, location, stories, tags) => {
    console.log("​-------------------------------");
    console.log("​api -> createPost -> tags", tags);
    console.log("​-------------------------------");
    console.log("​-------------------------------------");
    console.log("​api -> createPost -> stories", stories);
    console.log("​-------------------------------------");
    console.log("​---------------------------------------");
    console.log("​api -> createPost -> location", location);
    console.log("​---------------------------------------");
    console.log("​-------------------------------");
    console.log("​api -> createPost -> time", time);
    console.log("​-------------------------------");
    console.log("​---------------------------------");
    console.log("​api -> createPost -> title", title);
    console.log("​---------------------------------");

    var formData = new FormData();

    formData.append("title", title);
    formData.append("time", time);
    formData.append("location", location);

    // Object.keys(stories).forEach(el => formData.append(el, stories[el]));

    stories.forEach((el, index) => {
      let storytxt = "story[" + index + "]";
      formData.append(storytxt, el, el.name);
    });

    formData.append("tags", tags);

    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.onload = oEvent => {
        if (oEvent) resolve(oEvent.target);
        else reject("NO RESPONSE");
      };

      request.open("POST", "https://history-backend.herokuapp.com/api/v1/memory_posts/");
      request.setRequestHeader("Authorization", "TOKEN " + getCookie(TOKEN_COOKIE));
      request.send(formData);
    });
  };
}

export default new api();
