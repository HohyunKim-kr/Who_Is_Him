const blocks = document.querySelectorAll(".blockchain-block");
const lines = document.querySelectorAll(".connection-line");
const container = document.querySelector(".container");
const earth = document.getElementById("earth");

let scene, camera, renderer, controls;
let particles = null;
let explosionTime = null;
let isThreeJSActive = false;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
}

function animateBlockchain(index = 0) {
    if (index >= blocks.length) {
        setTimeout(mergeBlocks, 1000);
        return;
    }

    const block = blocks[index];
    const line = index > 0 ? lines[index - 1] : null;

    setTimeout(() => {
        block.classList.add("active", "neon-glow");
        block.style.transform = `translateY(0)`;

        if (line) {
            block.classList.add("connected");
            line.style.width = "50px";
            line.style.opacity = "0.5";
        }

        animateBlockchain(index + 1);
    }, 1000 * index);
}

function mergeBlocks() {
    blocks.forEach((block) => {
        block.style.transition = "all 1s ease";
        block.style.left = "425px";
        block.style.top = "175px";
        block.style.width = "20px";
        block.style.height = "20px";
        block.style.borderRadius = "50%";
        block.style.fontSize = "0";
    });

    setTimeout(() => {
        blocks.forEach((block) => block.remove());
        lines.forEach((line) => line.remove());
        showGlobalNodes();
    }, 1000);
}

function showGlobalNodes() {
    earth.classList.add("active");

    const nodes = [];
    const earthCenterX = 450;
    const earthCenterY = 200;
    const radius = 120;
    const nodeCount = 7;

    for (let i = 0; i < nodeCount; i++) {
        const angle = ((2 * Math.PI) / nodeCount) * i;
        const x = earthCenterX + radius * Math.cos(angle);
        const y = earthCenterY + radius * Math.sin(angle);
        const node = document.createElement("div");
        node.classList.add("node");
        node.style.left = `${x - 10}px`;
        node.style.top = `${y - 10}px`;
        container.appendChild(node);
        nodes.push({ element: node, x, y });
    }

    const nodeLines = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const start = nodes[i];
            const end = nodes[j];
            const line = document.createElement("div");
            line.classList.add("node-line");
            const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
            const angle = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
            line.style.width = `${length}px`;
            line.style.left = `${start.x}px`;
            line.style.top = `${start.y}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = "0 0";
            container.appendChild(line);
            nodeLines.push(line);
        }
    }

    nodes.forEach((node, index) => {
        setTimeout(() => {
            node.element.classList.add("active");
        }, 500 * index);
    });

    nodeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = "0.5";
            if (index === nodeLines.length - 1) {
                setTimeout(() => transitionToBigBang(nodes), 1000);
            }
        }, 250 * (index + nodes.length));
    });
}

function transitionToBigBang(nodes) {
    container.style.opacity = "0";
    document.body.style.background = "#000";
    isThreeJSActive = true;
    setTimeout(() => {
        container.style.display = "none";
        createBigBangEffect(nodes);
    }, 1000);
}

function createBigBangEffect(nodes) {
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        if (i < nodes.length) {
            const node = nodes[i];
            positions[i * 3] = (node.x - window.innerWidth / 2) / 100;
            positions[i * 3 + 1] = -(node.y - window.innerHeight / 2) / 100;
            positions[i * 3 + 2] = 0;
            velocities[i * 3] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        } else {
            const radius = Math.random() * 5;
            const angle = Math.random() * Math.PI * 2;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius * 0.2;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
            velocities[i * 3] = Math.cos(angle) * 0.05;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = Math.sin(angle) * 0.05;
        }

        const colorChoice = Math.random();
        if (colorChoice < 0.7) {
            colors[i * 3] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else if (colorChoice < 0.9) {
            colors[i * 3] = 0.2 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
            colors[i * 3] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
        }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 1
    });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    explosionTime = Date.now();
}

function handleBigBangAndCosmos() {
    const elapsedTime = (Date.now() - explosionTime) / 1000;
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;

    if (elapsedTime < 4) {
        // 빅뱅 확장 (0~4초)
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];
            velocities[i * 3] *= 0.98;
            velocities[i * 3 + 1] *= 0.98;
            velocities[i * 3 + 2] *= 0.98;
        }
    } else if (elapsedTime < 6) {
        // 빅뱅 합쳐짐 및 소멸 (4~6초)
        const t = (elapsedTime - 4) / 2;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] -= velocities[i * 3] * (1 - t);
            positions[i * 3 + 1] -= velocities[i * 3 + 1] * (1 - t);
            positions[i * 3 + 2] -= velocities[i * 3 + 2] * (1 - t);
        }
        particles.material.opacity = 1 - t;
    } else if (elapsedTime >= 6 && particles) {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
        particles = null;
        explosionTime = null;
        createCosmosNodes();
    }

    if (particles) {
        particles.geometry.attributes.position.needsUpdate = true;
    }
}

function createCosmosNodes() {
    const particleCount = 50;
    const cosmosGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phi = Math.PI * (3. - Math.sqrt(5.));
    const radius = 5;

    for (let i = 0; i < particleCount; i++) {
        const y = 1 - (i / (particleCount - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        positions[i * 3] = Math.cos(theta) * radiusAtY * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;

        const colorChoice = Math.random();
        if (colorChoice < 0.7) {
            colors[i * 3] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else if (colorChoice < 0.9) {
            colors[i * 3] = 0.2 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
            colors[i * 3] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
        }
    }

    cosmosGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    cosmosGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const cosmosMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        sizeAttenuation: true
    });
    particles = new THREE.Points(cosmosGeometry, cosmosMaterial);
    scene.add(particles);

    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
        }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.3
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
}

let time = 0;
function animate() {
    requestAnimationFrame(animate);

    if (isThreeJSActive && particles && explosionTime) {
        handleBigBangAndCosmos();
    } else if (particles && !explosionTime) {
        time += 0.05;
        particles.material.opacity = Math.min(1, particles.material.opacity + 0.02);
        particles.material.size = 0.1 + Math.sin(time) * 0.05;
        // 3초 후 resume.html로 이동
        if (time >= 6) {
            window.location.href = "resume.html";
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

const particleCount = 1000;
initThreeJS();
animate();
animateBlockchain();

window.addEventListener("resize", () => {
    blocks.forEach((block, index) => {
        block.style.top = "150px";
        block.style.left = `${50 + index * 200}px`;
    });
    lines.forEach((line, index) => {
        line.style.top = "200px";
        line.style.left = `${200 + index * 200}px`;
        line.style.width = "50px";
    });
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});