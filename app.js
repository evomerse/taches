function bindEvents(){
  document.getElementById('start').addEventListener('change', async (e)=>{
    const v = e.target.value;
    if(!v) return;
    state.data.start = v;
    await api.save(state.data);
    renderAll();
  });

  document.getElementById('todayBtn').addEventListener('click', ()=>{
    state.currentDate = ymd(new Date());
    renderAll();
  });

  document.getElementById('prevBtn').addEventListener('click', ()=>{
    const d = new Date(state.currentDate+'T00:00:00');
    d.setDate(d.getDate()-1);
    state.currentDate = ymd(d);
    renderAll();
  });

  document.getElementById('nextBtn').addEventListener('click', ()=>{
    const d = new Date(state.currentDate+'T00:00:00');
    d.setDate(d.getDate()+1);
    state.currentDate = ymd(d);
    renderAll();
  });

  document.getElementById('applyDebt').addEventListener('click', async ()=>{
    const who = document.getElementById('debtWho').value;
    const delta = parseInt(document.getElementById('debtDelta').value,10);
    changeDebt(who, delta);
    pushLog({
      date: state.currentDate,
      task: '—',
      scheduled: who,
      actual: who,
      replacement: (delta<0 ? `Rattrapage ${-delta}` : 'Ajustement manuel'),
      ts: Date.now()
    });
    await api.save(state.data);
    renderAll();
  });

  document.getElementById('exportBtn').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(state.data,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'repartition-taches.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('importFile').addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const fr = new FileReader();
    fr.onload = async () => {
      try{
        const obj = JSON.parse(fr.result);
        const merged = {
          start: obj.start || state.data.start || defaultStart(),
          debts: obj.debts || { Nathan:0, Anna:0, Aaron:0 },
          logs: Array.isArray(obj.logs) ? obj.logs : []
        };
        state.data = merged;
        await api.save(state.data);
        renderAll();
      }catch(err){
        alert('Fichier invalide : '+err.message);
      }
    };
    fr.readAsText(f);
  });

  document.getElementById('resetBtn').addEventListener('click', async ()=>{
    if(confirm('Tout effacer ? (données locales)')){
      state.data = { start: defaultStart(), debts: {Nathan:0,Anna:0,Aaron:0}, logs: [] };
      await api.save(state.data);
      renderAll();
    }
  });
}
