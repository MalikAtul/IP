# Intro audio

Place your looping intro track here as **`intro.mp3`**:

```
public/audio/intro.mp3
```

The intro preloader references `/<base>/audio/intro.mp3` via a hidden
`<audio id="intro-audio" loop>` element and a mute/unmute toggle. The site
starts muted; sound is only enabled after a user interaction. No code change
is needed once the file is added — just drop it in.
