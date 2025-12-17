export function spotlight(_node: HTMLElement) {
    const glow = document.createElement('div');
    glow.className = 'spotlight-glow';
    document.body.appendChild(glow);

    const update = (e: MouseEvent) => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener('mousemove', update);

    return {
        destroy() {
            window.removeEventListener('mousemove', update);
            glow.remove();
        }
    };
}
