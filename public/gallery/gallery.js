document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/monsters')
    .then(res => res.json())
    .then(monsters => {
      const container = document.getElementById('monster-gallery');
      monsters.forEach(monster => {
        const block = document.createElement('div');
        block.className = 'statblock';

        // Build the inner HTML using keys from your JSON
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
    })
    .catch(err => console.error("Erreur lors du chargement des monstres:", err));
});
