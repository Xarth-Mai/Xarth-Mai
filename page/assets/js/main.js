const iUp = (() => {
    let time = 0;
    const duration = 150;

    const clean = () => {
        time = 0;
    };

    const up = element => {
        if (!element) return;
        setTimeout(() => {
            element.classList.add("up");
        }, time);
        time += duration;
    };

    const down = element => {
        if (!element) return;
        element.classList.remove("up");
    };

    const toggle = element => {
        if (!element) return;
        setTimeout(() => {
            element.classList.toggle("up");
        }, time);
        time += duration;
    };

    return {
        clean,
        up,
        down,
        toggle
    };
})();

const setPanelBackground = () => {
    const panel = document.querySelector("#panel");
    if (!panel) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight || 1;
    const screenRatio = screenWidth / screenHeight;

    const url = screenRatio > 1.5 ? "https://art.lzzz.ink" : "https://art.lzzz.ink/m";

    panel.style.background = `url('${url}') center center no-repeat #666`;
    panel.style.backgroundSize = "cover";
};

const updateDescription = data => {
    const descriptionElement = document.getElementById("description");
    if (!descriptionElement || !data) return;

    const title = data.title || "Don't look at me anymore.....";
    const author = data.copyright || "Xarth";

    descriptionElement.innerHTML = `${title}<br/><strong>「${author}」</strong>`;
};

const fetchArtwork = () => {
    fetch("https://art.lzzz.ink/e")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(updateDescription)
        .catch(() => {
            // 静默失败，保留默认文案
        });
};

const initAnimations = () => {
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        document.querySelectorAll(".iUp").forEach(element => {
            element.classList.add("up");
        });
        return;
    }

    const iUpElements = document.querySelectorAll(".iUp");
    iUp.clean();
    iUpElements.forEach(element => {
        iUp.up(element);
    });
};

const initAvatar = () => {
    const avatarElement = document.querySelector(".js-avatar");
    if (!avatarElement) return;

    if (avatarElement.complete) {
        avatarElement.classList.add("show");
    } else {
        avatarElement.addEventListener("load", () => {
            avatarElement.classList.add("show");
        });
    }
};

const initMobileMenu = () => {
    const btnMobileMenu = document.querySelector(".btn-mobile-menu__icon");
    const navigationWrapper = document.querySelector(".navigation-wrapper");

    if (!btnMobileMenu || !navigationWrapper) return;

    btnMobileMenu.addEventListener("click", () => {
        navigationWrapper.classList.toggle("visible");
        navigationWrapper.classList.toggle("animated");
        navigationWrapper.classList.toggle("bounceInDown");
        btnMobileMenu.classList.toggle("icon-list");
        btnMobileMenu.classList.toggle("icon-angleup");
        btnMobileMenu.classList.toggle("fadeIn");
    });
};

document.addEventListener("DOMContentLoaded", () => {
    setPanelBackground();
    fetchArtwork();
    initAnimations();
    initAvatar();
    initMobileMenu();
});
