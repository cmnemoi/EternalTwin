use etwin_core::dinoparc::{DinoparcLocationId, DinoparcSkill};

/// Represents a location in the official Dinoparc game
///
/// The names are the ones displayed on the HTML parts of the website.
/// The Flash-based map uses slightly different names. Most of the differences
/// are related to the case. In french, the Flash map uses "Bazar de Ter'Magik"
/// where the HTML parts use "Bazar de l'île de Jazz".
#[derive(Debug, Copy, Clone, Ord, PartialOrd, PartialEq, Eq, Hash)]
pub struct DinoparcLocation {
  pub id: DinoparcLocationId,
  pub name_fr: &'static str,
  pub name_en: &'static str,
  pub name_es: &'static str,
}

impl DinoparcLocation {
  const unsafe fn new_unchecked(id: u8, name_fr: &'static str, name_en: &'static str, name_es: &'static str) -> Self {
    Self {
      id: DinoparcLocationId::new_unchecked(id),
      name_fr,
      name_en,
      name_es,
    }
  }
}

#[rustfmt::skip]
pub const LOCATIONS: [DinoparcLocation; 23] = unsafe {
  [
    DinoparcLocation::new_unchecked(0, "Dinoville", "Dinotown", "Dinovilla"),
    DinoparcLocation::new_unchecked(1, "Caverne d'Irma", "Sparky's Cave", "Caverna de Lola"),
    DinoparcLocation::new_unchecked(2, "Clairière", "Clearing in the Wood", "Claro del Bosque"),
    DinoparcLocation::new_unchecked(3, "Dinoplage", "Dinobeach", "Dinoplaya"),
    DinoparcLocation::new_unchecked(4, "Barrage Routier", "Check Point", "Barrera de Caminos"),
    DinoparcLocation::new_unchecked(5, "Falaises de l'Ermite", "Hermitage Cliffs", "Acantilados de la Ermita"),
    DinoparcLocation::new_unchecked(6, "Mont Dino", "Mount Dinoz", "Monte Dino"),
    DinoparcLocation::new_unchecked(7, "Porte de Granit", "Granite Door", "Puerta de Granito"),
    DinoparcLocation::new_unchecked(8, "Chemin des Gredins", "Bandits Road", "Camino de los Bribones"),
    DinoparcLocation::new_unchecked(9, "Forêt Millénaire", "Ancient Wood", "Bosque Milenario"),
    DinoparcLocation::new_unchecked(10, "Temple Bouddhiste", "Buddhist Temple", "Templo Budista"),
    DinoparcLocation::new_unchecked(11, "Port de la Prune", "Port of Saint Berry", "Puerto de Santa Moría"),
    DinoparcLocation::new_unchecked(12, "L'Ile de la Pitié", "Pity Island", "Isla de la Piedad"),
    DinoparcLocation::new_unchecked(13, "Ruines Mayinca", "Mayinca Ruins", "Ruinas Mayinca"),
    DinoparcLocation::new_unchecked(14, "Crédit Arboricole", "Institute of Olimpic Credit", "Instituto de Crédito Olímpico"),
    DinoparcLocation::new_unchecked(15, "Bazar de l'île de Jazz", "Jazz island Market", "Mercado de la Isla de Jazz"),
    DinoparcLocation::new_unchecked(16, "Marais collant", "Sticky Swamp", "Pantano Pegajoso"),
    DinoparcLocation::new_unchecked(17, "Jungle des Ouistitis", "Wistitis Jungle", "Jungla de los Wistitis"),
    DinoparcLocation::new_unchecked(18, "Bordeciel", "Bordesky", "Burdecielo"),
    DinoparcLocation::new_unchecked(19, "Source chantante", "Singing Fountain", "Fuente Cantante"),
    DinoparcLocation::new_unchecked(20, "Caverne de l'anomalie", "Anomaly Cavern", "Caverna de la Anomalí"),
    DinoparcLocation::new_unchecked(21, "Hutte du vieux sage", "Wise Old Man's shack", "Casucha del viejo sabio"),
    DinoparcLocation::new_unchecked(22, "Cratère du grand Tout-Chaud", "Crater of the Great Lord Burn-All", "Cráter del Gran Señor-Todo-Quema"),
  ]
};

#[derive(Debug, Copy, Clone, Ord, PartialOrd, PartialEq, Eq, Hash)]
pub struct DinoparcSkillMeta {
  pub skill: DinoparcSkill,
  pub name_fr: &'static str,
  pub name_en: &'static str,
  pub name_es: &'static str,
}

impl DinoparcSkillMeta {
  const fn new(skill: DinoparcSkill, name_fr: &'static str, name_en: &'static str, name_es: &'static str) -> Self {
    Self {
      skill,
      name_fr,
      name_en,
      name_es,
    }
  }
}

#[rustfmt::skip]
pub const SKILLS: [DinoparcSkillMeta; 31] = [
  DinoparcSkillMeta::new(DinoparcSkill::Dexterity, "Agilité", "Dexterity", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Intelligence, "Intelligence", "Intelligence", "Inteligencia"),
  DinoparcSkillMeta::new(DinoparcSkill::Perception, "Perception", "Perception", "Percepción"),
  DinoparcSkillMeta::new(DinoparcSkill::Stamina, "Endurance", "Stamina", "Resistencia"),
  DinoparcSkillMeta::new(DinoparcSkill::Strength, "Force", "Strength", "Fuerza"),
  DinoparcSkillMeta::new(DinoparcSkill::Dig, "Fouiller", "Dig", "Excavar"),
  DinoparcSkillMeta::new(DinoparcSkill::Medicine, "Medecine", "Medicine", "Medicina"),
  DinoparcSkillMeta::new(DinoparcSkill::Swim, "Natation", "Swim", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Camouflage, "Camouflage", "Camouflage", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Climb, "Escalade", "Climb", ""),
  DinoparcSkillMeta::new(DinoparcSkill::MartialArts, "Arts Martiaux", "Martial Arts", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Steal, "Voler", "Steal", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Provoke, "Taunt", "Provoke", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Bargain, "Commerce", "Bargain", "Comercio"),
  DinoparcSkillMeta::new(DinoparcSkill::Navigation, "Navigation", "Navigation", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Run, "Course", "Run", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Survival, "Survie", "Survival", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Strategy, "Stratégie", "Strategy", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Music, "Musique", "Music", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Jump, "Saut", "Jump", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Cook, "Cuisine", "Cook", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Luck, "Chance", "Luck", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Counterattack, "Contre Attaque", "Counterattack", ""),
  DinoparcSkillMeta::new(DinoparcSkill::Juggle, "Rock", "Juggle", ""),
  DinoparcSkillMeta::new(DinoparcSkill::FireProtection, "", "", ""),
  DinoparcSkillMeta::new(DinoparcSkill::FireApprentice, "Apprentis Feu", "Fire Apprentice", ""),
  DinoparcSkillMeta::new(DinoparcSkill::EarthApprentice, "Apprentis Terre", "Earth Apprentice", ""),
  DinoparcSkillMeta::new(DinoparcSkill::WaterApprentice, "Apprentis Eau", "Water Apprentice", ""),
  DinoparcSkillMeta::new(DinoparcSkill::ThunderApprentice, "Apprentis Foudre", "Thunder Apprentice", ""),
  DinoparcSkillMeta::new(DinoparcSkill::ShadowPower, "Pouvoir Sombre", "Shadow Power", ""),
  DinoparcSkillMeta::new(DinoparcSkill::TotemThief, "Voleur de Totem", "", ""),
];