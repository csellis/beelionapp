import { Meteor } from "meteor/meteor";
import App from "../imports/ui/App.svelte";

import "../lib/both"


Meteor.startup(() => {
  new App({
    target: document.getElementById("app"),
    // hydrate: true
  });
});
