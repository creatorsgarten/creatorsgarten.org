import { useEffect } from 'react'

let triggered: Promise<typeof YT> | null = null
async function loadYouTubeApi(): Promise<typeof YT> {
  if (triggered) return triggered

  const myWindow = window as unknown as { YT?: typeof YT }
  if (myWindow.YT) return myWindow.YT!

  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  tag.async = true
  return (triggered = new Promise<typeof YT>((resolve, reject) => {
    Object.assign(myWindow, {
      onYouTubeIframeAPIReady: () => resolve(myWindow.YT!),
    })
    tag.onerror = reject
    document.head.appendChild(tag)
  }))

  // //Holds a reference to the YouTube player
  // var player;

  // //this function is called by the API
  // function onYouTubeIframeAPIReady() {
  //     //creates the player object
  //     player = new YT.Player('player');

  //     //subscribe to events
  //     player.addEventListener("onReady",       "onYouTubePlayerReady");
  //     player.addEventListener("onStateChange", "onYouTubePlayerStateChange");
  // }

  // function onYouTubePlayerReady(event) {
  //     event.target.playVideo();
  // }

  // function onYouTubePlayerStateChange(event) {
  //     switch (event.data) {
  //         case YT.PlayerState.ENDED:
  //             if($('#link-1').length > 0) {
  //                 var href = $('#link-1').attr('href');
  //                 window.location.href = href;
  //             }
  //             break;
  //     }
  // }
}

export default function CueHighlighter(props: { iframeId: string }) {
  const iframeId = props.iframeId
  useEffect(() => {
    let canceled = false
    let onCancel = () => {}
    loadYouTubeApi().then(YT => {
      if (canceled) return
      const player = new YT.Player(iframeId)
      player.addEventListener('onReady', () => {
        for (const context of document.querySelectorAll(
          `[data-cue-by="${iframeId}"]`
        )) {
          const element = context as HTMLElement
          element.dataset.interactive = 'true'
        }
        const cues = Array.from(
          document.querySelectorAll(`[data-cue-by="${iframeId}"] [data-cue]`),
          element => {
            const [start, end] = element.getAttribute('data-cue')!.split('-')
            element.addEventListener('click', () => {
              const [start] = element.getAttribute('data-cue')!.split('-')
              player.seekTo(parseFloat(start) / 1000, true)
            })
            return {
              start: parseFloat(start),
              end: end ? parseFloat(end) : Infinity,
              element: element as HTMLElement,
            }
          }
        )
        let active = new Set<(typeof cues)[number]>()
        const interval = setInterval(() => {
          const time = player.getCurrentTime() * 1000 - 1
          const matching = new Set(
            cues.filter(cue => cue.start <= time && time < cue.end)
          )
          for (const cue of active) {
            if (!matching.has(cue)) {
              delete cue.element.dataset.active
            }
          }
          for (const cue of matching) {
            if (!active.has(cue)) {
              cue.element.dataset.active = 'true'
            }
          }
          active = matching
        }, 100)
        onCancel = () => clearInterval(interval)
      })
    })
    return () => {
      canceled = true
      onCancel()
    }
  }, [iframeId])
  return <></>
}
