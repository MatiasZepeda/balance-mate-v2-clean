// Wheel Renderer - SVG-based emotion wheel generation and interaction
// Handles: drawing segments, text labels, animations, and user interactions

window.WheelRenderer = class WheelRenderer {
    constructor(svgElement, onSegmentClick) {
        this.svg = svgElement;
        this.onSegmentClick = onSegmentClick;
        this.cx = 250;
        this.cy = 250;
        this.r = 230;
    }

    // Draw the wheel with given emotion data
    draw(data) {
        console.log('🎨 Drawing wheel with data:', data);

        // Clear existing content
        this.svg.innerHTML = '';

        const angle = 360 / data.length;
        const rotationOffset = (data.length === 2) ? -90 : 0;

        // Draw each segment
        data.forEach((item, i) => {
            const startA = (i * angle) + rotationOffset;
            const endA = ((i + 1) * angle) + rotationOffset;
            const midA = startA + angle / 2;

            // Create segment path
            this.createSegment(item, i, startA, endA, angle);

            // Create segment text label
            this.createSegmentText(item, midA);
        });

        // Add center circle
        this.createCenterCircle();
    }

    // Create an SVG path segment
    createSegment(item, index, startA, endA, angle) {
        const rad1 = (startA - 90) * Math.PI / 180;
        const rad2 = (endA - 90) * Math.PI / 180;
        const x1 = this.cx + this.r * Math.cos(rad1);
        const y1 = this.cy + this.r * Math.sin(rad1);
        const x2 = this.cx + this.r * Math.cos(rad2);
        const y2 = this.cy + this.r * Math.sin(rad2);

        const largeArc = angle > 180 ? 1 : 0;
        const pathData = `M ${this.cx} ${this.cy} L ${x1} ${y1} A ${this.r} ${this.r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        const seg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        seg.setAttribute('d', pathData);
        seg.setAttribute('fill', item.color);
        seg.setAttribute('class', 'segment');
        seg.onclick = () => this.onSegmentClick(index, item);
        this.svg.appendChild(seg);
    }

    // Create text label for segment
    createSegmentText(item, midA) {
        const textRad = (midA - 90) * Math.PI / 180;
        const tx = this.cx + (this.r * 0.65) * Math.cos(textRad);
        const ty = this.cy + (this.r * 0.65) * Math.sin(textRad);

        let textRotation = midA;
        if (midA >= 90 && midA <= 270) {
            textRotation = midA + 180;
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('transform', `rotate(${textRotation}, ${tx}, ${ty})`);
        text.setAttribute('class', 'segment-text');
        text.textContent = item.name;
        this.svg.appendChild(text);
    }

    // Create center circle
    createCenterCircle() {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', this.cx);
        circle.setAttribute('cy', this.cy);
        circle.setAttribute('r', 40);
        circle.setAttribute('fill', '#F5F3EE');
        this.svg.appendChild(circle);
    }

    // Rotate wheel to selected segment
    rotateTo(index, totalSegments) {
        const angle = 360 / totalSegments;
        const rotation = -(index * angle);
        this.svg.style.transform = `rotate(${rotation}deg)`;
        return rotation;
    }

    // Reset rotation
    resetRotation() {
        this.svg.style.transform = 'rotate(0deg)';
    }
}
