import { UserItems, Categories, Items, PickedItems } from "./collections";

Meteor.methods({
  'Categories.reorder'(categories) {
    // console.log(categories)
    categories.forEach((category, index) => {
      Categories.update({_id: category._id}, {
        $set: {
          rank: index
        }
      })
    })
  },
  'Items.categorize'(itemId, categoryId) {
    const category = Categories.findOne(categoryId);
    // console.log({category, item})

    const updatedItems = Items.update({_id: itemId}, {
      $set: {
        "categoryId": categoryId,
        "categoryName": category.name,
        "updatedAt": new Date()
      }
    });

    const updateUserItems = UserItems.update({ itemId }, {
      $set: {
        categoryId,
        categoryName: category.name,
        categoryRank: category.rank
      }
    });

    return {
      updatedItems,
      updateUserItems
    }

  },
  'UserItems.add'(itemId) {

    const item = Items.findOne(itemId);
    const category = Categories.findOne(item.categoryId);
    console.log({item, category})

    const userItem = {
      userId: this.userId,
      itemId,
      itemName: item.name,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryRank: category.rank,
      picked: false,
      createdAt: new Date(),
    }
    return UserItems.insert(userItem)
  },
  'UserItems.checkout'() {
    const picked = UserItems.find({userId: this.userId, picked: true}).fetch();
    // console.log(picked)
    picked.forEach(item => {
      PickedItems.insert(item)
    })
    return UserItems.remove({userId: this.userId, picked: true})
  },
  'UserItems.remove'(userItemId) {
    return UserItems.remove(userItemId);
  },
  // 'UserItems.togglePickItem'(_id) {
  //   const userItem = UserItems.findOne(_id);
  //   // console.log(userItem)
  //   UserItems.update({_id}, {
  //     $set: {
  //       picked: !userItem.picked,
  //       updatedAt: new Date()
  //     }
  //   })
  //   // const updated = UserItems.findOne(_id)
  //   // console.log(updated)
  // },
  'Items.add'(name) {
    const userId = this.userId;
    // console.log({ name })
    // check if name exists
    const itemExists = Items.findOne({ name });
    var itemId;

    if (itemExists) {
      itemId = itemExists._id;
    } else {
      // find global category for Uncategorized
      const uncategorized = Categories.findOne({ name: "Uncategorized" });
      // console.log({ uncategorized })

      // build item
      const item = {
        name,
        createdBy: userId,
        categoryName: uncategorized.name,
        categoryId: uncategorized._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      itemId = Items.insert(item);
    }

    // add to user's list
    Meteor.call('UserItems.add', itemId, (err, res) => {
      if (err) console.warn(err);
    })
  },
  'Categories.add'({ name }) {
    // Create a new Global Category
    // Prevent duplicate category names
    var itemWithSameName = Categories.findOne({ name });
    if (itemWithSameName) {
      return {
        categoryExists: true,
        _id: itemWithSameName._id
      }
    }

    // Determine rank for new category
    var nextRank = Categories.find().fetch().length;

    var item = {
      name,
      rank: nextRank,
      created: new Date()
    }

    var itemId = Categories.insert(item);
    return {
      _id: itemId
    };
  },
  'PickedItems.clear'() {
    return PickedItems.remove({userId: this.userId})
  }
});

// model Item {
//   id         Int      @id @default(autoincrement())
//   name       String
//   published  Boolean  @default(true)
//   category   Category @relation(fields: [categoryId], references: [id])
//   categoryId Int
//   createdAt  DateTime @default(now())
//   updatedAt  DateTime @updatedAt
// }