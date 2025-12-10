export function spotlight(_node: HTMLElement) {
    // Create the spotlight element dynamically
    const glow = document.createElement('div');
    glow.classList.add('spotlight-glow');
    document.body.appendChild(glow);

    function update(e: MouseEvent) {
        // Direct DOM manipulation for performance
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    // Use window listener to track mouse even outside the node if desired, 
    // or node listener if it should be scoped. Global spotlight -> window.
    window.addEventListener('mousemove', update);

    return {
        destroy() {
            window.removeEventListener('mousemove', update);
            if (glow.parentNode) {
                glow.parentNode.removeChild(glow);
            }
        }
    };
}
