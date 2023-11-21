"use server";

import Container from "typedi";
import { signUpFormSchema } from "./formSchema";
import { createFormHandler } from "@/utils/zod.utils";
import { UserService } from "@/services/UserService";
import { v4 } from "uuid";
import { EventService } from "@/services/EventService";
import { redirect } from "next/navigation";

const userService = Container.get(UserService);
const eventService = Container.get(EventService);

export const handleCompleteSignUp = createFormHandler(
  signUpFormSchema,
  ({ dateOfBirth, email, firstName, lastName, userId }) => {
    // generate a notification id where the action result will be sent back to
    const notifyId = v4();
    // register a listener with the notification id
    // Show message based on `err` coming from the external service
    // Send the message to only one user with the user id `userId`
    eventService.notifyOn(notifyId, (err) => err || "Success", [userId]);
    // invoke actual action
    userService.createUser(
      { dateOfBirth, email, firstName, lastName },
      notifyId // pass the notification id (Optional, if notifying the user is a goal)
    );
    // redirect to profile page
    return redirect("/profile");
  }
);
