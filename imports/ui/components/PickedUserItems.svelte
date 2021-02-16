<script>
    import { createEventDispatcher } from 'svelte';
    import { useTracker } from "meteor/rdb:svelte-meteor-data";
    import { Items, UserItems } from "../../api/collections";



  const dispatch = createEventDispatcher(); 

  import UserItem from './UserItem';
  
   $: userItems = useTracker(() => {
     const userItems = UserItems.find({ picked: true}).fetch();
    //  console.log({categoryId, userItems})
     return userItems;
   });

  function selectUserItem (event) {
    const selected = event.detail.userItem;

    Meteor.call("UserItems.togglePickItem", selected._id, (err, res) => {
      if(err) console.warn(err)
      // console.log(res)
    })
    // console.log(selected)
  }

  function checkout(event) {
    Meteor.call("UserItems.checkout", (err, res) => {
      if(err) console.warn(err)
      console.log(res)
    })
  }
</script>

{#if $userItems.length > 0}
  <div class="bg-white border border-gray-300 overflow-hidden rounded-md mt-4">
    <ul class="divide-y divide-gray-300">
        <li class="px-6 py-4 flex justify-between bg-red-50">
          <span>
          Picked Items
          </span>
          <span>
            <button on:click={checkout}>
              Checkout
            </button>
          </span>
        </li>
    {#each $userItems as userItem}
      <UserItem on:selectUserItem={selectUserItem} {userItem} showCategory={true} />
    {/each}
    </ul>
  </div>
{/if}