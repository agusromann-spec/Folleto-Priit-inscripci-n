/* =========================================================
   PRIIT FLIPBOOK
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const PDF_URL =
    "assets/006_folletopriit.pdf";


const PDF_WIDTH = 900;

const PDF_HEIGHT = 1273;


/* =========================================================
   ELEMENTOS
========================================================= */

const book =
    document.getElementById("book");


const zoomContainer =
    document.getElementById("zoomContainer");


const pageInfo =
    document.getElementById("pageInfo");


const nextButton =
    document.getElementById("next");


const prevButton =
    document.getElementById("prev");


const zoomInButton =
    document.getElementById("zoomIn");


const zoomOutButton =
    document.getElementById("zoomOut");


/* =========================================================
   VARIABLES
========================================================= */

let flip = null;

let pages = [];

let zoom = 1;

let pinchStartDistance = null;

let pinchStartZoom = 1;


/* =========================================================
   DETECTAR ORIENTACIÓN
========================================================= */

function esMovil() {

    return window.innerWidth <= 900;

}


function estaHorizontal() {

    return window.innerWidth >
        window.innerHeight;

}


/* =========================================================
   CONFIGURAR TAMAÑO
========================================================= */

function configurarTamanio() {

    if (!book)
        return;


    /* ================================================
       CELULAR VERTICAL
       UNA PÁGINA
    ================================================ */

    if (
        esMovil() &&
        !estaHorizontal()
    ) {

        book.style.height = "78vh";

        book.style.width = "auto";

        return;

    }


    /* ================================================
       CELULAR HORIZONTAL
       DOS PÁGINAS
    ================================================ */

    if (
        esMovil() &&
        estaHorizontal()
    ) {

        book.style.height = "82vh";

        book.style.width = "auto";

        return;

    }


    /* ================================================
       PC
       DOS PÁGINAS
    ================================================ */

    book.style.width = "90vw";

    book.style.height = "82vh";

}


/* =========================================================
   CARGAR PDF
========================================================= */

async function cargarPDF() {

    try {

        pageInfo.textContent =
            "Cargando...";


        const PDF =
            await window.pdfjsLib
                .getDocument(PDF_URL)
                .promise;


        pages = [];


        /* =================================================
           CREAR PÁGINAS
        ================================================= */

        for (
            let i = 1;
            i <= PDF.numPages;
            i++
        ) {

            const page =
                await PDF.getPage(i);


            const viewport =
                page.getViewport({
                    scale: 2.5
                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext(
                    "2d",
                    {
                        alpha: false
                    }
                );


            canvas.width =
                Math.ceil(
                    viewport.width
                );


            canvas.height =
                Math.ceil(
                    viewport.height
                );


            canvas.style.width =
                "100%";


            canvas.style.height =
                "100%";


            canvas.draggable =
                false;


            await page.render({

                canvasContext:
                    context,

                viewport:
                    viewport

            }).promise;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "page";


            div.appendChild(
                canvas
            );


            pages.push(div);

        }


        /* =================================================
           ÚLTIMA PÁGINA
        ================================================= */

        const ultima =
            document.createElement(
                "div"
            );


        ultima.className =
            "page";


        ultima.innerHTML = `

            <div class="ultima">

                <a
                    class="btn-priit"
                    href="https://formularios.ambiente.gba.gob.ar/form/37"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    INSCRIBIRME
                </a>


                <a
                    class="btn-download"
                    href="${PDF_URL}"
                    download="folleto-PRIIT.pdf"
                >
                    DESCARGAR PDF
                </a>

            </div>

        `;


        pages.push(
            ultima
        );


        /* =================================================
           TAMAÑO INICIAL
        ================================================= */

        configurarTamanio();


        /* =================================================
           PAGEFLIP
        ================================================= */

        flip =
            new St.PageFlip(
                book,
                {

                    width:
                        PDF_WIDTH,

                    height:
                        PDF_HEIGHT,

                    size:
                        "stretch",

                    minWidth:
                        280,

                    maxWidth:
                        1800,

                    minHeight:
                        396,

                    maxHeight:
                        2546,

                    showCover:
                        false,

                    maxShadowOpacity:
                        0.25,

                    flippingTime:
                        700,

                    drawShadow:
                        true,

                    usePortrait:
                        true,

                    autoSize:
                        false,

                    mobileScrollSupport:
                        false,

                    startPage:
                        0

                }
            );


        /* =================================================
           CARGAR
        ================================================= */

        flip.loadFromHTML(
            pages
        );


        actualizarContador(
            0
        );


        /* =================================================
           CAMBIO DE PÁGINA
        ================================================= */

        flip.on(
            "flip",
            event => {

                actualizarContador(
                    event.data
                );


                requestAnimationFrame(
                    () => {

                        window.scrollTo(
                            0,
                            0
                        );

                    }
                );

            }
        );


        aplicarZoom();


    }

    catch (error) {

        console.error(
            "Error cargando PDF:",
            error
        );


        pageInfo.textContent =
            "Error";

    }

}


/* =========================================================
   CONTADOR
========================================================= */

function actualizarContador(
    pagina
) {

    if (!flip)
        return;


    const paginaActual =
        pagina + 1;


    /*
     * En horizontal se muestran
     * dos páginas.
     */

    if (
        esMovil() &&
        estaHorizontal()
    ) {

        const total =
            pages.length;


        const segunda =
            Math.min(
                paginaActual + 1,
                total
            );


        pageInfo.textContent =
            `${paginaActual}-${segunda} / ${total}`;

    }

    else {

        pageInfo.textContent =
            `${paginaActual} / ${pages.length}`;

    }

}


/* =========================================================
   BOTÓN SIGUIENTE
========================================================= */

nextButton.onclick =
    () => {

        if (!flip)
            return;


        flip.flipNext();

    };


/* =========================================================
   BOTÓN ANTERIOR
========================================================= */

prevButton.onclick =
    () => {

        if (!flip)
            return;


        flip.flipPrev();

    };


/* =========================================================
   ZOOM
========================================================= */

function aplicarZoom() {

    zoom =
        Math.max(
            1,
            Math.min(
                3,
                zoom
            )
        );


    book.style.transform =
        `scale(${zoom})`;

}


/* =========================================================
   ZOOM +
========================================================= */

zoomInButton.onclick =
    () => {

        zoom += 0.2;

        aplicarZoom();

    };


/* =========================================================
   ZOOM -
========================================================= */

zoomOutButton.onclick =
    () => {

        zoom -= 0.2;

        aplicarZoom();

    };


/* =========================================================
   CTRL + RUEDA
========================================================= */

zoomContainer.addEventListener(
    "wheel",
    event => {

        if (!event.ctrlKey)
            return;


        event.preventDefault();


        if (
            event.deltaY < 0
        ) {

            zoom += 0.1;

        }
        else {

            zoom -= 0.1;

        }


        aplicarZoom();

    },
    {
        passive: false
    }
);


/* =========================================================
   DISTANCIA DE PINZA
========================================================= */

function distancia(
    a,
    b
) {

    const x =
        a.clientX -
        b.clientX;


    const y =
        a.clientY -
        b.clientY;


    return Math.sqrt(
        x * x +
        y * y
    );

}


/* =========================================================
   PINZA - INICIO
========================================================= */

zoomContainer.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 2
        )
            return;


        pinchStartDistance =
            distancia(
                event.touches[0],
                event.touches[1]
            );


        pinchStartZoom =
            zoom;

    },
    {
        passive: false
    }
);


/* =========================================================
   PINZA - MOVIMIENTO
========================================================= */

zoomContainer.addEventListener(
    "touchmove",
    event => {

        if (
            event.touches.length !== 2
        )
            return;


        event.preventDefault();


        if (
            pinchStartDistance === null
        )
            return;


        const actual =
            distancia(
                event.touches[0],
                event.touches[1]
            );


        const factor =
            actual /
            pinchStartDistance;


        zoom =
            pinchStartZoom *
            factor;


        aplicarZoom();

    },
    {
        passive: false
    }
);


/* =========================================================
   PINZA - FIN
========================================================= */

zoomContainer.addEventListener(
    "touchend",
    event => {

        if (
            event.touches.length < 2
        ) {

            pinchStartDistance =
                null;

        }

    }
);


/* =========================================================
   CAMBIO DE ORIENTACIÓN
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    configurarTamanio();


                    /*
                     * Volvemos a 1x cuando
                     * cambia vertical/horizontal.
                     */

                    zoom = 1;

                    aplicarZoom();


                    if (flip) {

                        flip.update();

                    }

                },
                250
            );

    }
);


/* =========================================================
   EVITAR SCROLL
========================================================= */

document.addEventListener(
    "touchmove",
    event => {

        if (
            event.touches.length >= 2
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   INICIO
========================================================= */

configurarTamanio();

cargarPDF();
