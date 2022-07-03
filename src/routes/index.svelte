<script>
    import { hacks } from "../data/hacks.js"
</script>

<section>
    <img src="images/cover.webp" class="border-2 border-black" alt="">
</section>

<section class="w-full xl:w-3/4 py-4">
    <h1 class="text-3xl font-medium py-4">creatorsgarten = garden of creators</h1>
    <p class="text-xl pb-2">We are a diverse group of people who are united by our love for creating things. We believe that through the lens of creation and technology, we can discover the fun and beauty in everything around us. We stand for:</p>
    <p class="text-xl pb-2"><span class="font-semibold">Creativity</span>: We believe that creativity is a fundamental human quality that should be nurtured and encouraged. We believe that everyone has the potential to be creative, and that the world is a better place when we all express our creativity.</p>
    <p class="text-xl pb-2"><span class="font-semibold">Empathy</span>: We believe in putting ourselves in others' shoes, and using our skills to make a positive impact on the world.</p>
    <p class="text-xl pb-4"><span class="font-semibold">Fun</span>: We believe that work should be enjoyable, and that every day is an opportunity to learn something new and have some fun.</p>
    <button class="border-2 border-black px-2 py-1 rounded-md hover:bg-gray-100"><a href="/manifesto">Manifesto</a></button>
</section>

<section><h1 class="text-3xl font-medium py-4">Hacks</h1></section>
<section class="pb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-4">
    {#each [...hacks].reverse() as hack}
        <div class="aspect-square w-full hover:scale-[1.003] hover:shadow-sm hover:transition-all border-2 border-black">
            <img src={hack.img} class="" alt="">
        </div>
    {/each}
</section>