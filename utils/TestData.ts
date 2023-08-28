import { Post } from "./PromptService";

const mockPostsResponse: Post[] = [{
    prompt: "This is a prompt",
    tag: "#software",
    _id: "7",
    timeStamp: new Date("Thu Sept 7 2023 12:00:19"),
    creator: {
      username: "s",
      _id: "1",
      email: "123@gmail.com",
      image: "/logo.png"
    }
  },
  {
    prompt: "First post",
    tag: "#web",
    _id: "6",
    timeStamp: new Date("Thu Sept 7 2023 16:00:19"),
    creator: {
      username: "sam",
      _id: "23",
      email: "12@gmail.com",
      image: "/logo2.png"
    }
  }]

  export default mockPostsResponse;