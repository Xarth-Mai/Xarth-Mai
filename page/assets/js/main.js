const sequentialReveal = () => {
    const elements = document.querySelectorAll(".iUp");
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        elements.forEach(element => element.classList.add("up"));
        return;
    }

    elements.forEach((element, index) => {
        setTimeout(() => element.classList.add("up"), index * 150);
    });
};

const setPanelBackground = () => {
    const panel = document.querySelector("#panel");
    if (!panel) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight || 1;
    const screenRatio = screenWidth / screenHeight;

    const url = screenRatio > 1.5 ? "https://art.lzzz.ink" : "https://art.lzzz.ink/m";

    panel.style.background = `url('${url}') center center / cover no-repeat #020617`;
};

const updateDescription = data => {
    const descriptionElement = document.getElementById("description");
    if (!descriptionElement) return;

    const title = data?.title || "Don't look at me anymore.....";
    const author = data?.copyright || "Xarth";

    descriptionElement.innerHTML = `${title}<br/><strong>「${author}」</strong>`;
};

const fetchArtwork = async () => {
    try {
        const response = await fetch("https://art.lzzz.ink/e", { cache: "no-store" });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        updateDescription(data);
    } catch (error) {
        // Keep default copy when the request fails.
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setPanelBackground();
    fetchArtwork();
    sequentialReveal();
});

window.addEventListener("resize", setPanelBackground);
