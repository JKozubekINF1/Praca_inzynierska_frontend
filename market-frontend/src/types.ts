export interface LoginDto {
    username: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface VehicleDetails {
    id?: number;
    brand: string;
    model: string;
    generation: string;
    year: number;
    mileage: number;
    enginePower: number;
    engineCapacity: number;
    fuelType: string;
    gearbox: string;
    bodyType: string;
    driveType: string;
    color: string;
    vin: string;
    state: string;
}

export interface PartDetails {
    id?: number;
    partName: string;
    partNumber: string;
    compatibility: string;
    state: string;
}

export interface AnnouncementFeature {
    id: number;
    featureName: string;
}

export interface AnnouncementPhoto {
    id: number;
    photoUrl: string;
    isMain: boolean;
}

export interface Announcement {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    createdAt: string;
    expiresAt: string;
    phoneNumber: string;
    contactPreference: string;
    location: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
    photoUrl?: string;
    vehicleDetails?: VehicleDetails;
    partDetails?: PartDetails;
    features: AnnouncementFeature[];
    photos: AnnouncementPhoto[];
    user?: {
        username: string;
        email: string;
    };
}

export interface CreateAnnouncementDto {
    title: string;
    description: string;
    price: number;
    category: string;
    phoneNumber: string;
    contactPreference: string;
    location: string;
    latitude?: number;
    longitude?: number;
    features: string[];
    vehicleDetails?: Omit<VehicleDetails, 'id'>;
    partDetails?: Omit<PartDetails, 'id'>;
    photos?: File[];
}

export interface SearchResultItem {
    objectID: string;
    id: number;
    title: string;
    price: number;
    category: string;
    description?: string;
    location?: string;
    photoUrl?: string;
    createdAt?: string;
    brand?: string;
    model?: string;
    year?: number;
    mileage?: number;
}

export interface SearchResponse {
    totalHits: number;
    totalPages: number;
    currentPage: number;
    items: SearchResultItem[];
}

export interface UserDto {
    username: string;
    email: string;
    name?: string;
    surname?: string;
    phoneNumber?: string;
    hasCompletedProfilePrompt: boolean;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface AnnouncementSummary {
    id: number;
    title: string;
    price: number;
    category: string;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
    photoUrl?: string;
    location: string;
}

export interface User {
    id: number;
    username: string;
    role: string;
    email?: string;
}