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

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    div.appendChild(img);

    pages.push(div);

}

const ultima = document.createElement("div");

ultima.className = "page";

ultima.innerHTML = `
<div class="ultima">

<h1>PRIIT</h1>

<p>¿Querés inscribirte?</p>

<a href="https://formularios.ambiente.gba.gob.ar/form/37"
target="_blank">

INSCRIBIRME

</a>

</div>
`;

pages.push(ultima);

const flip = new St.PageFlip(
    document.getElementById("book"),
    {
        width:900,
        height:1273,
        size:"stretch",
        showCover:true,
        autoSize:true,
        usePortrait:true,
        maxShadowOpacity:0.4
    }
);

flip.loadFromHTML(pages);

document.getElementById("pageInfo").innerHTML =
`1 / ${pages.length}`;

flip.on("flip", e=>{

document.getElementById("pageInfo").innerHTML =
`${e.data+1} / ${pages.length}`;

});

document.getElementById("next").onclick=()=>flip.flipNext();

document.getElementById("prev").onclick=()=>flip.flipPrev();