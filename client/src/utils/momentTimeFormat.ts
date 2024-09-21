import moment from "moment";

const momentTimeFormat = (date: Date) => {
  const now = moment();
  const messageDate = moment(date);

  if (now.isSame(messageDate, "day")) {
    return messageDate.format("h:mm A");
  } else if (now.subtract(1, "day").isSame(messageDate, "day")) {
    return "Yesterday";
  } else if (now.isSame(messageDate, "week")) {
    return messageDate.format("dddd");
  } else {
    return messageDate.format("M/D/YYYY");
  }
};

export default momentTimeFormat;
