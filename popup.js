document.getElementById("apply-mood").addEventListener("click", () => {
  const mood = document.getElementById("mood-select").value;

  // Store the mood in Chrome storage

  chrome.storage.local.set({ mood }, () => {
    console.log(`Mood set to: ${mood}`);
  });

  // Send message to background script
  chrome.runtime.sendMessage({ action: "fetchVideos", mood }, (response) => {
    if (response && response.status === "success") {
      //alert("Videos fetched! Check your YouTube feed.");
      if (window.location.hostname.includes("https://www.youtube.com")) {
        location.reload();
      } else {
        // Open a new tab with YouTube if not on YouTube
        window.open("https://www.youtube.com", "_blank");
      }
    } else {
      alert("Failed to fetch videos.");
    }
  });
});
