interface Data {
    channel: string;
    volume: number;
}

interface ClipData {
    data: Clip[];
}

interface Clip {
    item: number;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string | null;
    language: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    duration: number; // seconds
    vod_offset: number | null;
    is_featured: boolean;
    clip_url: string;
}

interface GameData {
    data: Game[];
}

interface Game {
    id: string;
    name: string;
    box_art_url: string;
    igdb_id: string;
    box_art_url_scaled: string;
}

const servers = ["https://twitchapi.teklynk.com", "https://twitchapi.teklynk.dev", "https://twitchapi2.teklynk.dev"];

const raidQueue: Data[] = [];
let isProcessing = false;

export async function Raid(data: Data) {
    raidQueue.push(data);
    if (!isProcessing) {
        processNext();
    }
}

async function processNext() {
    if (isProcessing) return;

    const next = raidQueue.shift();
    if (!next) return;

    isProcessing = true;

    const clip = await getClip(next.channel);
    if (!clip) {
        isProcessing = false;
        processNext();
        return;
    }

    const video = document.createElement("video");
    video.id = "videoplayer";
    video.src = clip.clip_url;
    video.poster = clip.thumbnail_url;
    video.volume = next.volume;
    video.autoplay = true;
    video.muted = false;
    video.controls = false;
    video.playsInline = true;

    const contentDiv = document.getElementById("contentdiv")!;
    contentDiv.appendChild(video);

    const info = document.createElement("div");
    info.className = "info-panel";

    const broadcasterSpan = document.createElement("span");
    broadcasterSpan.className = "broadcaster";
    broadcasterSpan.textContent = clip.broadcaster_name;
    info.appendChild(broadcasterSpan);

    const titleSpan = document.createElement("span");
    titleSpan.className = "title";
    const gameName = await getGameName(clip.game_id);
    titleSpan.textContent = gameName ? `${gameName} - ${clip.title}` : clip.title;
    info.appendChild(titleSpan);

    const dateSpan = document.createElement("span");
    dateSpan.className = "date";
    const created = new Date(clip.created_at);
    dateSpan.textContent = created.toLocaleDateString();
    info.appendChild(dateSpan);

    contentDiv.appendChild(info);

    video.addEventListener("ended", () => {
        contentDiv.removeChild(video);
        contentDiv.removeChild(info);
        isProcessing = false;
        processNext();
    });

    video.play();
}

async function getClip(channel: string): Promise<Clip | null> {
    const apiServer = servers[Math.floor(Math.random() * servers.length)];

    // get clips from the past month to avoid old clips
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = oneMonthAgo.toISOString();
    const apiUrl = `${apiServer}/getuserclips.php?channel=${channel}&end_date=${startDate}`;

    try {
        const response = await fetch(apiUrl);
        const clipData: ClipData = await response.json();

        if (clipData.data.length === 0) {
            // if no clips found, try again from all available clips
            const fallbackApiUrl = `${apiServer}/getuserclips.php?channel=${channel}`;
            const fallbackResponse = await fetch(fallbackApiUrl);
            const fallbackClipData: ClipData = await fallbackResponse.json();
            if (fallbackClipData.data.length === 0) {
                return null;
            }
            return fallbackClipData.data[0]!;
        }

        // check if there are any clips from the last stream (within past day), and pick the one with the most views
        // otherwise first try a week ago and then just pick the most viewed clip from the last month
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentClips = clipData.data.filter((clip) => {
            const createdAt = new Date(clip.created_at);
            return createdAt > oneDayAgo;
        });

        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lessRecentClips = clipData.data.filter((clip) => {
            const createdAt = new Date(clip.created_at);
            return createdAt > oneWeekAgo;
        });

        if (recentClips.length > 0) {
            recentClips.sort((a, b) => b.view_count - a.view_count);
            return recentClips[0]!;
        } else if (lessRecentClips.length > 0) {
            recentClips.sort((a, b) => b.view_count - a.view_count);
            return lessRecentClips[0]!;
        } else {
            clipData.data.sort((a, b) => b.view_count - a.view_count);
            // choose one of the top 5 randomly
            const topClips = clipData.data.slice(0, 5);
            return topClips[Math.floor(Math.random() * topClips.length)]!;
        }
    } catch (error) {
        console.error("Error fetching clip data:", error);
        return null;
    }
}

async function getGameName(gameId: string | null): Promise<string | null> {
    if (!gameId) return null;

    const apiServer = servers[Math.floor(Math.random() * servers.length)];
    const apiUrl = `${apiServer}/getgame.php?id=${gameId}`;

    try {
        const response = await fetch(apiUrl);
        const gameData: GameData = await response.json();
        return gameData.data[0]!.name;
    } catch (error) {
        console.error("Error fetching game data:", error);
        return null;
    }
}
