export const onRequestPost = async ({ request }) => {
  try{
    const body = await request.json();
    if(!body.start || !body.ziel || !body.datum || !body.beginn){
      return json(400, {error:'Pflichtangaben fehlen (Start, Ziel, Datum, Beginn).'});
    }

    // DEMO-Logik – Platzhalter bis OSRM/OCM:
    const distance_oneway_km = 42.0;
    const distance_km_total  = distance_oneway_km * 2;

    const rate = body.interesse === 'mit' ? 0.38 : 0.25;
    let reimbursement_eur = distance_km_total * rate;
    if(rate === 0.25) reimbursement_eur = Math.min(reimbursement_eur, 125);

    let cost_eur = 0;
    if(body.fahrzeug === 'bev'){    cost_eur = distance_km_total * 0.158/100 * 0.59 * 100; }
    if(body.fahrzeug === 'diesel'){ cost_eur = distance_km_total * 0.062/100 * 1.78 * 100; }
    if(body.fahrzeug === 'petrol'){ cost_eur = distance_km_total * 0.068/100 * 1.85 * 100; }

    const drive_h = distance_km_total / 115;
    const total_h = drive_h + 0.1 + 0.25 + (body.fahrzeug==='bev'?0.5:0.1);

    const summary = `Gesamtdistanz ${distance_km_total.toFixed(1)} km. Gesamtkosten ca. ${cost_eur.toFixed(2)} €. Erstattung ${reimbursement_eur.toFixed(2)} €.`;

    return json(200, { distance_km: distance_km_total, cost_eur, reimbursement_eur, total_h, summary });
  }catch(err){
    return json(500, {error:'Unerwarteter Fehler', detail:String(err?.message||err)});
  }
};

function json(status, obj){
  return new Response(JSON.stringify(obj), {status, headers:{'content-type':'application/json; charset=utf-8'}});
}
