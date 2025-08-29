interface Data {
    channel: string;
    volume: number;
}

const servers = [
    "https://twitchapi.teklynk.com",
    "https://twitchapi.teklynk.dev",
    "https://twitchapi2.teklynk.dev",
];

export async function Raid(data: Data) {
    const apiServer = servers[Math.floor(Math.random() * servers.length)];
    const channel = data.channel;

    // TODO: add end date to avoid too old clips
    const apiUrl = `${apiServer}/getuserclips.php?channel=${channel}&random=true`;
    const response = await fetch(apiUrl);
    const clipData = await response.json();

    // TODO: handle no clips found
    if (clipData.data.length === 0) {
        return;
    }
    const clip = clipData.data[0];

    const video = document.createElement("video");
    video.id = "videoplayer";
    video.src = clip.clip_url;
    video.poster = clip.thumbnail_url;
    video.volume = data.volume;
    video.autoplay = true;
    video.muted = false;
    video.controls = false;
    video.playsInline = true;

    const contentDiv = document.getElementById("contentdiv")!;
    contentDiv.appendChild(video);

    video.addEventListener("ended", () => {
        contentDiv.removeChild(video);
    });

    video.play();
}
