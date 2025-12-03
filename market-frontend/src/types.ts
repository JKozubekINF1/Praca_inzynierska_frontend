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


export interface VehicleData {
  Brand: string;
  Model: string;
  Year: number;
  Mileage: number;
  BodyType: string;
  FuelType: string;
  Engine: string;
}

export interface PartData {
  PartName: string;
  PartNumber?: string;
  Compatibility: string;
}


export interface Announcement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string; 
  imageUrl?: string;
  createdAt: string;
  phoneNumber: string;
  contactPreference: string;
  typeSpecificData: string; 
  
  user?: {
      username: string;
      email: string;
  };
}


export interface SearchResultItem {
  objectID: string;
  id: number;       
  title: string;
  price: number;
  category: string;
  description?: string;
  
  brand?: string;
  year?: number;
  mileage?: number;
}

export interface SearchResponse {
  totalHits: number;
  totalPages: number;
  currentPage: number;
  items: SearchResultItem[];
}