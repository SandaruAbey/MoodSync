chrome.storage.local.get("videoLinks", (data) => {
  if (data.videoLinks && data.videoLinks.length > 0) {
    // Create a container for the videos
    const container = document.createElement("div");
    container.id = "video-suggestions-container";
    container.style.padding = "50px";
    container.style.paddingLeft = "20px";
    container.style.backgroundColor = "#0F0F0F";
    container.style.border = "1px solid #ddd";
    container.style.marginBottom = "20px";
    container.style.marginTop = "20px";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "center";
    container.style.gap = "10px";

    const NameTitle = document.createElement("h1");
    NameTitle.innerText = "MoodSync";
    NameTitle.style.color = "#4CAF50";
    NameTitle.style.textAlign = "center";
    NameTitle.style.width = "100%";
    container.appendChild(NameTitle);

    const title = document.createElement("h3");
    title.innerText = "Mood-Based Video Suggestions";
    title.style.color = "#ffffff";
    title.style.marginBottom = "10px";
    title.style.textAlign = "center";
    title.style.width = "100%";
    container.appendChild(title);

    
    data.videoLinks.forEach((link) => {
      
      const videoId = getYouTubeVideoId(link);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; 

        // Create a clickable thumbnail
        const videoLink = document.createElement("a");
        videoLink.href = link;
        videoLink.target = "_blank";
        videoLink.style.display = "inline-block";

        const thumbnail = document.createElement("img");
        thumbnail.src = thumbnailUrl;
        thumbnail.alt = "YouTube Video Thumbnail";
        thumbnail.style.width = "100px"; 
        thumbnail.style.height = "auto"; 
        thumbnail.style.borderRadius = "8px";
        thumbnail.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

        videoLink.appendChild(thumbnail);
        container.appendChild(videoLink);
      }
    });

    const namebuttom = document.createElement("h5");
    namebuttom.innerText = "By Sandaru Abeykoon";
    namebuttom.style.color = "#ffffff";
    namebuttom.style.marginBottom = "3px";
    namebuttom.style.textAlign = "center";
    namebuttom.style.width = "100%";
    container.appendChild(namebuttom);

    // Insert the container into the YouTube page
    const parent = document.querySelector("#content");
    if (parent) {
      parent.insertBefore(container, parent.firstChild);
    }
  }
});


function getYouTubeVideoId(url) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] || match[2] : null;
}
if (
  window.location.hostname.includes("youtube.com") &&
  !document.getElementById("mood-popup")
) {
  // Create a popup container
  const popup = document.createElement("div");
  popup.id = "mood-popup";
  popup.style.position = "fixed";
  popup.style.top = "8%"; 
  popup.style.right = "10px"; 
  popup.style.transform = "none"; 
  popup.style.backgroundColor = "#fff";
  popup.style.border = "1px solid #ddd";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  popup.style.zIndex = "10000";
  popup.style.borderRadius = "8px";
  popup.style.textAlign = "center";
  popup.style.transition = "opacity 1s ease";

  
  popup.innerHTML = `
      <h1 style="color: #4CAF50;">MoodSync</h1>
      <h2 style="font-family: Arial, sans-serif; font-size: 20px; color: #333; margin-bottom: 15px;">
        How is your mood today?
      </h2>
      <select
        id="mood-select"
        style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; margin-bottom: 15px; color: #333; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);"
      >
        <option disabled selected>Select Your Mood</option>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="motivation">Motivation</option>
        <option value="focused">Focused</option>
        <option value="relaxed">Relaxed</option>
      </select>
      <br />
      <br />
      <button
        id="apply-mood"
        style="width: 100%; padding: 10px 15px; font-size: 14px; color: #fff; background-color: #4caf50; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); transition: background-color 0.3s ease;"
        onmouseover="this.style.backgroundColor='#45a049';"
        onmouseout="this.style.backgroundColor='#4caf50';"
      >
        Apply Mood
      </button>
      <button
        id="minimize-popup"
        style="width: 100%; padding: 10px 15px; font-size: 14px; color: #333; background-color: #f1f1f1; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; margin-top: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); transition: background-color 0.3s ease;"
        onmouseover="this.style.backgroundColor='#ddd';"
        onmouseout="this.style.backgroundColor='#f1f1f1';"
      >
        Minimize
      </button>
    `;

  
  document.body.appendChild(popup);

  
  document.getElementById("apply-mood").addEventListener("click", () => {
    const mood = document.getElementById("mood-select").value;

    
    chrome.storage.local.set({ mood }, () => {
      console.log(`Mood set to: ${mood}`);
    });

    
    chrome.runtime.sendMessage({ action: "fetchVideos", mood }, (response) => {
      if (response && response.status === "success") {
        location.reload(); // Reload the page after mood is set
      } else {
        alert("Failed to fetch videos.");
      }
    });

    
    removePopupWithEffect(popup);
  });

  setTimeout(() => {
    removePopupWithEffect(popup);
  }, 6000);

 
  document.getElementById("minimize-popup").addEventListener("click", () => {
    
    removePopupWithEffect(popup);
  });

  
  function removePopupWithEffect(popupElement) {
    popupElement.style.opacity = "0"; 
    setTimeout(() => {
      popupElement.remove();
    }, 1000);
  }
}
