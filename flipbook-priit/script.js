import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
const pdf=await pdfjsLib.getDocument("assets/006_folletopriit.pdf").promise;let page=1;const c=document.getElementById("pdf"),ctx=c.getContext("2d");
async function render(){const pg=await pdf.getPage(page);const vp=pg.getViewport({scale:1.5});c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:ctx,viewport:vp}).promise;document.getElementById("p").textContent=`${page}/${pdf.numPages}`;}
window.next=()=>{if(page<pdf.numPages){page++;render();}};window.prev=()=>{if(page>1){page--;render();}};render();