"use client";

import * as moment from "moment";

const Timestamp = ({ timeStamp }: { timeStamp: string }) => {
  return moment.default(timeStamp).fromNow();
};

export default Timestamp;
