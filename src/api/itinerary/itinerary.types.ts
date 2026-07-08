export interface ItineraryType {
    _id?: string;           
    tripId: Object;        
    title: string;
    description?: string;   
    date: Date;         
    order?: number;
    activities: string[];         
    createdAt?: string;
    updatedAt?: string;
};