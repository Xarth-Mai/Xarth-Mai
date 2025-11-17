const sequentialReveal = () => {
    const elements = document.querySelectorAll("[data-animate]");
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

const setBackgroundArtwork = () => {
    const body = document.body;
    if (!body) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight || 1;
    const screenRatio = screenWidth / screenHeight;

    const url = screenRatio > 1.5 ? "https://art.lzzz.ink" : "https://art.lzzz.ink/m";

    body.style.setProperty("--hero-image", `url('${url}')`);
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
    setBackgroundArtwork();
    fetchArtwork();
    sequentialReveal();
});

window.addEventListener("resize", setBackgroundArtwork);
