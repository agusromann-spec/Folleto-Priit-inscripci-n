/* =========================================================
   PRIIT FLIPBOOK - SCRIPT
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const PDF_URL = "assets/006_folletopriit.pdf";

const MAX_ZOOM = 3;

const MIN_ZOOM = 1;

const ZOOM_STEP = 0.2;


/* =========================================================
   ELEMENTOS
========================================================= */

const book = document.getElementById("book");

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

let zoom = 1;

let pinchStartDistance = null;

let pinchStartZoom = 1;


/* =========================================================
   CARGAR PDF
========================================================= */

async function cargarPDF() {

    try {

        pageInfo.textContent = "Cargando...";


        const PDF =
            await window.pdfjsLib
                .getDocument(PDF_URL)
                .promise;


        const pages = [];


        /* =================================================
           CREAR PÁGINAS DEL PDF
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
                document.createElement("canvas");


            const context =
                canvas.getContext("2d", {
                    alpha: false
                });


            canvas.width =
                Math.ceil(viewport.width);


            canvas.height =
                Math.ceil(viewport.height);


            canvas.style.width = "100%";

            canvas.style.height = "100%";

            canvas.style.objectFit = "contain";

            canvas.draggable = false;


            await page.render({

                canvasContext: context,

                viewport: viewport

            }).promise;


            const pageDiv =
                document.createElement("div");


            pageDiv.className = "page";


            pageDiv.appendChild(canvas);


            pages.push(pageDiv);

        }


        /* =================================================
           ÚLTIMA PÁGINA PERSONALIZADA
        ================================================= */

        const ultima =
            document.createElement("div");


        ultima.className = "page";


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


        pages.push(ultima);


        /* =================================================
           CONFIGURACIÓN PAGEFLIP
        ================================================= */

        flip = new St.PageFlip(

            book,

            {

                flip = new St.PageFlip(
    book,
    {
        width: 900,
        height: 1273,

        size: "fixed",

        showCover: false,

        autoSize: false,

        usePortrait: true,

        mobileScrollSupport: false,

        maxShadowOpacity: 0.25,

        flippingTime: 700,

        drawShadow: true,

        startPage: 0
    }

        );


        /* =================================================
           CARGAR PÁGINAS
        ================================================= */

        flip.loadFromHTML(pages);


        /* =================================================
           CONTADOR INICIAL
        ================================================= */

        actualizarContador(0, pages.length);


        /* =================================================
           EVENTO CAMBIO DE PÁGINA
        ================================================= */

        flip.on("flip", event => {

            actualizarContador(
                event.data,
                pages.length
            );


            /*
             * Evita que el navegador
             * intente desplazar la página.
             */

            requestAnimationFrame(() => {

                window.scrollTo(0, 0);

            });

        });


        /* =================================================
           FINALIZAR CARGA
        ================================================= */

        requestAnimationFrame(() => {

            window.scrollTo(0, 0);

            aplicarZoom();

        });


    } catch (error) {

        console.error(
            "Error cargando el PDF:",
            error
        );


        pageInfo.textContent =
            "Error al cargar";

    }

}


/* =========================================================
   CONTADOR
========================================================= */

function actualizarContador(
    pagina,
    total
) {

    pageInfo.textContent =
        `${pagina + 1} / ${total}`;

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (!flip)
            return;


        flip.flipNext();

    }
);


prevButton.addEventListener(
    "click",
    () => {

        if (!flip)
            return;


        flip.flipPrev();

    }
);


/* =========================================================
   ZOOM
========================================================= */

function limitarZoom(valor) {

    return Math.max(
        MIN_ZOOM,
        Math.min(
            MAX_ZOOM,
            valor
        )
    );

}


function aplicarZoom() {

    zoom =
        limitarZoom(zoom);


    /*
     * El zoom se aplica únicamente
     * visualmente al libro.
     */

    book.style.transform =
        `scale(${zoom})`;

}


/* =========================================================
   ZOOM +
========================================================= */

zoomInButton.addEventListener(
    "click",
    () => {

        zoom =
            limitarZoom(
                zoom + ZOOM_STEP
            );


        aplicarZoom();

    }
);


/* =========================================================
   ZOOM -
========================================================= */

zoomOutButton.addEventListener(
    "click",
    () => {

        zoom =
            limitarZoom(
                zoom - ZOOM_STEP
            );


        aplicarZoom();

    }
);


/* =========================================================
   ZOOM CON CTRL + RUEDA
========================================================= */

zoomContainer.addEventListener(
    "wheel",
    event => {

        /*
         * En computadora solamente
         * hacemos zoom cuando se mantiene
         * presionado CTRL.
         */

        if (!event.ctrlKey)
            return;


        event.preventDefault();


        if (event.deltaY < 0) {

            zoom += 0.1;

        } else {

            zoom -= 0.1;

        }


        zoom =
            limitarZoom(zoom);


        aplicarZoom();

    },
    {
        passive: false
    }
);


/* =========================================================
   DISTANCIA ENTRE DOS DEDOS
========================================================= */

function obtenerDistancia(touch1, touch2) {

    const x =
        touch1.clientX -
        touch2.clientX;


    const y =
        touch1.clientY -
        touch2.clientY;


    return Math.sqrt(
        x * x + y * y
    );

}


/* =========================================================
   PINZA - TOUCHSTART
========================================================= */

zoomContainer.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 2
        ) {

            return;

        }


        pinchStartDistance =
            obtenerDistancia(
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
   PINZA - TOUCHMOVE
========================================================= */

zoomContainer.addEventListener(
    "touchmove",
    event => {

        if (
            event.touches.length !== 2
        ) {

            return;

        }


        event.preventDefault();


        if (
            pinchStartDistance === null
        ) {

            return;

        }


        const currentDistance =
            obtenerDistancia(
                event.touches[0],
                event.touches[1]
            );


        const factor =
            currentDistance /
            pinchStartDistance;


        zoom =
            limitarZoom(
                pinchStartZoom * factor
            );


        aplicarZoom();

    },
    {
        passive: false
    }
);


/* =========================================================
   PINZA - TOUCHEND
========================================================= */

zoomContainer.addEventListener(
    "touchend",
    event => {

        if (
            event.touches.length < 2
        ) {

            pinchStartDistance = null;

        }

    }
);


/* =========================================================
   EVITAR SCROLL DEL BODY
========================================================= */

document.addEventListener(
    "touchmove",
    event => {

        /*
         * Cuando se está usando una pinza,
         * impedimos el scroll del navegador.
         */

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
   EVITAR SCROLL AUTOMÁTICO
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY !== 0
        ) {

            window.scrollTo(
                0,
                0
            );

        }

    }
);


/* =========================================================
   CAMBIO DE TAMAÑO DE VENTANA
========================================================= */

let resizeTimer = null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    if (!flip)
                        return;


                    /*
                     * Volvemos a aplicar
                     * únicamente el zoom visual.
                     */

                    aplicarZoom();


                    window.scrollTo(
                        0,
                        0
                    );

                },
                150
            );

    }
);


/* =========================================================
   DOBLE CLICK / DOBLE TAP
========================================================= */

let lastTap = 0;


zoomContainer.addEventListener(
    "touchend",
    event => {

        /*
         * No activar doble tap durante
         * un gesto de dos dedos.
         */

        if (
            event.changedTouches.length !== 1
        ) {

            return;

        }


        const now =
            Date.now();


        if (
            now - lastTap < 300
        ) {

            /*
             * Doble toque:
             * alterna entre 1x y 2x.
             */

            if (zoom === 1) {

                zoom = 2;

            } else {

                zoom = 1;

            }


            aplicarZoom();

        }


        lastTap = now;

    }
);


/* =========================================================
   DESACTIVAR MENÚ CONTEXTUAL SOBRE EL LIBRO
========================================================= */

book.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


/* =========================================================
   INICIO
========================================================= */

cargarPDF();
