const PDF = await window.pdfjsLib.getDocument(
    "assets/006_folletopriit.pdf"
).promise;

const pages = [];

for (let i = 1; i <= PDF.numPages; i++) {

    const page = await PDF.getPage(i);

    const viewport = page.getViewport({
        scale: 2.5
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: ctx,
        viewport
    }).promise;

    const div = document.createElement("div");
    div.className = "page";

    const img = document.createElement("img");

    img.src = canvas.toDataURL("image/png");

    img.draggable = false;

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    div.appendChild(img);

    pages.push(div);

}


/* ===========================================
   ULTIMA PAGINA
=========================================== */

const ultima = document.createElement("div");

ultima.className = "page";

ultima.innerHTML = `

<div class="ultima">

<a
class="btn-priit"
href="https://formularios.ambiente.gba.gob.ar/form/37"
target="_blank">

INSCRIBIRME

</a>

<a
class="btn-download"
href="assets/006_folletopriit.pdf"
download>

DESCARGAR PDF

</a>

</div>

`;

pages.push(ultima);


/* ===========================================
   PAGEFLIP
=========================================== */

const flip = new St.PageFlip(
    document.getElementById("book"),
    {
        width:900,
        height:1273,
        size:"stretch",
        autoSize:true,
        showCover:true,
        usePortrait:true,
        mobileScrollSupport:false,
        maxShadowOpacity:0.4
    }
);

flip.loadFromHTML(pages);


/* ===========================================
   CONTADOR
=========================================== */

const pageInfo = document.getElementById("pageInfo");

pageInfo.innerHTML = `1 / ${pages.length}`;

flip.on("flip", e => {

    pageInfo.innerHTML =
    `${e.data + 1} / ${pages.length}`;

    // evita el salto en Safari/iPhone
    window.scrollTo(0,0);

});


/* ===========================================
   BOTONES
=========================================== */

document.getElementById("next").onclick = () => {

    flip.flipNext();

};

document.getElementById("prev").onclick = () => {

    flip.flipPrev();

};


/* ===========================================
   ZOOM
=========================================== */

const zoomContainer = document.getElementById("zoomContainer");

const book = document.getElementById("book");

let zoom = 1;


function aplicarZoom(){

    book.style.transform =
    `scale(${zoom})`;

}


/* ===========================================
   BOTONES + -
=========================================== */

document.getElementById("zoomIn").onclick = ()=>{

    zoom += 0.2;

    if(zoom>3)
        zoom=3;

    aplicarZoom();

};

document.getElementById("zoomOut").onclick = ()=>{

    zoom -= 0.2;

    if(zoom<1)
        zoom=1;

    aplicarZoom();

};


/* ===========================================
   CTRL + RUEDA
=========================================== */

zoomContainer.addEventListener(

"wheel",

e=>{

    if(!e.ctrlKey)
        return;

    e.preventDefault();

    zoom += e.deltaY > 0 ? -0.1 : 0.1;

    zoom = Math.max(1,Math.min(3,zoom));

    aplicarZoom();

},

{passive:false}

);


/* ===========================================
   PINZA EN CELULAR
=========================================== */

let startDistance = null;

zoomContainer.addEventListener("touchstart",e=>{

    if(e.touches.length!==2)
        return;

    startDistance = Math.hypot(

        e.touches[0].clientX -
        e.touches[1].clientX,

        e.touches[0].clientY -
        e.touches[1].clientY

    );

});


zoomContainer.addEventListener("touchmove",e=>{

    if(e.touches.length!==2)
        return;

    e.preventDefault();

    const distance = Math.hypot(

        e.touches[0].clientX -
        e.touches[1].clientX,

        e.touches[0].clientY -
        e.touches[1].clientY

    );

    if(startDistance){

        const factor = distance/startDistance;

        zoom = Math.max(1,Math.min(3,factor));

        aplicarZoom();

    }

},

{passive:false});


zoomContainer.addEventListener("touchend",()=>{

    startDistance=null;

});


/* ===========================================
   RESPONSIVE
=========================================== */

window.addEventListener("resize",()=>{

    flip.update();

});


/* ===========================================
   EVITA SCROLL EN IOS
=========================================== */

document.body.addEventListener(

"touchmove",

e=>{

    if(zoom===1)
        e.preventDefault();

},

{passive:false}

);

window.scrollTo(0,0);
