<script>
  import { latest, upcoming, projects } from '../data/index';
  import Card from '../Components/molecules/cards/Card.svelte';
  import ImageCard from '../Components/molecules/cards/ImageCard.svelte';
  import VideoCard from '../Components/molecules/cards/VideoCard.svelte';
  import WideCard from '../Components/molecules/cards/WideCard.svelte';
</script>

<svelte:head>
  <title>Creatorsgarten</title>
</svelte:head>

<div class="cg-large-container flex flex-col gap-6 lg:gap-10 my-4">
  <!-- <section class="py-12 px-20 mesh">
    <div class="flex flex-col gap-6 w-11/12 md:w-4/5">
      <h1>We create things to find the beauty and fun around us.</h1>
      <p class="text-lg ">
        Creatorsgarten is a collective of creators who enjoy making things. We unite to create a
        supportive environment for all the creators where they can come to create, learn, and share.
      </p>
      <p>
        <a href="/wiki/Manifesto" class="cg-btn">Manifesto</a>
      </p>
    </div>
  </section> -->

  <section class="grid gap-5">
    <a
      href="https://www.youtube.com/playlist?list=PLTuz2sLvbRpx9okBtTzA85rRsNqGlKR_5"
      class="group grid lg:grid-cols-8 gap-3 lg:gap-6 hover:shadow-md hover:scale-[1.001] transition-all bg-white border border-gray-600"
    >
      <img
        src="/images/pool/bkkjs17.webp"
        alt=""
        class="lg:col-span-5 aspect-[5/3] object-cover h-full border-r border-gray-600"
      />
      <div
        class="lg:col-span-3 flex flex-col gap-1 lg:gap-3 justify-center h-full pl-4 pr-5 xl:pl-1 xl:pr-10 pb-4"
      >
        <span class="font-medium">BKK.JS#17</span>
        <h1>From Methodologies to Projects: 5 Exciting Talks from BKK.JS#17</h1>
        <p class="mt-2">
          <span class="font-medium">Playlist</span> | 29 October 2022
        </p>
      </div>
    </a>

    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
      <Card
        header="You don't need Javascript"
        img="/images/pool/dontneed.webp"
        tag="BKK.JS#17"
        bold="Talk"
        normal="Siriwat Kunaporn"
        link="https://www.youtube.com/watch?v=le5M-5mhPY0&list=PLTuz2sLvbRpx9okBtTzA85rRsNqGlKR_5&index=3"
      />
      <Card
        header="10 years of Typescript"
        img="/images/pool/call.webp"
        tag="BKK.JS#17"
        bold="Talk"
        normal="Jirachai Chansivanon"
        link="https://www.youtube.com/watch?v=wrPz2Sp9EZU&list=PLTuz2sLvbRpx9okBtTzA85rRsNqGlKR_5&index=5"
      />
      <VideoCard
        header="4 Sessions from React Meetup"
        img="/images/pool/react.webp"
        tag="React Meetup"
        bold="Playlist"
        normal="22 September 2022"
        link="https://www.youtube.com/playlist?list=PLTuz2sLvbRpznpYfNIUbUpRyZB9R8198o"
      />
      <VideoCard
        header="Bangkok Science Month: Let's talk about superstition"
        img="/images/pool/scisart.webp"
        tag="Sciยศาสตร์ Night"
        bold="Live"
        normal="20 August 2022"
        link="https://www.facebook.com/creatorsgarten/videos/443922121010071/"
      />
    </div>
  </section>

  <section class="grid gap-4 my-2 mx-3 md:mx-10 md:my-4">
    <h1>Connecting creators, making things</h1>
    <h2>
      Creatorsgarten is a collective of creators. We strive to bring people together and create
      meaningful projects. We are committed to promoting a creative culture and to help creators
      cultivate ideas and expand their frontier of perception.
    </h2>
  </section>

  <!-- We strive to create meaningful connections between creators and to help them discover and
      explore new opportunities, ideas, and experiences. We believe that when fascinating creators
      come together, they will create fascinating things. -->

  <section class="grid gap-4 mesh-3 p-6 z-10 border border-gray-900">
    <div class="flex justify-between items-center">
      <h1 class="font-medium text-gray-900">Latest Events</h1>
      <a href="#"
        ><h2 class="hidden md:block font-medium text-gray-900 hover:underline">See More -></h2></a
      >
      <!-- <Icon icon={ArrowRight} class="header font-white" /> -->
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ImageCard
        img="https://media.gatesnotes.com/-/media/Images/Articles/Development/Global-Findex-2022/financial-inclusion_2022_thumbnail_320px_01.ashx"
        text="BKK.JS#17"
        link="https://creatorsgarten.org/wiki/Hacks/bkkjs17"
      />
      <ImageCard
        img="/images/pool/hack.webp"
        text="Hacktoberfest Thailand 2022"
        link="https://creatorsgarten.org/wiki/Hacks/hacktoberfest2022"
      />
      <ImageCard
        img="/images/pool/golf1.webp"
        text="Codegolf Party #1"
        link="https://creatorsgarten.org/wiki/Hacks/golf1"
      />
    </div>
    <a href="#" class="md:hidden mt-1 md:m-0"
      ><h2 class="w-full flex justify-end font-medium text-gray-900 hover:underline">
        See More ->
      </h2></a
    >
  </section>

  <section class="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
    <Card
      header="งานชาว open source เป็นยังไงบ้างนะ? กับงาน Hacktoberfest Thailand 2022"
      img="/images/pool/mikki.webp"
      tag="HTBF Thailand 2022"
      bold="Blog"
      normal="Mikkipastel.com"
      link=""
    />
    <VideoCard
      tag="HTBF Thailand 2022"
      img="/images/pool/htbf.webp"
      header="Hacktoberfest 2022 Live Session 👾"
      bold="Playlist"
      normal="22 September 2022"
      link="https://www.youtube.com/playlist?list=PLTuz2sLvbRpzwwl-QqGveiFiG6hwbp2Ud"
    />
    <Card
      header="แชร์ประสบการณ์ Stupid Hackathon Thailand 6"
      img="/images/pool/shit6.webp"
      tag="SHiT6"
      bold="Blog"
      normal="Tinnaphat Tin Somsang"
      link="https://tinarskii.medium.com/%E0%B9%81%E0%B8%8A%E0%B8%A3%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%9A%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B9%8C-stupid-hackathon-thailand-6-c122a540638c"
    />
    <VideoCard
      header="Codegolf competition in a bar | hosted by Showdown.Space"
      img="/images/pool/golf.webp"
      tag="CodeGolf Party #1"
      bold="Live"
      normal="26 August 2022"
      link="https://www.facebook.com/creatorsgarten/videos/415600940663560/?__cft__%5B0%5D=AZUXKYNx-O5IsyHf9Edxb4MNA7K2ftgV50zIrkH1Abt8_uhRaLe75He-3FWn0HgLQopGsHOY0EX9AkvCXmGzXc34WA4CjWK7SkwLBRZf4DIEZOJV02UnGzUE_Nj4QaJh1VgSebzQhJiNs7tb8wya4yXINKIiU780VDNzTNGBwHQy4Dl_KdlgOA83IEJqKRHkjMu92MsRgh4xpz0L5lg0HcqF&__tn__=%2CO%2CP-R"
    />
  </section>

  <section class="grid gap-4 my-2 mx-3 md:mx-10 md:my-4">
    <h1>Beyond a discipline</h1>
    <h2>
      We collaborate with people from a variety of areas and backgrounds with the aim of discovering
      new opportunities. We believe that there is immense potential to solve many issues when
      crossing the boundaries of various disciplines. We draw upon the expertise of different fields
      to stimulate innovation and support one another.
    </h2>
  </section>

  <section class="grid gap-4 bg-white p-6 z-10 border border-gray-900">
    <div class="flex justify-between items-center">
      <h1 class="font-medium text-gray-900">Meet us</h1>
      <!-- <Icon icon={ArrowRight} class="header font-white" /> -->
    </div>
    <h3 class="w-full md:w-11/12 lg:w-5/6 lg:text-lg mb-2">
      As a collective with many initiatives, each with their own uniqueness, there has been separate
      organization dedicated to each. Creatorsgarten serves to bring all our initiatives together.
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ImageCard
        img="/images/pool/shit.webp"
        link="https://stupidhackth.github.io"
        text="Stupid Hackathon TH"
      />
      <ImageCard
        img="/images/pool/golflive.webp"
        text="Showdown.Space"
        link="https://showdown.space"
      />
      <ImageCard
        img="/images/pool/polaryz.webp"
        link="https://instagram.com/polaryz.club"
        text="Polaryz Club"
      />
    </div>
  </section>
</div>

<!-- <div class="flex items-center justify-center mt-4 lg:mt-6 mb-10 lg:mb-12">
  <section class="max-w-[1440px] py-10 lg:py-20 lg:mx-10 lg:rounded-3xl mesh">
    <div class="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12 xl:px-32">
      <div class="w-11/12 md:w-3/5 xl:w-1/2 mx-4">
        <h1>We create things to find the beauty and fun around us.</h1>
        <p class="text-lg my-6">
          Creatorsgarten is a collective of creators who enjoy making things. We unite to create a
          supportive environment for all the creators where they can come to create, learn, and
          share.
        </p>
        <p>
          <a href="/wiki/Manifesto" class="cg-btn">Manifesto</a>
        </p>
      </div>
    </div>
  </section>
</div>

<div class="cg-large-container flex flex-col lg:flex-row prose max-w-none mb-16">
  <div class="w-full lg:w-1/2 lg:mr-12 mb-4">
    <div class="mb-10 lg:mb-0 lg:sticky lg:top-6">
      <h1>Events</h1>
      <p class="w-full md:w-3/5 lg:w-5/6">
        Through workshops, meetups, hackathons, and much more, we bring people together to work on
        new ideas and trying new things together across the disciplines.
      </p>
      <p>
        <a href="/events" class="cg-btn">View All</a>
      </p>
    </div>
  </div>

  <div class="w-full">
    {#if upcoming.length >= 1}
      <h1 class="text-3xl">Upcoming</h1>
      <section class="not-prose grid grid-cols-2 gap-2 pb-6 md:grid-cols-3 mb-4 lg:mb-6 pt-2">
        {#each [...upcoming].reverse() as event}
          <a href={event.slug.includes('https://') ? event.slug : '/wiki/Hacks/' + event.slug}>
            <div
              class="aspect-square w-full border-2 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all"
            >
              <img src={'images/hacks/compressed/' + event.slug + '.webp'} class="" alt="" />
            </div>
          </a>
        {/each}
      </section>
    {/if}
    {#if latest.length >= 1}
      <h1 class="text-3xl">Latest Events</h1>
      <section class="not-prose grid grid-cols-2 gap-2 md:grid-cols-3 pt-2">
        {#each [...latest].reverse() as event}
          <a href={event.slug.includes('https://') ? event.slug : '/wiki/Hacks/' + event.slug}>
            <div
              class="aspect-square w-full border-2 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all"
            >
              <img src={'images/hacks/compressed/' + event.slug + '.webp'} class="" alt="" />
            </div>
          </a>
        {/each}
      </section>
    {/if}
  </div>
</div>

<div class="flex items-center justify-center mb-10 lg:mb-16">
  <section class="max-w-[1440px] py-10 lg:py-20 lg:mx-10 lg:rounded-3xl mesh-3">
    <div class="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12 xl:px-32">
      <div class="w-11/12 md:w-3/5 xl:w-1/2 mx-4">
        <h1>Creatorsgarten = <br /> Garden of Creators</h1>
        <p class="text-lg my-6">
          The name Creatorsgarten comes from the word creators and garten, as in kindergarten, which
          means a garden of children. We chose this name because we want to create a garden for all
          the creators out there, where they can cultivate their ideas and watch them grow.
        </p>
      </div>
    </div>
  </section>
</div>

<div class="cg-large-container flex flex-col lg:flex-row prose max-w-none mb-10 lg:mb-16">
  <div class="w-full lg:w-1/2 lg:mr-12">
    <div class="mb-10 lg:mb-0 lg:sticky lg:top-6">
      <h1>Projects</h1>
      <p class="w-full md:w-3/5 lg:w-5/6 lg:text-lg">
        We believe that work should be enjoyable, and that every day is an opportunity to learn
        something new and have some fun.
      </p>
      <p>
        <a href="https://github.com/creatorsgarten" class="cg-btn">GitHub</a>
      </p>
    </div>
  </div>

  <div class="w-full">
    <section class="not-prose grid grid-cols-1 gap-2 md:grid-cols-3 mb-4">
      {#each [...projects] as project}
        <a href={project.slug.includes('https://') ? project.slug : '/wiki/Hacks/' + project.slug}>
          <div
            class="p-4 aspect-[21/9] lg:aspect-square flex flex-col justify-center items-center w-full border-2 bg-slate-800 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all rounded-lg"
          >
            <h2 class="text-2xl font-medium mb-2 text-white">{project.name}</h2>
            <p class="text-center text-gray-300">{project.description}</p>
          </div>
        </a>
      {/each}
    </section>
  </div>
</div>

<div
  class="cg-large-container flex flex-col lg:items-center prose max-w-none mb-16 bg-gray-50 border-2 py-10"
>
  <h1 class="mb-2">Meet us</h1>
  <p class="w-full md:w-3/5 lg:w-5/6 lg:text-lg lg:text-center">
    As a collective with many initiatives, each with their own uniqueness, there has been separate
    organization dedicated to each. Creatorsgarten serves to bring all our initiatives together.
  </p>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    <a
      href="https://stupidhackth.github.io"
      class=" w-full flex justify-center items-center hover:scale-[1.01]"
    >
      <img class="w-full m-0" src="images/stupidhackth.svg" alt="" />
    </a>
    <a
      href="https://instagram.com/polaryz.club"
      class="w-full flex justify-center items-center hover:scale-[1.001]"
    >
      <img class="w-full m-0" src="images/polaryzclub.svg" alt="" />
    </a>
    <a
      href="https://showdown.space"
      class="w-full flex justify-center items-center hover:scale-[1.001]"
    >
      <img class="w-full m-0" src="images/showdownspace.svg" alt="" />
    </a>
  </div>
</div> -->
<style>
  .mesh {
    background: fixed;
    background-color: rgb(21, 94, 117);
    background-image: radial-gradient(at 48% 49%, rgb(254, 252, 232) 0, transparent 89%),
      radial-gradient(at 64% 44%, rgb(254, 242, 242) 0, transparent 18%),
      radial-gradient(at 64% 97%, rgb(28, 25, 23) 0, transparent 40%),
      radial-gradient(at 14% 17%, rgb(224, 242, 254) 0, transparent 82%),
      radial-gradient(at 43% 71%, rgb(244, 63, 94) 0, transparent 66%);
  }
  /* .mesh-2 {
    background-color: rgb(255, 228, 230);
    background-image: radial-gradient(at 66% 47%, rgb(232, 121, 249) 0, transparent 30%),
      radial-gradient(at 69% 59%, rgb(196, 181, 253) 0, transparent 51%),
      radial-gradient(at 56% 48%, rgb(21, 128, 61) 0, transparent 48%),
      radial-gradient(at 100% 32%, rgb(254, 240, 138) 0, transparent 18%),
      radial-gradient(at 31% 89%, rgb(24, 24, 27) 0, transparent 32%),
      radial-gradient(at 29% 63%, rgb(250, 250, 250) 0, transparent 33%);
  } */
  .mesh-3 {
    background: fixed;
    background-color: rgb(252, 165, 165);
    background-image: radial-gradient(at 79% 79%, rgb(236, 254, 255) 0, transparent 59%),
      radial-gradient(at 22% 84%, rgb(254, 249, 195) 0, transparent 47%),
      radial-gradient(at 55% 48%, rgb(136, 19, 55) 0, transparent 47%),
      radial-gradient(at 81% 52%, rgb(7, 89, 133) 0, transparent 52%),
      radial-gradient(at 19% 2%, rgb(147, 197, 253) 0, transparent 35%);
    /* radial-gradient(at 17% 34%, rgb(5, 150, 105) 0, transparent 6%); */
  }
</style>
