const PricingCard = () => {
  return (
    <div class="mb-4 overflow-hidden rounded-lg shadow-lg">
      <div class="px-6 py-8 bg-white dark:bg-gray-800 sm:p-10 sm:pb-6">
        <div class="flex justify-center">
          <span class="inline-flex px-4 py-1 text-sm font-semibold leading-5 tracking-wide uppercase rounded-full dark:text-white">
            Team Plan
          </span>
        </div>
        <div class="flex justify-center mt-4 text-6xl font-extrabold leading-none dark:text-white">
          <span class="ml-1 mr-3 text-xl font-medium leading-8 text-gray-500 dark:text-gray-400">
            from
          </span>
          $10
          <span class="pt-8 ml-1 text-2xl font-medium leading-8 text-gray-500 dark:text-gray-400">
            /month
          </span>
        </div>
      </div>
      <div class="px-6 pt-6 pb-8 bg-white dark:bg-gray-800 sm:p-10 sm:pt-6">
        <ul>
          <li class="flex items-start mt-4">
            <div class="flex-shrink-0">
              <svg
                class="w-6 h-6 text-green-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p class="ml-3 text-base leading-6 text-gray-700 dark:text-gray-200">
              $10/month per user
            </p>
          </li>
          <li class="flex items-start mt-4">
            <div class="flex-shrink-0">
              <svg
                class="w-6 h-6 text-green-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p class="ml-3 text-base leading-6 text-gray-700 dark:text-gray-200">
              Unlimited number of projects
            </p>
          </li>
          <li class="flex items-start mt-4">
            <div class="flex-shrink-0">
              <svg
                class="w-6 h-6 text-green-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p class="ml-3 text-base leading-6 text-gray-700 dark:text-gray-200">
              Cancel anytime
            </p>
          </li>
        </ul>
        <div class="mt-6 rounded-md shadow">
          <a
            href="#"
            class="flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:shadow-outline"
          >
            Start team plan
          </a>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
