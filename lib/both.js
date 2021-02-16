import { UserItems } from "../imports/api/collections";

Meteor.methods({
  'UserItems.togglePickItem'(_id) {
    const userItem = UserItems.findOne(_id);
    // console.log(userItem)
    UserItems.update({_id}, {
      $set: {
        picked: !userItem.picked,
        updatedAt: new Date()
      }
    })
    // const updated = UserItems.findOne(_id)
    // console.log(updated)
  },
})