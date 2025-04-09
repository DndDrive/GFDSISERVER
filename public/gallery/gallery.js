document.addEventListener('DOMContentLoaded', async () => {
  const LOCAL_KEY = 'monsters';
  const API_URL = 'https://gfdsiserver.onrender.com/api/monsters';

  function getLocalMonsters() {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveLocalMonsters(monsters) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(monsters));
  }

  function isSameMonster(a, b) {
    return a.nom === b.nom; // ou par ID si tu en as un
  }

  try {
    const localMonsters = getLocalMonsters();
    const res = await fetch(API_URL);
    const remoteMonsters = await res.json();

    const newMonsters = remoteMonsters.filter(remote => {
      return !localMonsters.some(local => isSameMonster(local, remote));
    });

    if (newMonsters.length > 0) {
      console.log(`✨ ${newMonsters.length} nouveau(x) monstre(s) trouvé(s) !`);
      const updatedList = [...localMonsters, ...newMonsters];
      saveLocalMonsters(updatedList);
    }

    const allMonsters = getLocalMonsters();
    const container = document.getElementById('monster-gallery');
    container.innerHTML = '';

    allMonsters.forEach(monster => {
      const block = document.createElement('div');
      block.className = 'statblock';

      block.innerHTML = `
        ${ monster.imageUrl ? `<img src="${monster.imageUrl}" alt="${monster.nom}" style="max-width:100%;">` : '' }
        <h2>${monster.nom}</h2>
        <div>${monster.typeCreature || 'Type inconnu'}</div>
        <div class="divider"></div>
        <div><strong>CA</strong> ${monster.classeArmure}</div>
        <div><strong>PV</strong> ${monster.pointsVie}</div>
        <div><strong>Vitesse</strong> ${monster.vitesse}</div>
        <div class="divider"></div>
        <div class="abilities">
          <div><strong>FOR</strong><br>${monster.for}</div>
          <div><strong>DEX</strong><br>${monster.dex}</div>
          <div><strong>CON</strong><br>${monster.con}</div>
          <div><strong>INT</strong><br>${monster.intelligence}</div>
          <div><strong>SAG</strong><br>${monster.sag}</div>
          <div><strong>CHA</strong><br>${monster.cha}</div>
        </div>
        <div class="divider"></div>
        <div><strong>Perception passive</strong> ${monster.perception || '—'}</div>
        <div><strong>Langues</strong> ${monster.langues || '—'}</div>
        <div><strong>Puissance</strong> ${monster.puissance || '—'}</div>
        <div class="divider"></div>
        <div><strong>Actions</strong><br>${monster.actions || '—'}</div>
      `;

      container.appendChild(block);
    });

  } catch (error) {
    console.error("❌ Erreur de chargement :", error);
  }
});
