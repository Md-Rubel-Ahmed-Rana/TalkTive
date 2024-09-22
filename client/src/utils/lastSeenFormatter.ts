import moment from "moment";

export const formatLastActive = (lastActive: Date) => {
  const lastActiveDate = moment(lastActive);
  if (lastActiveDate.isSame(moment(), "day")) {
    return `last seen today at ${lastActiveDate.format("hh:mm A")}`;
  } else if (lastActiveDate.isSame(moment().subtract(1, "day"), "day")) {
    return `last seen yesterday at ${lastActiveDate.format("hh:mm A")}`;
  } else {
    return `last seen on ${lastActiveDate.format("MMMM D, YYYY at hh:mm A")}`;
  }
};
