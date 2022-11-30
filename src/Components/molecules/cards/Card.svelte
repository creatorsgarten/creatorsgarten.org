<script lang="ts">
  export let header: string;
  export let img: string;
  export let normal: string = '';
  export let bold: string = '';
  export let tag: string = '';
  export let date = '4 October 2022';
  export let link: string = '#';
  // const category = ['Thoughts', 'Plans', 'Logbook'][Math.floor(Math.random() * 3)];
</script>

<a
  href={link}
  class="group grid grid-cols-3 xl:flex xl:flex-col gap-4 hover:scale-[1.001] hover:shadow-md transition-all border border-gray-600 bg-white"
>
  <div class="aspect-square w-full xl:aspect-video flex justify-center items-center">
    <img
      src={img}
      alt=""
      class="xl:aspect-video relative max-w-max h-full object-cover overflow-hidden border-r border-gray-600 xl:border-r-0 lg:border-b"
    />
  </div>
  <div
    class="col-span-2 py-3 xl:py-0 pr-5 xl:pl-3 xl:pb-4 flex flex-col justify-center lg:justify-between md:h-full"
  >
    <div class="flex flex-col gap-1 md:h-full justify-center md:justify-start">
      <h6 class="font-medium">{tag}</h6>
      <h3>{header}</h3>
    </div>
    <p class="text-xs md:text-base flex mt-1 lg:mt-5">
      {#if bold}
        <span class="font-medium">{bold}</span>
      {/if}
      {#if bold && normal}
        &nbsp;|&nbsp;
      {/if}
      {#if normal}
        <span>{normal}</span>
      {/if}
    </p>
  </div>
</a>
