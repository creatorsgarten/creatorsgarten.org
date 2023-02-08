---
layout: $layouts/content.astro
---

We have a YouTube channel at <https://youtube.com/@creatorsgarten>. They are for publishing talks VODs.

Meanwhile, livestream archives can be found on the [Creatorsgarten Facebook page](https://www.facebook.com/creatorsgarten/videos/).

# Common audio/video issues

For livestreaming:

- Audio too quiet. Check in OBS that when speaking, the sound level is in the yellow color zone [between -20 and -9 dB](https://www.reddit.com/r/Twitch/comments/nctu56/best_sound_levels_for_obs/)

- Audio output works in one channel only. Check in OBS and make sure that there are 2 volume bars (left and right channel). If the problem from the source signal cannot be fixed, go to Advanced Audio Settings and make it mono.

For preparing VODs:

- Video and audio not synchronizing. In a video editor software, detach the audio from video, so that they can be moved independently.

- Issues that interrupt the presentation. For example, connectivity problems, technical issues. They might be safe to cut out from the VOD.

- Audio output works in one channel only. To fix in post, convert the audio to mono.

- Microphone feedback loop and noise. To fix in post, if you have Final Cut Pro you can use the [Voice Isolation](https://support.apple.com/guide/final-cut-pro/enhance-audio-verc1fab873/mac#:~:text=of%20equalization%20presets.-,Voice%20Isolation,-%3A%20Prioritizes%20human) feature.

# VOD preparation

- [Work on preparing VODs are being coordinated on Airtable.](https://airtable.com/shru5fGOzjhHHxo05)

- Each talk goes through several stages before they are published to the YouTube channel.

  1.  **Source** — Obtain the source material, either recorded in OBS, or downloaded back from Facebook Live. Re-upload it to YouTube (unlisted) for easy viewing, and also upload it to OneDrive for easy downloading by teammates.

  2.  **Timestamp** — Determine the time range within the source material that contains the talk.

      - It does not need to be precise, just a hint for other teammates on where to find the talk.

  3.  **Slice** — Cut the source video around the time range and put it in its own file. This results in a smaller file that’s easier to work with.

      - This step can be automated. The [`cut`](https://github.com/creatorsgarten/videos/blob/main/bin/cut) script can be used to cut the video in a lossless manner using ffmpeg. It generates a `.source.mp4` file. One minute of padding is added to the video to account for imprecise timestamps in step 2.

  4.  **Fix** — Perhaps the most resource-consuming part of this process. Watch the talk to identify the issues in the video, and fix them if possible.

      - Examples: Cut out the part where the talk is interrupted by a technical issue. Cut out the part where people are just passing the mic around. Apply noise reduction. Fix audio channel issues. Boost the audio level if source file is extremely quiet.

      - In simple cases, this can be done via a simple video editing software like iMovie.

  5.  **Upload** — The video is uploaded to YouTube (unlisted).

  6.  **Publish** — The video is published to YouTube as a public video.

- Supporting code lives in [creatorsgarten/videos](https://github.com/creatorsgarten/videos) repository.

- If you’d like to help, you can find us [in the #📼-vod channel on Creatorsgarten’s Discord server](https://discord.gg/mVX8yEdhWX) and mention to “@VOD Team”.
