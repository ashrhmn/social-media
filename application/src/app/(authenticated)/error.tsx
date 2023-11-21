"use client";

import React from "react";

const ErrorPage = (props: any) => {
  console.log(props.error.message);
  return <div>ErrorPage</div>;
};

export default ErrorPage;
