<script>
  import { Link } from "svelte-routing";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { fly } from "svelte/transition";
  import { elasticOut } from 'svelte/easing';

  export let menuOpen = false;
  export let profileOpen = false;
  export let location;
  export let url;
  let title = "Title";

// console.log(location.pathname)
// console.log(url)
  $: user = useTracker(() => Meteor.user());
  $: userId = useTracker(() => Meteor.userId());

  function toggleMobileMenu(event) {
    menuOpen = !menuOpen;
  }

  function toggleProfile() {
    profileOpen = !profileOpen;
  }

  function logout() {
    Meteor.logout();
  }

  function scale(node, { duration }) {
      return {
        duration,
        css: t => {
          const eased = elasticOut(t);
          console.log(eased)
          return `
            transform: scale(${eased}));
          `
        }
      };
    }

  // todo make class updates
</script>

<!-- This example requires Tailwind CSS v2.0+ -->

<div>
  <nav class="bg-indigo-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img
              class="h-8 w-8"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
              alt="Workflow" />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <!-- Current: "bg-indigo-700 text-white", Default: "text-white hover:bg-indigo-500 hover:bg-opacity-75" -->
              {#if $user}
                <Link
                  to="/"
                  class="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3
                  py-2 rounded-md text-sm font-medium">
                  Plan
                </Link>

                <Link
                  to="/shop"
                  class="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3
                  py-2 rounded-md text-sm font-medium">
                  Shop
                </Link>

                <Link
                  to="/categories"
                  class="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3
                  py-2 rounded-md text-sm font-medium">
                  Categories
                </Link>
              {/if}

            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <button
              class="p-1 bg-indigo-600 rounded-full text-indigo-200
              hover:text-white focus:outline-none focus:ring-2
              focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
              <span class="sr-only">View notifications</span>
              <!-- Heroicon name: bell -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                  6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6
                  11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6
                  0v-1m6 0H9" />
              </svg>
            </button>

            {#if $user}
              <!-- Profile dropdown -->
              <div class="ml-3 relative">
                <div>
                  <button
                    on:click={toggleProfile}
                    class="max-w-xs bg-indigo-600 rounded-full flex items-center
                    text-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-offset-indigo-600 focus:ring-white text-indigo-200"
                    id="user-menu"
                    aria-haspopup="true">
                    <span class="sr-only">Open user menu</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <!--
                Profile dropdown panel, show/hide based on dropdown state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              -->
                <div
                  class="{profileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  transition ease-out duration-100 transform origin-top-right
                  absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white
                  ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu">
                  {#if $user}
                    <a
                      on:click|preventDefault={logout}
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700
                      hover:bg-gray-100"
                      role="menuitem">
                      Logout
                    </a>
                  {:else}
                    <a
                      href="/login"
                      class="block px-4 py-2 text-sm text-gray-700
                      hover:bg-gray-100"
                      role="menuitem">
                      Login
                    </a>
                  {/if}
                </div>
              </div>
            {:else}
              <Link to="/login">Login</Link>
            {/if}
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button
            on:click={toggleMobileMenu}
            class="bg-indigo-600 inline-flex items-center justify-center p-2
            rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500
            hover:bg-opacity-75 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <!--
              Heroicon name: menu

              Menu open: "hidden", Menu closed: "block"
            -->
            <svg
              class="h-6 w-6 {menuOpen ? 'hidden' : 'block'}"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!--
              Heroicon name: x

              Menu open: "block", Menu closed: "hidden"
            -->
            <svg
              class="h-6 w-6 {menuOpen ? 'block' : 'hidden'}"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    -->
    {#if menuOpen}
    <div transition:fly={{ y: -500 }} class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {#if $user}
          <!-- Current: "bg-indigo-700 text-white", Default: "text-white hover:bg-indigo-500 hover:bg-opacity-75" -->
          <Link
            to="/"
            on:click={toggleMobileMenu}
            class="text-white block px-3 py-2 rounded-md text-base
            font-medium">
            Plan
          </Link>

          <Link
            to="/shop"
            on:click={toggleMobileMenu}
            class="text-white hover:bg-indigo-500 hover:bg-opacity-75 block px-3
            py-2 rounded-md text-base font-medium">
            Shop
          </Link>

          <Link
            to="/categories"
            on:click={toggleMobileMenu}
            class="text-white hover:bg-indigo-500 hover:bg-opacity-75 block px-3
            py-2 rounded-md text-base font-medium">
            Categories
          </Link>
        {/if}

      </div>
      <div class="pt-4 pb-3 border-t border-indigo-700 text-indigo-200">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <svg class="h-10 w-10 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">{$user?.emails[0].address}</div>
            <div class="text-sm font-medium text-indigo-300">
              
            </div>
          </div>
          <button
            class="ml-auto bg-indigo-600 flex-shrink-0 p-1 rounded-full
            text-indigo-200 hover:text-white focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: bell -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6
                11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6
                0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        <div class="mt-3 px-2 space-y-1">

          {#if $user}
            <a
              on:click|preventDefault={logout}
              href="#"
              class="block px-3 py-2 rounded-md text-base font-medium text-white
              hover:bg-indigo-500 hover:bg-opacity-75">
              Logout
            </a>
          {:else}
            <Link
              to="/login"
              class="block px-3 py-2 rounded-md text-base font-medium text-white
              hover:bg-indigo-500 hover:bg-opacity-75">
              Login
            </Link>
          {/if}
        </div>
      </div>
    </div>
    {/if}
  </nav>
  <main>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-4 sm:px-0">
        <slot />
      </div>
    </div>
  </main>
</div>
