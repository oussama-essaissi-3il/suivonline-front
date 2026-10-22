// Types qui correspondent EXACTEMENT aux DTO du back (meme noms de champs)

export type Role = 'DEVELOPPEUR' | 'RESPONSABLE'
export type StatutProjet = 'EN_COURS' | 'CLOTURE'

export interface Utilisateur {
  id: number
  nom: string
  prenom: string
  email: string
  role: Role
}

export interface LoginResponse {
  token: string
  utilisateur: Utilisateur
}

export interface Serveur {
  id: number
  nom: string
  description: string | null
  nbProjets: number
}

export interface Projet {
  id: number
  nom: string
  description: string | null
  quotaHeures: number
  statut: StatutProjet
  dateCloture: string | null
  serveurId: number
  serveurNom: string
  minutesConsommees: number
  enDepassement: boolean
}

export interface Contribution {
  id: number
  dureeMinutes: number
  dateContrib: string
  projetId: number
  projetNom: string
  utilisateurId: number
  utilisateurNomComplet: string
}

export interface TempsDeveloppeur {
  utilisateurId: number
  nom: string
  prenom: string
  totalMinutes: number
}

export interface ProjetDetail {
  projet: Projet
  developpeurs: Utilisateur[]
  contributions: Contribution[]
  tempsParDeveloppeur: TempsDeveloppeur[]
}

export interface RecapProjet {
  projetId: number
  projetNom: string
  totalMinutes: number
}
export interface Recap {
  parProjet: RecapProjet[]
  totalMinutes: number
}

export interface Dashboard {
  debut: string
  fin: string
  tempsParDeveloppeur: TempsDeveloppeur[]
  projetsEnDepassement: Projet[]
  projetsCloturesRecemment: Projet[]
}
