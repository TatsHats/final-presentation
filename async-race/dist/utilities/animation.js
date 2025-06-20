export class Animation {
    static startAnimation(carElement, distancePx, speed) {
        let shift = 0;
        let lastTime = performance.now();
        function animate(currentTime) {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            shift += speed * deltaTime;
            if (shift < distancePx) {
                carElement.style.transform = `translateX(${shift}px)`;
                Animation.animationId = requestAnimationFrame(animate);
            }
            else {
                carElement.style.transform = `translateX(${distancePx}px)`;
                Animation.stopAnimation();
            }
        }
        Animation.animationId = requestAnimationFrame((time) => {
            lastTime = time;
            animate(time);
        });
    }
    static stopAnimation() {
        if (Animation.animationId !== undefined) {
            cancelAnimationFrame(Animation.animationId);
        }
    }
}
