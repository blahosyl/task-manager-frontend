import { rest } from "msw";

// URL of deployed API on Heroku
const baseURL = "https://pp5-task-manager-api-380974d293dd.herokuapp.com/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        "pk": 2,
        "username": "sylvia-pp5",
        "email": "",
        "first_name": "",
        "last_name": "",
        "profile_id": 2,
        "profile_firstname": "Sylvia",
        "profile_lastname": "Blaho",
        "profile_image": "https://res.cloudinary.com/dmyblkxhd/image/upload/v1/media/images/sp-sylvia_urban_zikq3s"
        })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];