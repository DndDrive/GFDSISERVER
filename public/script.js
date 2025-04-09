// Function to add custom fields to the form
function addField() {
  const container = document.getElementById('extraFields');
  const fieldName = prompt("Entrez le nom du champ personnalisé (ex: CR, Speed, etc) :");
  if (!fieldName) return;

  const label = document.createElement('label');
  label.textContent = fieldName + ": ";
  
  const input = document.createElement('input');
  input.name = fieldName;
  input.placeholder = fieldName;
  input.type = 'text';
  
  label.appendChild(input);
  container.appendChild(label);
  container.appendChild(document.createElement('br'));
}

// Update the preview as the user fills the form
document.getElementById('monsterForm').addEventListener('input', updatePreview);

function updatePreview() {
  const form = document.getElementById('monsterForm');
  const data = new FormData(form);
  
  let previewText = '';
  
  // Header: Creature Name and Type
  previewText += (data.get('nom') || 'Nom de la créature') + "\n";
  previewText += (data.get('typeCreature') || 'Type de créature') + "\n";
  previewText += "----------------------------------------\n";
  
  // Defensive Stats
  previewText += "Classe d'armure: " + (data.get('classeArmure') || '-') + "\n";
  previewText += "Points de vie: " + (data.get('pointsVie') || '-') + "\n";
  previewText += "Vitesse: " + (data.get('vitesse') || '-') + "\n";
  previewText += "----------------------------------------\n";
  
  // Ability Scores (all on one line for labels, scores below)
  previewText += "FOR " + (data.get('for') || '-') + "   ";
  previewText += "DEX " + (data.get('dex') || '-') + "   ";
  previewText += "CON " + (data.get('con') || '-') + "   ";
  previewText += "INT " + (data.get('intelligence') || '-') + "   ";
  previewText += "SAG " + (data.get('sag') || '-') + "   ";
  previewText += "CHA " + (data.get('cha') || '-') + "\n";
  previewText += "----------------------------------------\n";
  
  // Other Stats
  previewText += "Sens Perception passive: " + (data.get('perception') || '-') + "\n";
  previewText += "Langues: " + (data.get('langues') || '-') + "\n";
  previewText += "Puissance: " + (data.get('puissance') || '-') + "\n";
  previewText += "----------------------------------------\n";
  
  // Actions
  previewText += "Actions:\n" + (data.get('actions') || '-') + "\n";
  
  // Custom Extra Fields (if any)
  document.querySelectorAll('#extraFields input').forEach(input => {
    if (input.value) {
      previewText += `${input.name}: ${input.value}\n`;
    }
  });
  
  document.getElementById('statBlock').textContent = previewText;
}

// Handle form submission: send the monster to the server
document.getElementById("monsterForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  try {
    const res = await fetch('/api/monsters', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    
    if (result.success) {
      alert("Créature enregistrée !");
      form.reset();
      document.getElementById('extraFields').innerHTML = '';
      updatePreview();
    } else {
      alert("Erreur lors de l'enregistrement.");
    }
  } catch (error) {
    console.error(error);
    alert("Une erreur s'est produite.");
  }
});
