// Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const newPhotoBtn = document.getElementById('newPhotoBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn'); // 🔹 Nuevo botón
const galleryContainer = document.getElementById('gallery'); // 🔹 Galería

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stream = null;
let usingFrontCamera = false; // 🔹 Control para saber qué cámara usar

// 🔹 Abrir cámara
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: usingFrontCamera ? 'user' : 'environment' },
                width: { ideal: 320 },
                height: { ideal: 240 }
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        cameraContainer.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;
        switchCameraBtn.style.display = 'inline-block'; // 🔹 Mostrar botón de cambio

        console.log(`Cámara ${usingFrontCamera ? 'frontal' : 'trasera'} abierta`);
    } catch (error) {
        console.error('Error al abrir cámara:', error);
        alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
}

// 🔹 Tomar foto (fotograma actual)
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara');
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtener imagen como Base64
    const photoData = canvas.toDataURL('image/png'); // 🔹 Base64

    // 🔹 Agregar foto a galería
    addPhotoToGallery(photoData);

    // Mostrar la foto capturada en el canvas
    video.style.display = 'none';
    canvas.style.display = 'block';
    takePhotoBtn.style.display = 'none';
    newPhotoBtn.style.display = 'inline-block';

    console.log('Foto capturada');
}

// 🔹 Agregar foto a la mini galería
function addPhotoToGallery(base64Image) {
    const img = document.createElement('img');
    img.src = base64Image;
    img.classList.add('photo-card');
    galleryContainer.appendChild(img);
}

// 🔹 Preparar para nueva foto
function prepareNewPhoto() {
    video.style.display = 'block';
    canvas.style.display = 'none';
    takePhotoBtn.style.display = 'inline-block';
    newPhotoBtn.style.display = 'none';
}

// 🔹 Cambiar entre cámara frontal y trasera
async function switchCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        alert('Tu dispositivo no soporta cambio de cámara.');
        return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    if (videoDevices.length < 2) {
        alert('Solo se detectó una cámara. No se puede cambiar.');
        return;
    }

    // Detener cámara actual
    closeCamera();

    // Cambiar el modo
    usingFrontCamera = !usingFrontCamera;
    console.log('Cambiando a cámara:', usingFrontCamera ? 'frontal' : 'trasera');
    openCamera();
}

// 🔹 Cerrar cámara y liberar recursos
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        openCameraBtn.disabled = false;
        openCameraBtn.textContent = 'Abrir Cámara';
        console.log('Cámara cerrada');
    }
}

// 🔹 Event Listeners
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
newPhotoBtn.addEventListener('click', prepareNewPhoto);
switchCameraBtn.addEventListener('click', switchCamera); // 🔹 Nuevo evento
window.addEventListener('beforeunload', closeCamera);
