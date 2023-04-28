export const getIframe = (url: string) => {
  return `
    <div class="max-w-2xl mx-auto w-full aspect-[16/9]">
      <iframe
        src="${url}"
        class="w-full aspect-[16/9]"
        style="border:0"
        loading="lazy"
        allowfullscreen
      ></iframe>
    </div>
  `
}
