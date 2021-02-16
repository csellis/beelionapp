<script>
  import { onMount, afterUpdate } from "svelte";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { Items, UserItems } from "../../api/collections";

  import UserItem from '../components/UserItem';
  import SelectCategory from '../components/SelectCategory';
  import CategoryUserItems from '../components/CategoryUserItems';
  import PickedUserItems from '../components/PickedUserItems';
  import Header from "../components/Header";

  

  export let location;
  export let search = "";
  export let selectedUserItem = {};
  export let subscription;

  $: query = search;
  $: itemsResults = useTracker(() => Items.find({}).fetch());
  $: userItems = useTracker(() => {
    const userItems = UserItems.find({}, {sort: { categoryRank: 1}}).fetch();

    const uncategorizedUserItems = userItems.filter(userItem => userItem.categoryName === "Uncategorized")
    const categorizedUserItems = userItems.filter(userItem => {
      return userItem.categoryName !== "Uncategorized";
    });
    
    const categories = [];
    categorizedUserItems.forEach(userItem => {
      // console.log(userItem)
      const {categoryRank, categoryId, categoryName} = userItem;
      const inCategories = categories.filter(category => category.categoryName === categoryName);
      if(inCategories.length === 0) {
        categories.push({
          categoryId,
          categoryName,
          categoryRank
        })
      }
    });


    // const categories = categorizedUserItems.filter()

    // console.log({categories, uncategorizedUserItems, categorizedUserItems})

    return {
      uncategorizedUserItems,
      categorizedUserItems,
      categories,
    }
  })
  
  $: selectedUserItemRecord = useTracker(() => {
      const userItem = UserItems.findOne(selectedUserItem);
      console.log("hello")
      return userItem;
  })

  $: {
      subscription?.stop();
      subscription = Meteor.subscribe("itemsSearch", query);
  };

    
  onMount(async () => {
    Meteor.subscribe("userItems");
  });

  function handleSubmit(event) {
    console.log({ search });
  }

  function handleSearch(event) {
  }

  function addItem(event) {
    Meteor.call("Items.add", search, (err, res) => {
      if (err) console.warn(err);
    });
    search = "";
  }

  function selectUserItem (event) {
    const selected = event.detail.userItem;
    Meteor.call("UserItems.togglePickItem", selected._id, (err, res) => {
      if(err) console.warn(err)
      console.log(res)
    })
  }
</script>

<div class="w-full relative">

<Header title="Shop" />

  {#if $userItems.uncategorizedUserItems.length > 0}
  <div class="bg-white border border-gray-300 overflow-hidden rounded-md mt-4">
    <ul class="divide-y divide-gray-300">
        <li class="px-6 py-4 flex justify-between bg-red-100">
          <span>
          Uncategorized Items
          </span>
        </li>
      {#each $userItems.uncategorizedUserItems as userItem}
        <UserItem on:selectUserItem={selectUserItem} {userItem} showCategory={false} />
      {/each}
    </ul>
  </div>
  {/if}


  
  <div class="bg-white border border-gray-300 overflow-hidden rounded-md mt-4">
    <ul class="divide-y divide-gray-300">
      {#each $userItems.categories as category}
        <!-- <li class="px-6 py-4 flex justify-between bg-indigo-50">
          <span>
          {category.categoryRank}: {category.categoryName}
          </span>
        </li> -->
        <CategoryUserItems categoryId={category.categoryId} {category} />
        {:else}
          <li class="px-6 py-4 flex justify-between">
            <span>
              No items
            </span>
          </li>
      {/each}
    </ul>
  </div>

  <PickedUserItems />
</div>


{#if selectedUserItem.itemName}
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="fixed z-10 inset-0 overflow-y-auto">
  <div class="flex items-start justify-center min-h-screen pt-12 px-4 pb-20 text-center sm:block sm:p-0">
    <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div 
    class="fixed inset-0 transition-opacity ease-out duration-300 {selectedUserItem ? 'opacity-100' : 'opacity-0'}}" 
    aria-hidden="true"
    on:click={clearUserItem}
    >
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
    <div class="{selectedUserItem ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'} ease-out duration 300 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
      <div>
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <!-- Heroicon name: check -->
          <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              {selectedUserItem.itemName}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {selectedUserItem.categoryName}
            </p>
          </div>
          <div class="mt-2">
            <SelectCategory {selectedUserItem} on:selectUserItem={selectUserItem} />
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6 grid grid-cols-2 gap-2">
        <button on:click={clearUserItem} type="button" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
          Back
        </button>
        <button on:click={removeUserItem(selectedUserItem._id)} type="button" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
          Remove Item
        </button>
      </div>
    </div>
  </div>
</div>


{/if}