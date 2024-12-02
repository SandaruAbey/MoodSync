const API_KEY = "Add_your_api_key";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchVideos") {
    const moodKeywords = {
      happy: "funny+videos",
      sad: "motivational+videos",
      motivation: "motivational+videos",
      focused: "study+music",
      relaxed: "calming+sounds",
    };

    const query = moodKeywords[message.mood] || "popular";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=10&key=${API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Store fetched video URLs in Chrome storage
        const videoLinks = data.items.map(
          (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
        );

        chrome.storage.local.set({ videoLinks }, () => {
          console.log("Video links saved:", videoLinks);
          sendResponse({ status: "success" });
        });
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        sendResponse({ status: "error" });
      });

    return true;
  }
});
