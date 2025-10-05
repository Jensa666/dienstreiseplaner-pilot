const form = document.getElementById('planForm');
const result = document.getElementById('result');
const dist = document.getElementById('dist');
const cost = document.getElementById('cost');
const erst = document.getElementById('erst');
const dur  = document.getElementById('dur');
const klar = document.getElementById('klar');

const fmtEur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

form.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const start = document.getElementById('start').value.trim();
  const ziel  = document.getElementById('ziel').value.trim();
  const datum = document.getElementById('datum').value;
  const beginn= document.getElementById('beginn').value;
  if(!start || !ziel || !datum || !beginn){
    alert('Bitte füllen Sie alle Pflichtfelder aus (Start, Ziel, Datum, Beginn).');
    return;
  }

  const payload = {
    start, ziel, datum, beginn,
    fahrzeug:  document.getElementById('fahrzeug').value,
    interesse: document.getElementById('interesse').value,
    hotel:     document.getElementById('hotel').value
  };

  const res = await fetch('/api/plan', {
    method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)
  });
  if(!res.ok){
    alert('Fehler bei der Planung. Bitte später erneut versuchen.');
    return;
  }
  const data = await res.json();

  dist.textContent = data.distance_km.toFixed(1)+' km';
  cost.textContent = fmtEur.format(data.cost_eur);
  erst.textContent = fmtEur.format(data.reimbursement_eur);
  dur.textContent  = data.total_h.toFixed(2)+' h';
  klar.textContent = data.summary;
  result.hidden = false;
});

// PDF: Antrag (Pilot – Platzierung grob, bis AcroForm)
document.getElementById('pdfGenehmigung').addEventListener('click', async ()=>{
  const { PDFDocument, StandardFonts } = PDFLib;
  const tplBytes = await fetch('/templates/genehmigung.pdf').then(r=>r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(tplBytes);
  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const draw = (text, x, y)=> page.drawText(String(text||''), {x, y, size:10, font});

  draw(document.getElementById('start').value,  80, 700);
  draw(document.getElementById('ziel').value,   80, 680);
  draw(document.getElementById('datum').value,  80, 660);
  draw(document.getElementById('beginn').value, 80, 640);

  const bytes = await pdfDoc.save();
  download(bytes, 'Dienstreise_Antrag.pdf', 'application/pdf');
});

// PDF: Abrechnung (Pilot)
document.getElementById('pdfAbrechnung').addEventListener('click', async ()=>{
  const { PDFDocument, StandardFonts } = PDFLib;
  const tplBytes = await fetch('/templates/abrechnung.pdf').then(r=>r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(tplBytes);
  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const bytes = await pdfDoc.save();
  download(bytes, 'Dienstreise_Abrechnung.pdf', 'application/pdf');
});

function download(bytes, filename, mime){
  const blob = new Blob([bytes], {type:mime});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
}
