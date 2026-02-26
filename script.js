let users = JSON.parse(localStorage.getItem('blokie_db')) || [{user: "Admin", pass: "123", bloks: 100}];
let currentUser = null;
let walkStep = 0;

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function switchTab(el, tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function handleSignUp() {
    const u = document.getElementById('user-input').value.trim();
    const p = document.getElementById('pass-input').value.trim();
    if(u.length < 3) return alert("Username too short!");
    users.push({user: u, pass: p, bloks: 50});
    localStorage.setItem('blokie_db', JSON.stringify(users));
    alert("Signed up!");
}

function handleLogin() {
    const u = document.getElementById('user-input').value;
    const p = document.getElementById('pass-input').value;
    currentUser = users.find(acc => acc.user === u && acc.pass === p);
    if (currentUser) {
        document.getElementById('balance').textContent = currentUser.bloks.toLocaleString();
        showView('home-view');
    } else {
        document.getElementById('login-warn').style.display = "block";
    }
}

function buyBloks(amount) {
    if(confirm(`Purchase ${amount} Bloks?`)) {
        currentUser.bloks += amount;
        updateDB();
        document.getElementById('balance').textContent = currentUser.bloks.toLocaleString();
    }
}

function buyItem(price) {
    if(currentUser.bloks >= price) {
        currentUser.bloks -= price;
        updateDB();
        document.getElementById('balance').textContent = currentUser.bloks.toLocaleString();
        alert("Purchased!");
    } else { alert("Not enough Bloks!"); }
}

function updateDB() {
    const idx = users.findIndex(u => u.user === currentUser.user);
    users[idx].bloks = currentUser.bloks;
    localStorage.setItem('blokie_db', JSON.stringify(users));
}

function openGame(name) { showView('game-detail-view'); }

function launchEngine() {
    showView('game-engine-view');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').innerHTML = "";
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x3a9d23 }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const group = new THREE.Group();
    const shirtColor = document.getElementById('shirt-color').value;
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.6), new THREE.MeshStandardMaterial({color: shirtColor}));
    body.position.y = 1.9; group.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xffccaa}));
    head.position.y = 3.2; group.add(head);

    scene.add(group);
    camera.position.set(0, 10, 15);

    const keys = {};
    window.onkeydown = (e) => keys[e.key.toLowerCase()] = true;
    window.onkeyup = (e) => keys[e.key.toLowerCase()] = false;

    function animate() {
        requestAnimationFrame(animate);
        if(keys['w']) group.position.z -= 0.15;
        if(keys['s']) group.position.z += 0.15;
        if(keys['a']) group.position.x -= 0.15;
        if(keys['d']) group.position.x += 0.15;
        camera.position.lerp(new THREE.Vector3(group.position.x, 10, group.position.z + 15), 0.1);
        camera.lookAt(group.position);
        renderer.render(scene, camera);
    }
    animate();
}