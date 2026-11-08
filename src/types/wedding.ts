export type StageAccent = 'mint' | 'rose' | 'gold' | 'lilac';

export interface CoupleDetails {
  readonly partnerOne: string;
  readonly partnerTwo: string;
  readonly monogram: string;
}

export interface VenueCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface VenueDetails {
  readonly name: string;
  readonly city: string;
  readonly country: string;
  readonly address: string;
  readonly mapsUrl: string;
  readonly parkingName: string;
  readonly parkingMapsUrl: string;
  readonly coordinates: VenueCoordinates;
  readonly arrivalNote: string;
  readonly parkingNote: string;
  readonly accessibilityNote: string;
}

export interface CalendarEventConfig {
  readonly title: string;
  readonly details: string;
  readonly location: string;
  readonly durationHours: number;
}

export interface WeddingDetails {
  readonly couple: CoupleDetails;
  readonly weddingDateIso: string;
  readonly weddingDateDisplay: string;
  readonly weddingDayLabel: string;
  readonly rsvpDeadlineIso: string;
  readonly rsvpDeadlineDisplay: string;
  readonly dressCode: string;
  readonly contactEmail: string;
  readonly venue: VenueDetails;
  readonly calendar: CalendarEventConfig;
  readonly tickerMessages: readonly string[];
}

export interface TimelineStage {
  readonly id: string;
  readonly stageNumber: string;
  readonly time: string;
  readonly title: string;
  readonly tagline: string;
  readonly location: string;
  readonly accent: StageAccent;
  readonly description: string;
  readonly objectives: readonly string[];
  readonly note: string;
}

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export type DietaryOptionId = 'vegetarian' | 'vegan' | 'glutenFree' | 'allergies';

export interface DietaryOption {
  readonly id: DietaryOptionId;
  readonly label: string;
  readonly description: string;
}

export type AttendanceStatus = 'attending' | 'declined';

export interface RsvpResponse {
  readonly version: number;
  readonly attendance: AttendanceStatus;
  readonly guestName: string;
  readonly guestEmail: string;
  readonly partySize: number;
  readonly guestNames: string;
  readonly dietaryPreferences: readonly DietaryOptionId[];
  readonly allergyNotes: string;
  readonly accessibilityNotes: string;
  readonly songRequest: string;
  readonly declineMessage: string;
  readonly submittedAt: string;
}

export interface RsvpSaveResult {
  readonly savedLocally: boolean;
  readonly syncedRemotely: boolean;
  readonly endpointConfigured: boolean;
  readonly remoteError: string | null;
}

export type SideQuestSlug = 'bachelor' | 'bachelorette' | 'united';

export type AppRoutePath =
  | '/'
  | '/side-quest/bachelor'
  | '/side-quest/bachelorette'
  | '/side-quest/united';

export interface SideQuestCheckpoint {
  readonly step: string;
  readonly time: string;
  readonly title: string;
  readonly location: string;
  readonly summary: string;
}

export interface SideQuestConfig {
  readonly slug: SideQuestSlug;
  readonly path: `/side-quest/${SideQuestSlug}`;
  readonly shortLabel: string;
  readonly tabBadge: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly hostLabel: string;
  readonly accent: StageAccent;
  readonly dateDisplay: string;
  readonly locationDisplay: string;
  readonly dressCode: string;
  readonly vibeLevel: string;
  readonly description: string;
  readonly loadoutItems: readonly string[];
  readonly checkpoints: readonly SideQuestCheckpoint[];
  readonly designPromptHint: string;
}
