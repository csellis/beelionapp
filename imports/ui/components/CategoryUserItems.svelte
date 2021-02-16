<script>
  import { createEventDispatcher } from 'svelte';
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { Items, UserItems } from "../../api/collections";



  const dispatch = createEventDispatcher(); 

    import UserItem from './UserItem';
  
    export let categoryId;
    export let category;

  // console.log(userItems)
   $: userItems = useTracker(() => {
     const userItems = UserItems.find({ categoryId, picked: false}).fetch();
    //  console.log({categoryId, userItems})
     return userItems;
   });
  //  $: hasItems = {
  //    console.log(userItems.length > 0)
  //  }

  
  function selectUserItem (event) {
    const selected = event.detail.userItem;

    Meteor.call("UserItems.togglePickItem", selected._id, (err, res) => {
      if(err) console.warn(err)
      // console.log(res)
    })
    // console.log(selected)
  }
</script>

{#if $userItems.length > 0}
  {#each $userItems as userItem}
    <UserItem on:selectUserItem={selectUserItem} {userItem} showCategory={true} />
  {/each}
{/if}