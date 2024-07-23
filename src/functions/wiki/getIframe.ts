export const getIframe = (url: string, id = '') => {
  return `
    <div class="max-w-2xl mx-auto w-full aspect-[16/9]">
      <iframe ${id ? `id="${id}"` : ''}
        src="${url}"
        class="w-full aspect-[16/9]"
        style="border:0"
        loading="lazy"
        allowfullscreen
      ></iframe>
    </div>
  `
}
