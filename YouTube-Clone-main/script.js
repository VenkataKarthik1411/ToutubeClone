import apiKey from "./apiConst.js";

const videoHttp = "https://www.googleapis.com/youtube/v3/videos";
const channeHttp = "https://www.googleapis.com/youtube/v3/channels";

const videoContainer = document.querySelector(".video-section");
const leftSection = document.querySelector('.side-section');
const rightSection = document.querySelector('.right-section');

const videoParams = new URLSearchParams({
    key: apiKey,
    part: "snippet,player",
    chart: "mostPopular",
    maxResults: 50,
    regionCode: "IN"
});

const videoUrl = `${videoHttp}?${videoParams.toString()}`;

fetch(videoUrl)
    .then((res) => res.json())
    .then((data) => {
        if (data.items) {
            data.items.forEach(item => {
                getChannelIcon(item);
            });
        } else {
            console.error("No video items found.");
        }
    })
    .catch((error) => console.log("Error fetching videos:", error));

const getChannelIcon = (item) => {
    const channelParams = new URLSearchParams({
        key: apiKey,
        part: "snippet",
        id: item.snippet.channelId
    }).toString();

    const channelUrl = `${channeHttp}?${channelParams}`;

    fetch(channelUrl)
        .then((res) => res.json())
        .then((res) => {
            if (res.items && res.items[0].snippet.thumbnails.high?.url) {
                // Assign higher resolution channel thumbnail
                item.snippet.channelThumbnail = {
                    url: res.items[0].snippet.thumbnails.high.url
                };
                makeVideoCard(item);
            } else {
                console.warn("Channel thumbnail not found for channel ID:", item.snippet.channelId);
            }
        })
        .catch((error) => console.log("Error fetching channel icon:", error));
};

const makeVideoCard = (item) => {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    videoCard.addEventListener("click", () => {
        window.location.href = `https://www.youtube.com/watch?v=${item.id}`;
    });

    // Attempting higher quality for both video and channel thumbnails
    const videoThumbnail = item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.maxres?.url || 'default_thumbnail.png';
    const channelThumbnail = item.snippet.channelThumbnail?.url || 'default_channel.png';

    videoCard.innerHTML = `
        <img class="t-img" src="${videoThumbnail}" alt="Video thumbnail">
        <div class="description">
            <img class="c-img" src="${channelThumbnail}" alt="Channel thumbnail">
            <div class="c-about">
                <p class = "title">${item.snippet.title}</p>
                <p class = "c-title">${item.snippet.channelTitle}</p>
            </div>
        </div>
    `;

    videoContainer.appendChild(videoCard);
};

// Prevent scroll on the left section from affecting the right section
leftSection.addEventListener('wheel', (event) => {
    event.stopPropagation(); // Stops the scroll event from affecting other elements
}, { passive: true });

// Ensure the right section scrolls independently
rightSection.addEventListener('wheel', (event) => {
    // You can also add custom behavior here if you want (e.g., adjust scroll speed)
}, { passive: true });
