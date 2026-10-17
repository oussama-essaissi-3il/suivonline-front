// Types qui correspondent EXACTEMENT aux DTO du back (meme noms de champs)

export type Role = 'DEVELOPPEUR' | 'RESPONSABLE'
export type StatutProjet = 'EN_COURS' | 'CLOTURE'

// UtilisateurDto
export interface Utilisateur {
  id: number
  nom: string
  prenom: string
  email: string
  role: Role
}

// LoginResponse
export interface LoginResponse {
  token: string
  utilisateur: Utilisateur
}

// ServeurDto
export interface Serveur {
  id: number
  nom: string
  description: string | null
  nbProjets: number
}

// ProjetDto
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

// ContributionDto
export interface Contribution {
  id: number
  dureeMinutes: number
  dateContrib: string
  projetId: number
  projetNom: string
  utilisateurId: number
  utilisateurNomComplet: string
}

// TempsDeveloppeurDto
export interface TempsDeveloppeur {
  utilisateurId: number
  nom: string
  prenom: string
  totalMinutes: number
}

// ProjetDetailDto
export interface ProjetDetail {
  projet: Projet
  developpeurs: Utilisateur[]
  contributions: Contribution[]
  tempsParDeveloppeur: TempsDeveloppeur[]
}

// RecapProjetDto + RecapDto
export interface RecapProjet {
  projetId: number
  projetNom: string
  totalMinutes: number
}
export interface Recap {
  parProjet: RecapProjet[]
  totalMinutes: number
}

// DashboardDto
export interface Dashboard {
  debut: string
  fin: string
  tempsParDeveloppeur: TempsDeveloppeur[]
  projetsEnDepassement: Projet[]
  projetsCloturesRecemment: Projet[]
}
