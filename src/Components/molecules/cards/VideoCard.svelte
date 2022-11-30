<script lang="ts">
  export let header: string;
  export let img: string;
  export let normal: string = '';
  export let bold: string = '';
  export let tag: string = '';
  export let link: string = '#';
  // const category = ['Thoughts', 'Plans', 'Logbook'][Math.floor(Math.random() * 3)];
</script>

<a
  href={link}
  class="group flex flex-col aspect-[24/9] lg:aspect-video xl:aspect-auto hover:scale-[1.001] hover:shadow-md transition-all bg-gray-900 border border-gray-900 relative text-white"
>
  <img
    src={img}
    alt=""
    class="object-cover h-full opacity-50 group-hover:opacity-[60%] transition-all"
  />
  <div class="absolute p-4 flex flex-col gap-8 justify-between h-full">
    <div class="flex flex-col gap-1">
      <h6><span class="font-medium">{tag}</span></h6>
      <h3 class="">{header}</h3>
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
